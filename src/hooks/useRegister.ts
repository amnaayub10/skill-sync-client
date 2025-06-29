// src/hooks/useRegister.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface UseRegisterReturn {
  register: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

interface RegisterFormData {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (values: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Client-side validation
      if (values.password !== values.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      // Prepare API data
      const apiData: RegisterData = {
        email: values.email,
        password: values.password,
        ...(values.fullName && { name: values.fullName }),
      };

      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Redirect on success (with query param)
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { register, isLoading, error, resetError };
}