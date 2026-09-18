'use client';

import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../packages/ui';
import TextField from '@/modules/common/text-field';
import { messages } from '@/modules/common/constant/messages';
import Link from 'next/link';
import { requestPasswordReset } from '@/app/(full-width-pages)/(auth)/forgot-password/api';

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (values: { email: string }) => {
        try {
            setLoading(true);
            const response = await requestPasswordReset(values);
            const res = response.data;

            if (res.success) {
                toast.success(res.message || 'Password reset email sent successfully');
                setTimeout(() => {
                    router.push('/signin');
                }, 1000);
            } else {
                toast.error(res.message || 'Failed to send reset email');
            }
        } catch (e: unknown) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Forgot Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>
                    <div>
                        <Formik
                            initialValues={{
                                email: '',
                            }}
                            onSubmit={handleSubmit}
                            validationSchema={Yup.object().shape({
                                email: Yup.string()
                                    .email('Invalid email address')
                                    .required(messages.REQUIRED),
                            })}
                        >
                            {() => {
                                return (
                                    <Form>
                                        <div className="space-y-6">
                                            <div>
                                                <TextField
                                                    type="email"
                                                    fullWidth
                                                    label="Email"
                                                    name="email"
                                                    autoComplete="email"
                                                />
                                            </div>
                                            <div>
                                                <LoadingButton
                                                    loading={loading}
                                                    type={'submit'}
                                                    className="w-full"
                                                    size="small"
                                                    variant="contained"
                                                >
                                                    Send Reset Link
                                                </LoadingButton>
                                            </div>
                                            <div className="text-center">
                                                <Link
                                                    href="/signin"
                                                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                                >
                                                    Back to Sign In
                                                </Link>
                                            </div>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

