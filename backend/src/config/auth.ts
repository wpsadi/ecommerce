import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, organization } from "better-auth/plugins";
import { transporter } from "#/src/config/smtp";
import { ac, owner } from "#config/permissions";
import { prisma } from "#config/prisma";
import { Origins } from "#src/constants/origins";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "mongodb", // or "mysql", "postgresql", ...etc
		debugLogs: process.env.NODE_ENV === "development",
	}),
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
	trustedOrigins: Origins,
	session: {
		expiresIn: 7 * 60 * 60, // 1 hour
		updateAge: 60 * 60, // 1 hour (every 1 hour the session expiration is updated)
	},
	plugins: [
		organization({
			ac,
			roles: {
				owner,
			},
		}),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in") {
					// Send the OTP for sign in
					await transporter.sendMail({
						to: email,
						subject: "Your Sign-In OTP",
						text: `Your OTP for sign-in is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
					});
				}
			},
			allowedAttempts: 5, // Allow 5 attempts before invalidating the OTP
			expiresIn: 300,
		}),
	],
	account: {
		encryptOAuthTokens: true,
	},
	rateLimit: {
		window: 10, // time window in seconds
		max: 100, // max requests in the window
	},
	advanced: {
		cookiePrefix: "ecommerce",
	},
	logger: {
		level: "info",
	},

	appName: "Ecommerce",
	emailVerification: {
		async afterEmailVerification(user, _request) {
			// console.log(`User with email ${user.email} has verified their email.`);
			// console.log("Request details:", request);
			await transporter.sendMail({
				to: user.email,
				subject: "Email Verification Successful",
				text: `Hello ${user.name},\n\nYour email has been successfully verified.\n\nThank you!`,
			});
		},

		async sendVerificationEmail(data, _request) {
			await transporter.sendMail({
				to: data.user.email,
				subject: "Verify Your Email Address",
				text: `Hello ${data.user.name},\n\n We received a request for email verification. Please verify your email by clicking the link below:\n\n${data.url}\n\nThank you!`,
			});
		},
		sendOnSignIn: true,
		sendOnSignUp: true,

		autoSignInAfterVerification: true,
		expiresIn: 60 * 60 * 24, // 1 day
	},

	secondaryStorage: {
		get: async (key) => {
			const { redis } = await import("#config/redis");
			await redis.connect();
			const data = await redis.get(`${process.env.REDIS_PREFIX}:auth:${key}`);
			await redis.close();
			return data;
		},
		set: async (key, value, ttl) => {
			const { redis } = await import("#config/redis");
			await redis.connect();
			if (ttl) {
				await redis.set(`${process.env.REDIS_PREFIX}:auth:${key}`, value);
				await redis.expire(`${process.env.REDIS_PREFIX}:auth:${key}`, ttl);
			}
			// or for ioredis:
			// if (ttl) await redis.set(key, value, 'EX', ttl)
			else await redis.set(`${process.env.REDIS_PREFIX}:auth:${key}`, value);
			await redis.close();
		},
		delete: async (key) => {
			const { redis } = await import("#config/redis");
			await redis.connect();
			await redis.del(`${process.env.REDIS_PREFIX}:auth:${key}`);
			await redis.close();
		},
	},
});
