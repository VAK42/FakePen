export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing Environment Variable: ${key}`);
  }
  return value;
}
export const env = {
  sessionSecret: getEnv('SESSIONSECRET', '4b031157876d971be71dfb152b8dfd2718bf9475e5ae5a84344c5847f92cd7c1f706c36ee29f44b6bd75a6cd876bb0500dfee2ce183cdedd6bc67faf5c4214ef'),
  nodeEnv: getEnv('NODEENV', 'development'),
  isDevelopment: process.env.NODEENV !== 'production',
  isProduction: process.env.NODEENV === 'production'
};