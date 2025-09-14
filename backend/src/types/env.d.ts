declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			PORT: string;
			DATABASE_URL: string;

			BETTER_AUTH_SECRET: string;
			BETTER_AUTH_URL: string;
			GITHUB_CLIENT_ID: string;
			GITHUB_CLIENT_SECRET: string;

			REDIS_URL: string;
			REDIS_PREFIX: string;

			OPENAI_API_KEY: string;
			OPENAI_BASE_URL: string;

			SMTP_HOST: string;
			SMTP_PORT: string;
			SMTP_USER: string;
			SMTP_PASS: string;
			SMTP_FROM_EMAIL: string;

			S3_BUCKET_NAME: string;
			S3_ENDPOINT: string;
			S3_REGION: string;
			S3_ACCESS_KEY_ID: string;
			S3_SECRET_ACCESS_KEY: string;

			FRONTEND_URL: string;
		}
	}
}

export {};
