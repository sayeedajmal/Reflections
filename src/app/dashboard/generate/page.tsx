
import { GenerateIdeasForm } from "./generate-form";

export default function GeneratePage() {
  return (
    <div className="space-y-8">
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <h1 className="text-3xl font-bold font-headline">
          AI Blog Post Assistant
        </h1>
        <p className="text-muted-foreground">
          Unleash your creativity. Generate blog post ideas and outlines with AI.
        </p>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <GenerateIdeasForm />
      </div>
    </div>
  );
}
