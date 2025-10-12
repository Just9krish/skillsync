import { Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Built with SkillSync | Powered by AI
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
