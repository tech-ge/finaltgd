import { z } from 'zod';

const BaseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  TZ: z.string().default('Africa/Nairobi'),
});

export type BaseEnv = z.infer<typeof BaseSchema>;

export function loadBaseEnv(source: NodeJS.ProcessEnv = process.env): BaseEnv {
  const parsed = BaseSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`invalid_base_environment: ${issues}`);
  }
  return parsed.data;
}

export function requireEnv(
  source: NodeJS.ProcessEnv,
  key: string,
  minLength = 1,
): string {
  const value = source[key];
  if (typeof value !== 'string' || value.length < minLength) {
    throw new Error(`missing_or_invalid_env: ${key}`);
  }
  return value;
}

export function loadServiceEnv<T extends z.ZodTypeAny>(
  schema: T,
  source: NodeJS.ProcessEnv = process.env,
): z.infer<T> {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`invalid_service_environment: ${issues}`);
  }
  return parsed.data;
}

export const PostgresUrlSchema = z
  .string()
  .min(1)
  .refine((v) => v.startsWith('postgres://') || v.startsWith('postgresql://'), {
    message: 'must_be_postgres_url',
  });

export const RedisUrlSchema = z
  .string()
  .min(1)
  .refine((v) => v.startsWith('redis://') || v.startsWith('rediss://'), {
    message: 'must_be_redis_url',
  });

export const MongoUrlSchema = z
  .string()
  .min(1)
  .refine((v) => v.startsWith('mongodb://') || v.startsWith('mongodb+srv://'), {
    message: 'must_be_mongo_url',
  });

export const HttpUrlSchema = z
  .string()
  .min(1)
  .refine((v) => v.startsWith('https://') || v.startsWith('http://'), {
    message: 'must_be_http_url',
  });
