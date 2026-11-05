import { betterAuth } from "better-auth";
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

  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: "impactpulse-api",
      },
    }),
  ],
});
