import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Target,
  Brain,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'AI Learning Paths',
    description:
      'Get personalized learning roadmaps powered by advanced AI algorithms',
  },
  {
    icon: Target,
    title: 'Smart Progress Tracking',
    description:
      'Track your goals with intelligent progress monitoring and insights',
  },
  {
    icon: TrendingUp,
    title: 'Personalized Insights',
    description:
      'Receive data-driven recommendations to optimize your learning journey',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SkillSync
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="default">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Learning Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Plan, Track, and{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Accelerate
              </span>{' '}
              Your Learning
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your learning journey with AI-powered path management.
              Get personalized insights, track progress, and achieve your goals
              faster than ever before.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button variant="default" size="lg" className="group">
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {/* <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground">
              Powerful features designed to accelerate your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(feature => (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-xl transition-all duration-300 border border-border bg-gradient-to-br from-card to-card/50"
              >
                <CardContent className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to transform your learning?
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of learners already using SkillSync to achieve
                their goals
              </p>
              <Link href="/register">
                <Button variant="default" size="lg">
                  Start Learning Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* <Footer /> */}
      <Footer />
    </div>
  );
}
