'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';


export default function ResetPasswordPageContent() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordPage />
        </Suspense>
    );
}

function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            router.push('/forgot-password');
        } else {
            setToken(tokenParam);
        }
    }, [searchParams, router]);

    return <ResetPasswordForm token={token || ''} />;
}

