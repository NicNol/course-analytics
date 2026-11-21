export const completeEnv = {
  MONGODB_URI: "mongodb://localhost:27017/course-analytics",
  CRON_KEY: "test-cron-key",
  GOOGLE_CLIENT_EMAIL: "scraper@course-analytics.iam.gserviceaccount.com",
  GOOGLE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n",
};

export const envNames = Object.keys(completeEnv) as (keyof typeof completeEnv)[];
