import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

// Better Auth configuration
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
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
