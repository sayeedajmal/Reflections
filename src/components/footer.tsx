import { BookOpen, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t w-full">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <BookOpen className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} Reflections. All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Github">
                <Github className="h-5 w-5" />
              </a>
            </Button>
             <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
        </div>
      </div>
    </footer>
  );
}
