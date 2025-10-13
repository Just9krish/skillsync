import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function AiAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">Coming soon</p>
      </div>

      <Card className="p-8 text-center">
        <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">AI Assistant Coming Soon</h2>
        <p className="text-muted-foreground">
          We're working on an intelligent AI assistant to help with your
          learning journey.
        </p>
      </Card>
    </div>
  );
}
