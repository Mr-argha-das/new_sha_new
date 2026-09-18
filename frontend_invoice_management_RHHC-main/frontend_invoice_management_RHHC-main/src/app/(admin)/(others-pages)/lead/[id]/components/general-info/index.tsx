import { LeadEditPageSection, useLeadEditPageContext } from '../../context';
import EditGeneralInformation from './edit';
import ViewGeneralInformation from './view';

const GeneralInformation = () => {
  const { activeSection, setActiveSection } = useLeadEditPageContext();
  const isEditing = activeSection === LeadEditPageSection.GeneralInformation;

  const handleEdit = () => {
    setActiveSection(LeadEditPageSection.GeneralInformation);
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
