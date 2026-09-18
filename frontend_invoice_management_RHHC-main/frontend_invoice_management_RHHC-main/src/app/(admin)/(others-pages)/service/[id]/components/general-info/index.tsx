import { ServiceEditPageSection, useServiceEditPageContext } from '../../context';
import EditGeneralInformation from './edit';
import ViewGeneralInformation from './view';

const GeneralInformation = () => {
  const { activeSection, setActiveSection } = useServiceEditPageContext();
  const isEditing = activeSection === ServiceEditPageSection.GeneralInformation;

  const handleEdit = () => {
    setActiveSection(ServiceEditPageSection.GeneralInformation);
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