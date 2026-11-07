import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("impactpulse");

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [baseURL],

  emailAndPassword: {
    enabled: true,
    // The assignment requires a minimum of 6 characters; Better Auth defaults
    // to 8, which would reject otherwise valid registrations.
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const password = ctx.body?.password;

      if (
        typeof password !== "string" ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must include at least one uppercase and one lowercase letter.",
        });
      }
    }),
  },

  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: "impactpulse-api",
      },
    }),
  ],
});
