import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface ExtraParams {
  account_id: string;
  branch_id: string;
  from_date?: string | undefined;
  to_date?: string | undefined;
}

export interface ExtraParamsContextType {
  extraParams: ExtraParams;
  setExtraParams: Dispatch<SetStateAction<ExtraParams>>;
}
const ExtraParamsContext = createContext<ExtraParamsContextType>({
  extraParams: {
    account_id: '',
    branch_id: '',
    from_date: '',
    to_date: '',
  },
  setExtraParams: () => {},
});
export const useExtraParamsContext = () => useContext(ExtraParamsContext);

export default ExtraParamsContext;
