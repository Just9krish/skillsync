import { LoginForm } from '@/components/auth/login-form';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">SkillSync</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            AI-Powered Learning Path Manager
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
