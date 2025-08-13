
"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Bot, Lightbulb, Loader2, PenSquare } from "lucide-react";
import { generateIdeasAction, type ActionState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: ActionState = {
  ideas: [],
  outlines: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" /> Generate Ideas
        </>
      )}
    </Button>
  );
}

export function GenerateIdeasForm() {
  const [state, formAction] = useFormState(generateIdeasAction, initialState);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Idea Generator</CardTitle>
          <CardDescription>
            Provide a topic and keywords to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., 'The Future of Web Development'"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                name="keywords"
                placeholder="e.g., 'AI, React, Server Components'"
                required
              />
            </div>
            <SubmitButton />
          </form>
          {state.error && (
             <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{JSON.stringify(state.error)}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline flex items-center">
            <Lightbulb className="mr-2 h-6 w-6 text-primary" /> Generated Ideas
        </h2>
        {state.ideas.length === 0 && !state.error ? (
          <Card className="flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <Bot size={48} className="mx-auto" />
              <p className="mt-2">Your generated ideas will appear here.</p>
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {state.ideas.map((idea, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="font-semibold text-left">
                      {idea}
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm dark:prose-invert space-y-4">
                        <p>{state.outlines[index]}</p>
                        <Button asChild size="sm">
                          <Link href={`/dashboard/new?title=${encodeURIComponent(idea)}&content=${encodeURIComponent(state.outlines[index])}`}>
                            <PenSquare className="mr-2 h-4 w-4" />
                            Create Post
                          </Link>
                        </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
