"use server";

import { generateBlogPostIdeas } from "@/ai/flows/generate-blog-post-ideas";
import { rephraseText } from "@/ai/flows/rephrase-text";
import { z } from "zod";

const IdeaGenerationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  keywords: z.string().min(3, "Keywords must be at least 3 characters"),
});

export interface ActionState {
  ideas: string[];
  outlines: string[];
  error?: string;
  message?: string;
}

export async function generateIdeasAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const validatedFields = IdeaGenerationSchema.safeParse({
      topic: formData.get("topic"),
      keywords: formData.get("keywords"),
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        error: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const { topic, keywords } = validatedFields.data;

    const result = await generateBlogPostIdeas({ topic, keywords, numIdeas: 5 });

    if (!result || !result.ideas || !result.outlines) {
        return {
            ...prevState,
            error: "Failed to generate ideas. The AI returned an unexpected result."
        }
    }

    return {
      ideas: result.ideas,
      outlines: result.outlines,
      message: "Successfully generated ideas!",
    };
  } catch (error) {
    console.error("Error generating blog post ideas:", error);
    return {
        ...prevState,
        error: "An unexpected error occurred while generating ideas. Please try again later."
    }
  }
}

export async function rephraseTextAction(text: string): Promise<{rephrasedText?: string, error?: string}> {
    if (!text) {
        return { error: 'No text selected to rephrase.' };
    }
    try {
        const result = await rephraseText({ text });
        if (!result || !result.rephrasedText) {
            return { error: 'Failed to rephrase text. AI returned an unexpected result.' };
        }
        return { rephrasedText: result.rephrasedText };
    } catch (error) {
        console.error('Error rephrasing text:', error);
        return { error: 'An unexpected error occurred while rephrasing text.' };
    }
}
