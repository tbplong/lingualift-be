import { ConfigType, registerAs } from '@nestjs/config';
import { z } from 'zod';

type NodeEnv = 'production' | 'development' | 'local' | 'test';

type CommonConfig = {
  nodeEnv: NodeEnv;
  port: number;
};

export const commonConfig = registerAs('common', () => {
  const values: CommonConfig = {
    nodeEnv: <NodeEnv>process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 3000,
  };

  const validationSchema = z.object({
    nodeEnv: z.enum(['development', 'production', 'local', 'test']),
    port: z.number().int().positive(),
  });

  validationSchema.parse(values);

  return values;
});

export type CommonConfigType = ConfigType<typeof commonConfig>;
