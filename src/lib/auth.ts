import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

// MongoDB connection
const client = new MongoClient(
  process.env.MONGODB_URI ||
    'mongodb+srv://just9krish:o4DRFmC7lan4PTEr@cluster0.uf4un.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/skillsync'
);
const db = client.db('skillsync');

// Better Auth configuration
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true for production
    minPasswordLength: 6,
    maxPasswordLength: 20,
  },
  socialProviders: {
    // Add social providers later if needed
  },
  user: {
    additionalFields: {
      bio: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
      avatar: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
});

// Export the client for direct database operations if needed
export { client, db };
