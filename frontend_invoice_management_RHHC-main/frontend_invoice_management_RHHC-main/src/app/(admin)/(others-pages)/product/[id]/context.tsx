import { Product } from '@/modules/common/models/product';
import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export enum ProductEditPageSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface ProductEditPageContextType {
  product: Nullable<Product>;
  activeSection: Nullable<ProductEditPageSection>;

  setActiveSection: Dispatch<SetStateAction<ProductEditPageSection | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  checkListItemAddModal: boolean;
  setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string>>;
  editId: string;
}

const ProductEditPageContext = createContext<ProductEditPageContextType>({
  product: null,
  activeSection: null,
  setActiveSection: () => { },
  setLoading: () => { },
  setCheckListItemAddModal: () => { },
  loading: false,
  checkListItemAddModal: false,
  editId: '',
  setEditId: () => { },
});

export const useProductEditPageContext = () =>
  useContext<ProductEditPageContextType>(ProductEditPageContext);

export default ProductEditPageContext;
