import { ProductEditPageSection, useProductEditPageContext } from '../../context';
import EditGeneralInformation from './edit';
import ViewGeneralInformation from './view';

const GeneralInformation = () => {
  const { activeSection, setActiveSection } = useProductEditPageContext();
  const isEditing = activeSection === ProductEditPageSection.GeneralInformation;

  const handleEdit = () => {
    setActiveSection(ProductEditPageSection.GeneralInformation);
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
