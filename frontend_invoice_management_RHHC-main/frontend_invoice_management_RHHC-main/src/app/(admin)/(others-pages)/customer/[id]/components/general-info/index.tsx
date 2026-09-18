import { UserEditPageSection, useUserEditPageContext } from '../../context';
import EditGeneralInformation from './edit';
import ViewGeneralInformation from './view';

const GeneralInformation = () => {
  const { activeSection, setActiveSection } = useUserEditPageContext();
  const isEditing = activeSection === UserEditPageSection.GeneralInformation;

  const handleEdit = () => {
    setActiveSection(UserEditPageSection.GeneralInformation);
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
