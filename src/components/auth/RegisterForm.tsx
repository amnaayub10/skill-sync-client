"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        name: values.fullName // Include all required fields
      }),
    });

    // First get raw response text
    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse JSON:', responseText);
      throw new Error(`Server returned: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(result.message || `Error ${response.status}: Registration failed`);
    }

    console.log('Registration successful:', result);
    router.push('/auth/login?registered=true');
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : "Registration failed due to an unknown error";
    
    console.error('Registration error:', err);
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Card className="w-full max-w-md shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold">
          Create an account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        setError(null); // Clear error when user types
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email@example.com" 
                      type="email" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setError(null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setError(null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setError(null);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
            
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <a href="/auth/login" className="text-blue-600 hover:underline">
                Login here
              </a>
            </p>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;