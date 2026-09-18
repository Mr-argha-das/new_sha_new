import { UserEditPageSection, useUserEditPageContext } from '../../context';
import EditOtherInformation from './edit';
import ViewOtherInformation from './view';

const OtherInformation = () => {
  const { activeSection, setActiveSection } = useUserEditPageContext();
  const isEditing = activeSection === UserEditPageSection.OtherInformation;

  const handleEdit = () => {
    setActiveSection(UserEditPageSection.OtherInformation);
  };

  const setToView = () => {
    setActiveSection(null);
  };

  if (isEditing) {
    return <EditOtherInformation onCancel={setToView} onSave={setToView} />;
  }

  return <ViewOtherInformation onEdit={handleEdit} />;
};

export default OtherInformation;
