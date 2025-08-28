"use server";

import { z } from "zod";
import { setCookie } from 'cookies-next';
import { cookies } from 'next/headers';

const API_BASE_URL = "https://reflections-backend-g9jc.onrender.com";

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
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors)
        .map((errors) => errors.join(", "))
        .join(". "),
    };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "An unknown API error occurred." };
    }
    
    // Set cookies upon successful signup
    const { myProfile, accessToken, refreshToken } = result.data;
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, maxAge: 60 * 60 * 24 * 7 };
    
    cookies().set('user', JSON.stringify(myProfile), cookieOptions);
    cookies().set('accessToken', accessToken, cookieOptions);
    cookies().set('refreshToken', refreshToken, cookieOptions);

    return { message: result.message, data: result.data };

  } catch (error) {
    console.error("Signup Action Error:", error);
    if (error instanceof Error) {
        return { error: "Could not connect to the authentication service. Please try again later." };
    }
    return { error: "An unexpected error occurred during signup." };
  }
}


export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
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

  try {
     const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { error: result.message || "Invalid credentials." };
    }
    
    // Set cookies upon successful login
    const { myProfile, accessToken, refreshToken } = result.data;
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, maxAge: 60 * 60 * 24 * 7 };
    
    cookies().set('user', JSON.stringify(myProfile), cookieOptions);
    cookies().set('accessToken', accessToken, cookieOptions);
    cookies().set('refreshToken', refreshToken, cookieOptions);

    return { message: "Login successful!", data: result.data };
    
  } catch (error) {
    console.error("Login Action Error:", error);
    if (error instanceof Error) {
        return { error: "Could not connect to the authentication service. Please try again later." };
    }
    return { error: "An unexpected error occurred during login." };
  }
}