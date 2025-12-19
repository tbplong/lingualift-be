import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuizAttempt, QuizAttemptDocument } from '../quiz-attempts/schemas/quiz-attempt.schema';

/**
 * Get Monday 00:00:00 of current week
 */
function getStartOfWeekMonday(date: Date = new Date()): Date {
  const d = new Date(date);

  d.setHours(d.getHours() + 7);

  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

/**
 * Get next Monday 00:00:00 (exclusive end)
 */
function getEndOfWeekExclusive(date: Date = new Date()): Date {
  const start = getStartOfWeekMonday(date);
  const end = new Date(start);

  end.setDate(start.getDate() + 7);

  return end;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(QuizAttempt.name)
    private readonly quizAttemptModel: Model<QuizAttemptDocument>,
  ) {}

  async getSummary(userId: string) {
    const objectUserId = new Types.ObjectId(userId);

    const weekStart = getStartOfWeekMonday();
    const weekEnd = getEndOfWeekExclusive();

    const [result] = await this.quizAttemptModel.aggregate<{
      timeSec: number;
      completed: number;
      accuracy: number;
    }>([
      {
        $match: {
          userId: objectUserId,
        },
      },
      {
        $facet: {
          /** ⏱ Time spent THIS WEEK */
          timeThisWeek: [
            {
              $match: {
                startedAt: {
                  $gte: weekStart,
                  $lt: weekEnd,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalSec: { $sum: '$durationSec' },
              },
            },
          ],

          /** ✅ Completed quizzes (ALL TIME) */
          completedAllTime: [
            {
              $match: {
                status: 'finished',
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],

          /** 🎯 Accuracy (ALL TIME, finished only) */
          accuracyAllTime: [
            {
              $match: {
                status: 'finished',
                scorePercent: { $type: 'number' },
              },
            },
            {
              $group: {
                _id: null,
                avg: { $avg: '$scorePercent' },
              },
            },
          ],
        },
      },
      {
        $project: {
          timeSec: {
            $ifNull: [{ $arrayElemAt: ['$timeThisWeek.totalSec', 0] }, 0],
          },
          completed: {
            $ifNull: [{ $arrayElemAt: ['$completedAllTime.count', 0] }, 0],
          },
          accuracy: {
            $ifNull: [{ $arrayElemAt: ['$accuracyAllTime.avg', 0] }, 0],
          },
        },
      },
    ]);

    return {
      timeThisWeekMin: Math.round((result?.timeSec ?? 0) / 60),
      completed: result?.completed ?? 0,
      accuracyPercent: Math.round(result?.accuracy ?? 0),
    };
  }
  async getWeekly(userId: string) {
    const objectUserId = new Types.ObjectId(userId);

    const weekStart = getStartOfWeekMonday();
    const weekEnd = getEndOfWeekExclusive();

    const rows = await this.quizAttemptModel.aggregate<{
      day: string;
      minutes: number;
      completed: number;
      accuracy: number;
    }>([
      {
        $match: {
          userId: objectUserId,
          startedAt: {
            $gte: weekStart,
            $lt: weekEnd,
          },
        },
      },
      {
        $addFields: {
          day: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$startedAt',
              timezone: '+07:00',
            },
          },
        },
      },
      {
        $group: {
          _id: '$day',

          /** ⏱ Total time per day (minutes) */
          minutes: {
            $sum: {
              $divide: ['$durationSec', 60],
            },
          },

          /** ✅ Completed quizzes per day */
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'finished'] }, 1, 0],
            },
          },

          /** 🎯 Accuracy per day (finished only) */
          accuracy: {
            $avg: {
              $cond: [{ $eq: ['$status', 'finished'] }, '$scorePercent', null],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          minutes: { $round: ['$minutes', 1] },
          completed: 1,
          accuracy: { $round: [{ $ifNull: ['$accuracy', 0] }, 0] },
        },
      },
      { $sort: { day: 1 } },
    ]);

    /** Map results by day for easy fill */
    const map = new Map<string, { minutes: number; completed: number; accuracy: number }>();

    for (const r of rows) {
      map.set(r.day, {
        minutes: r.minutes ?? 0,
        completed: r.completed ?? 0,
        accuracy: r.accuracy ?? 0,
      });
    }

    /** Fill missing days (Mon → Sun) with 0 */
    const points = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);

      const key = d.toISOString().slice(0, 10);

      const v = map.get(key) ?? {
        minutes: 0,
        completed: 0,
        accuracy: 0,
      };

      return {
        date: key,
        ...v,
      };
    });

    return {
      weekStart,
      weekEnd: new Date(weekEnd.getTime() - 1),
      points,
      sparklines: {
        minutes: points.map((p) => p.minutes),
        completed: points.map((p) => p.completed),
        accuracy: points.map((p) => p.accuracy),
      },
    };
  }
}
