
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

const PostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export interface PostActionState {
  error?: string;
  message?: string;
  data?: any;
}

export async function createPost(
  token: string,
  author: any,
  prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  
  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors)
        .map((errors) => errors.join(", "))
        .join(". "),
    };
  }

  const postData = {
    ...validatedFields.data,
    author: author,
    excerpt: validatedFields.data.content.substring(0, 150),
    featuredImageUrl: "https://placehold.co/600x400.png"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/blogposts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });

    const result = await response.json();

    if (!response.ok || (result.status && result.status >= 400)) {
        return { error: result.message || "Failed to create post." };
    }

    revalidatePath("/dashboard");
    return { message: result.message, data: result.data };

  } catch (error) {
     if (error instanceof Error) {
        return { error: "Could not connect to the API service. Please try again later." };
    }
    return { error: "An unexpected error occurred during post creation." };
  }
}

export async function updatePost(
  id: string,
  token: string,
  prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
    const validatedFields = PostSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content"),
        status: formData.get("status"),
    });

    if (!validatedFields.success) {
        return {
            error: Object.values(validatedFields.error.flatten().fieldErrors)
                .map((errors) => errors.join(", "))
                .join(". "),
        };
    }
    
    // In a real app, you might want to fetch the author details again or pass them
    const postData = {
        ...validatedFields.data,
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/blogposts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(postData),
        });

        const result = await response.json();

        if (!response.ok || (result.status && result.status >= 400)) {
            return { error: result.message || "Failed to update post." };
        }

        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/edit/${id}`);
        return { message: result.message };

    } catch (error) {
        if (error instanceof Error) {
            return { error: "Could not connect to the API service." };
        }
        return { error: "An unexpected error occurred during post update." };
    }
}



export async function deletePost(id: string, token: string): Promise<PostActionState> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/blogposts/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const result = await response.json();
            return { error: result.message || "Failed to delete post." };
        }
        
        revalidatePath("/dashboard");
        return { message: "Post deleted successfully." };

    } catch (error) {
       if (error instanceof Error) {
            return { error: "Could not connect to the API service." };
        }
        return { error: "An unexpected error occurred during post deletion." };
    }
}


// These are read-only functions, can be called directly without useActionState
export async function getPostsByAuthor(authorId: string, token: string) {
    if (!authorId || !token) {
        return [];
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/blogposts/author/${authorId}`, {
             headers: {
                "Authorization": `Bearer ${token}`
            },
            // Add caching strategy
            next: { revalidate: 10 } // Revalidate every 10 seconds
        });
        if (!response.ok) {
           const error = await response.json();
           console.error("API Error:", error.message);
           return []; // Return empty array on error
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
}

export async function getPost(id: string, token: string) {
     try {
        const response = await fetch(`${API_BASE_URL}/api/blogposts/${id}`, {
             headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        if (!response.ok) {
           throw new Error("Failed to fetch post.");
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(`Failed to fetch post ${id}:`, error);
        return null;
    }
}
