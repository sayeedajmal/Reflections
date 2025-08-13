
"use client";

import Link from "next/link";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const navLinks: { href: string, label: string }[] = [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              Reflections
            </span>
          </Link>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
             <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg">
                  Reflections
                </span>
              </Link>
            <div className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-primary text-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            
            <ThemeToggle />
            
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          
          </nav>
        </div>
      </div>
    </header>
  );
}
