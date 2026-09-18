import { CategoryEditPageSection, useCategoryEditPageContext } from '../../context';
import EditGeneralInformation from './edit';
import ViewGeneralInformation from './view';

const GeneralInformation = () => {
    const { activeSection, setActiveSection } = useCategoryEditPageContext();
    const isEditing = activeSection === CategoryEditPageSection.GeneralInformation;

    const handleEdit = () => {
        setActiveSection(CategoryEditPageSection.GeneralInformation);
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

