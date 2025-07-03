'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'sonner'

type Payload = {
    email: string
    password: string
}

type LoginApiResponse = {
    access_token?: string
    message?: string[]
    error?: string
    statusCode?: number
}

const login = async (payload: Payload) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
    console.log('url', url)
    const response = await axios.post<LoginApiResponse>(url, payload)
    return response.data
}

export default function LoginPage() {
    const router = useRouter()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    type FormFields = z.infer<typeof loginSchema>

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (res) => {
            const token = res.access_token
            if (token) {
                localStorage.setItem('token', token)
            }
            toast('You’ve successfully logged in.')
            router.push('/dashboard')
        },
    })

    const onSubmit = async (formData: FormFields) => {
        await loginMutation.mutateAsync(formData)
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        Login to your account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email@example.com"
                                                {...field}
                                                autoComplete="email"
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
                                                autoComplete="current-password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending
                                    ? 'Connecting...'
                                    : 'Login'}
                            </Button>

                            <p className="text-sm text-center mt-4">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    className="text-blue-600 hover:underline"
                                >
                                    Register here
                                </Link>
                            </p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}