
"use server";

import { z } from "zod";

const API_BASE_URL = process.env.API_BASE_URL;

const SignupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// This will be the shape of the state returned by the actions
export interface AuthState {
  message?: string;
  error?: string;
  data?: any;
}

export async function signupAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // 1. Validate form data
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    // Return a flat list of errors
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors)
        .map((errors) => errors.join(", "))
        .join(". "),
    };
  }
  
  // 2. Call the API
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();

    if (!response.ok || result.status >= 400) {
      return { error: result.message || "An unknown API error occurred." };
    }

    return { message: result.message, data: result.data };

  } catch (error) {
    console.error("Signup Action Error:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unexpected error occurred." };
  }
}


export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // 1. Validate form data
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
     return {
      error: Object.values(validatedFields.error.flatten().fieldErrors)
        .map((errors) => errors.join(", "))
        .join(". "),
    };
  }

  // 2. Call the API
  try {
     const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();

    if (!response.ok || result.status >= 400) {
      return { error: result.message || "Invalid credentials." };
    }

    // On success, the backend sends the user profile and tokens
    return { message: "Login successful!", data: result.data };
    
  } catch (error) {
     console.error("Login Action Error:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unexpected error occurred during login." };
  }
}
