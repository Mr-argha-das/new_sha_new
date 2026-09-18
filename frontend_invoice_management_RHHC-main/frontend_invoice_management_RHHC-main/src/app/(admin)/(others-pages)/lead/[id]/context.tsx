import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Lead } from '@/modules/common/models/lead';

export enum LeadEditPageSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface LeadEditPageContextType {
  lead: (Lead & { items?: unknown[]; invoices?: unknown[] }) | null;
  activeSection: Nullable<LeadEditPageSection>;

  setActiveSection: Dispatch<SetStateAction<LeadEditPageSection | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  checkListItemAddModal: boolean;
  setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string>>;
  editId: string;
}

const LeadEditPageContext = createContext<LeadEditPageContextType>({
  lead: null,
  activeSection: null,
  setActiveSection: () => { },
  setLoading: () => { },
  setCheckListItemAddModal: () => { },
  loading: false,
  checkListItemAddModal: false,
  editId: '',
  setEditId: () => { },
});

export const useLeadEditPageContext = () =>
  useContext<LeadEditPageContextType>(LeadEditPageContext);

export default LeadEditPageContext;
