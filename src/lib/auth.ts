import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fixlab");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "fixlab_super_secret_key_123456789",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer" },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
  trustedOrigins: ["http://localhost:3000"],
});