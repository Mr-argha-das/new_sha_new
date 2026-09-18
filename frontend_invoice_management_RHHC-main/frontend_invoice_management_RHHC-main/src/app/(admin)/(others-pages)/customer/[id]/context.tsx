import { User } from '@/modules/common/models/user';
import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export enum UserEditPageSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface UserEditPageContextType {
  user: User | null;
  activeSection: Nullable<UserEditPageSection>;

  setActiveSection: Dispatch<SetStateAction<UserEditPageSection | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  checkListItemAddModal: boolean;
  setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string>>;
  editId: string;
}

const UserEditPageContext = createContext<UserEditPageContextType>({
  user: null,
  activeSection: null,
  setActiveSection: () => { },
  setLoading: () => { },
  setCheckListItemAddModal: () => { },
  loading: false,
  checkListItemAddModal: false,
  editId: '',
  setEditId: () => { },
});

export const useUserEditPageContext = () =>
  useContext<UserEditPageContextType>(UserEditPageContext);

export default UserEditPageContext;
