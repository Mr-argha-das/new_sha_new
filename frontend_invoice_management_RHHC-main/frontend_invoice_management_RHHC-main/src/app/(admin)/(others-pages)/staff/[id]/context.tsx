import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { User } from '@/modules/common/models/user';
import { StaffQualification } from '../api';

export enum UserEditPageSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface UserEditPageContextType {
  user: User & { qualifications: StaffQualification[] } | null;
  activeSection: Nullable<UserEditPageSection>;

  setActiveSection: Dispatch<SetStateAction<UserEditPageSection | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  checkListItemAddModal: boolean;
  setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string>>;
  editId: string;

  // Staff experiences shared state
  experiences: import('@/modules/common/models/staff').StaffExperience[];
  setExperiences: Dispatch<SetStateAction<import('@/modules/common/models/staff').StaffExperience[]>>;
  experiencesLoading: boolean;
  refetchExperiences: () => Promise<void>;
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
  experiences: [],
  setExperiences: () => { },
  experiencesLoading: false,
  refetchExperiences: async () => { },
});

export const useUserEditPageContext = () =>
  useContext<UserEditPageContextType>(UserEditPageContext);

export default UserEditPageContext;
