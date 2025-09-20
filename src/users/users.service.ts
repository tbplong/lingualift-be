import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export interface User {
  userId: number;
  username: string;
  password: string;
  hash: string;
}

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      hash: '$2a$10$hGt87oV7yvBg1icc1cz9/Ok5bHM7VuEk2Pb5zmgJLT8mUHqgDlzNq',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      hash: '$2a$10$h20LBYZdJVlq3g4kZQQjnOgRi3vkP/Mj5UM4uEEqFFxWRqOsZViKW',
    },
  ];

  findOne(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
}
