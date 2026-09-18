import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { StaffTask } from '@/modules/common/models/staff';

export enum TaskSection {
  GeneralInformation = 'General Information',
  OtherInformation = 'Other Information',
}

export interface TaskContextType {
  task: StaffTask | null;
  activeSection: TaskSection | null;
  setActiveSection: Dispatch<SetStateAction<TaskSection | null>>;
}

const TaskContext = createContext<TaskContextType>({
  task: null,
  activeSection: null,
  setActiveSection: () => { },
});

export const useTaskContext = () =>
  useContext<TaskContextType>(TaskContext);

export default TaskContext;
