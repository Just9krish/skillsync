import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, Target, Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   );
  // }

  // if (isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  //       <div className="container mx-auto px-4 py-16">
  //         <div className="text-center mb-12">
  //           <h1 className="text-4xl font-bold text-gray-900 mb-4">
  //             Welcome back, {user?.name}!
  //           </h1>
  //           <p className="text-xl text-gray-600 mb-8">
  //             Ready to continue your learning journey?
  //           </p>
  //           <Link href="/dashboard">
  //             <Button size="lg" className="text-lg px-8 py-3">
  //               Go to Dashboard
  //               <ArrowRight className="ml-2 h-5 w-5" />
  //             </Button>
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-svh bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">SkillSync</h1>
          <p className="text-xl text-text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-Powered Learning Path Manager that helps you plan, track, and
            achieve your learning goals with intelligent suggestions and
            progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>
                Create and manage your learning objectives with clear milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set specific, measurable goals and track your progress with
                visual indicators and detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Get personalized learning paths and intelligent recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your goals and suggests optimal learning paths,
                resources, and study schedules.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your learning journey with detailed insights and
                analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize your progress, identify areas for improvement, and
                celebrate your achievements.
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center py-8 mt-16 text-sm text-muted-foreground">
          Built with Next.js 15, TypeScript, MongoDB, and Better Auth
        </footer>
      </div>
    </div>
  );
}
