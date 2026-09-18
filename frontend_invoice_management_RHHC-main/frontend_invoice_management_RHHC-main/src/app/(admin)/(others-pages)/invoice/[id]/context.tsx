import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Invoice } from '@/modules/common/models/invoice';

export enum InvoiceEditPageSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface InvoiceEditPageContextType {
  invoice: Invoice | null;
  activeSection: Nullable<InvoiceEditPageSection>;

  setActiveSection: Dispatch<SetStateAction<InvoiceEditPageSection | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  checkListItemAddModal: boolean;
  setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string>>;
  editId: string;
}

const InvoiceEditPageContext = createContext<InvoiceEditPageContextType>({
  invoice: null,
  activeSection: null,
  setActiveSection: () => { },
  setLoading: () => { },
  setCheckListItemAddModal: () => { },
  loading: false,
  checkListItemAddModal: false,
  editId: '',
  setEditId: () => { },
});

export const useInvoiceEditPageContext = () =>
  useContext<InvoiceEditPageContextType>(InvoiceEditPageContext);

export default InvoiceEditPageContext;
