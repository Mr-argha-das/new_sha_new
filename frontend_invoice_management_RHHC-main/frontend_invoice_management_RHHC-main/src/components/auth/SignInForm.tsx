'use client';
// import { login } from '@/app/(full-width-pages)/(auth)/signin/api';

import { login } from '@/app/(full-width-pages)/(auth)/signin/api';
import { SignInType } from '@/app/(full-width-pages)/(auth)/signin/api/schema';
import { useAuth } from '@/context/AuthContext';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { messages } from '@/modules/common/constant/messages';
import NumberField from '@/modules/common/NumberField';
import TextField from '@/modules/common/text-field';
import { Form, Formik, FormikHelpers } from 'formik';
import { cloneDeep } from 'lodash-es';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoadingButton } from '../../../packages/ui';

export default function SignInForm() {
  const { setToken, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmitLogin = async (
    values: SignInType,
    { resetForm }: FormikHelpers<SignInType>,
  ) => {
    const payload = cloneDeep(values);
    payload.mobile = String(payload.mobile);

    try {
      setLoading(true);
      const response = await login(payload);
      const res = response.data;

      if (res.success && res.data?.jwtToken) {
        setToken(res.data.jwtToken, res.data.refreshToken);
        setUser(res.data.user);
        toast.success(res.message || 'Login successful');
        resetForm();
        router.push('/');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (e) {
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
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your mobile number and password to sign in!
            </p>
          </div>
          <div>
            <Formik
              initialValues={{
                mobile: '',
                password: '',
              }}
              onSubmit={handleSubmitLogin}
              validationSchema={Yup.object().shape({
                mobile: Yup.string()
                  .required(messages.REQUIRED)
                  .length(10, 'Mobile number must be 10 digits'),
                password: Yup.string().required(messages.REQUIRED),
              })}
            >
              {() => {
                return (
                  <Form>
                    <div className="space-y-6">
                      <div>
                        <NumberField
                          fullWidth
                          label="Mobile"
                          name="mobile"
                          allowNegative={false}
                          slotProps={{
                            htmlInput: {
                              inputMode: 'numeric',
                              maxLength: 10,
                            },
                          }}
                        />
                      </div>
                      <div>
                        <div className="relative">
                          <TextField
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            label="Password"
                            name="password"
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
                      <div className="flex items-center">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div>
                        <LoadingButton
                          loading={loading}
                          type={'submit'}
                          className="w-full"
                          size="small"
                          variant="contained"
                        >
                          Sign in
                        </LoadingButton>
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
