import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export enum CategoryEditPageSection {
    GeneralInformation = 'General Information',
}

export interface Category {
    id: number;
    name: string;
    description?: string | null;
    account_id: number;
    branch_id: number;
    is_deleted: number;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface CategoryEditPageContextType {
    category: Category | null;
    activeSection: Nullable<CategoryEditPageSection>;

    setActiveSection: Dispatch<SetStateAction<CategoryEditPageSection | null>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    checkListItemAddModal: boolean;
    setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
    setEditId: Dispatch<SetStateAction<string>>;
    editId: string;
}

const CategoryEditPageContext = createContext<CategoryEditPageContextType>({
    category: null,
    activeSection: null,
    setActiveSection: () => { },
    setLoading: () => { },
    setCheckListItemAddModal: () => { },
    loading: false,
    checkListItemAddModal: false,
    editId: '',
    setEditId: () => { },
});

export const useCategoryEditPageContext = () =>
    useContext<CategoryEditPageContextType>(CategoryEditPageContext);

export default CategoryEditPageContext;

