import { AccountSettingsEditPageSection, useAccountSettingsEditPageContext } from '../../context';
import EditGeneralInformation from './edit';
import ViewGeneralInformation from './view';

const GeneralInformation = () => {
  const { activeSection, setActiveSection } = useAccountSettingsEditPageContext();
  const isEditing = activeSection === AccountSettingsEditPageSection.GeneralInformation;

  const handleEdit = () => {
    setActiveSection(AccountSettingsEditPageSection.GeneralInformation);
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
