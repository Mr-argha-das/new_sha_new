'use client';

import { useState } from 'react';
import { User } from '@/modules/common/models/user';
import EditGeneralInformation from './edit';
import ViewGeneralInformation from './view';

interface GeneralInformationProps {
    user: Partial<User> | null;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const GeneralInformation = ({
    user,
    loading,
    setLoading,
}: GeneralInformationProps) => {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <EditGeneralInformation
                onSave={() => {
                    setIsEditing(false);
                }}
                onCancel={() => {
                    setIsEditing(false);
                }}
                user={user}
                loading={loading}
                setLoading={setLoading}
            />
        );
    }

    return (
        <ViewGeneralInformation
            onEdit={() => {
                setIsEditing(true);
            }}
            user={user}
        />
    );
};

export default GeneralInformation;

