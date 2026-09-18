import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { AccountSettings } from '@/modules/common/models/accountSettings';

export enum AccountSettingsEditPageSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface AccountSettingsEditPageContextType {
  accountSettings: AccountSettings | null | undefined;
  activeSection: Nullable<AccountSettingsEditPageSection>;

  setActiveSection: Dispatch<SetStateAction<AccountSettingsEditPageSection | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  checkListItemAddModal: boolean;
  setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string>>;
  editId: string;
}

const AccountSettingsEditPageContext = createContext<AccountSettingsEditPageContextType>({
  accountSettings: null,
  activeSection: null,
  setActiveSection: () => { },
  setLoading: () => { },
  setCheckListItemAddModal: () => { },
  loading: false,
  checkListItemAddModal: false,
  editId: '',
  setEditId: () => { },
});

export const useAccountSettingsEditPageContext = () =>
  useContext<AccountSettingsEditPageContextType>(AccountSettingsEditPageContext);

export default AccountSettingsEditPageContext;
