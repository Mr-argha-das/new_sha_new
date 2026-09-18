import { Nullable } from '@react-jvectormap/core/dist/types';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export enum ServiceEditPageSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface Service {
  id: string;
  name: string;
  hour_price: string;
  description: string;
}

export interface ServiceEditPageContextType {
  service: Service | null;
  activeSection: Nullable<ServiceEditPageSection>;

  setActiveSection: Dispatch<SetStateAction<ServiceEditPageSection | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  checkListItemAddModal: boolean;
  setCheckListItemAddModal: Dispatch<SetStateAction<boolean>>;
  setEditId: Dispatch<SetStateAction<string>>;
  editId: string;
}

const ServiceEditPageContext = createContext<ServiceEditPageContextType>({
  service: null,
  activeSection: null,
  setActiveSection: () => {},
  setLoading: () => {},
  setCheckListItemAddModal: () => {},
  loading: false,
  checkListItemAddModal: false,
  editId: '',
  setEditId: () => {},
});

export const useServiceEditPageContext = () =>
  useContext<ServiceEditPageContextType>(ServiceEditPageContext);

export default ServiceEditPageContext;
