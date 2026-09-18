'use client';

import React from 'react';
import { PayslipSection, usePayslip } from '../../context';
import ViewGeneralInformation from './view';
import EditGeneralInformation from './edit';

const GeneralInformation: React.FC = () => {
    const { activeSection, setActiveSection } = usePayslip();
    const isEditing = activeSection === PayslipSection.GeneralInformation;

    const handleEdit = () => {
        setActiveSection(PayslipSection.GeneralInformation);
    };

    const setToView = () => {
        setActiveSection(null);
    };

    if (isEditing) {
        return <EditGeneralInformation onCancel={setToView} onSave={setToView} />;
    }

    return <ViewGeneralInformation onEdit={handleEdit} />;
};

export default GeneralInformation;


