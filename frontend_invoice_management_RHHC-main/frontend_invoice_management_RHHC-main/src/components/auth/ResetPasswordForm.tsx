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
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { resetPassword } from '@/app/(full-width-pages)/(auth)/reset-password/api';

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        try {
            setLoading(true);
            const response = await resetPassword(values.password, token);
            const res = response.data;

            if (res.success) {
                toast.success(res.message || 'Password reset successfully');
                setTimeout(() => {
                    router.push('/signin');
                }, 1000);
            } else {
                toast.error(res.message || 'Failed to reset password');
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
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your new password below.
                        </p>
                    </div>
                    <div>
                        <Formik
                            initialValues={{
                                password: '',
                                confirmPassword: '',
                            }}
                            onSubmit={handleSubmit}
                            validationSchema={Yup.object().shape({
                                password: Yup.string()
                                    .min(6, 'Password must be at least 6 characters')
                                    .required(messages.REQUIRED),
                                confirmPassword: Yup.string()
                                    .oneOf([Yup.ref('password')], 'Passwords must match')
                                    .required('Please confirm your password'),
                            })}
                        >
                            {() => {
                                return (
                                    <Form>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="relative">
                                                    <TextField
                                                        type={showPassword ? 'text' : 'password'}
                                                        fullWidth
                                                        label="New Password"
                                                        name="password"
                                                        autoComplete="new-password"
                                                    />
                                                    <span
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                                    >
                                                        {showPassword ? (
                                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                                        ) : (
                                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <TextField
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        fullWidth
                                                        label="Confirm New Password"
                                                        name="confirmPassword"
                                                        autoComplete="new-password"
                                                    />
                                                    <span
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                                        ) : (
                                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <LoadingButton
                                                    loading={loading}
                                                    type={'submit'}
                                                    className="w-full"
                                                    size="small"
                                                    variant="contained"
                                                >
                                                    Reset Password
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

