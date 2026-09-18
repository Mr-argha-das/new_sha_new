import { ReactElement } from 'react';

export type OnDeleteFunction = (id: ID | object) => Promise<any>;

export interface DeleteConfirmationProps {
  children: ReactElement;

  resourceId: ID | object;

  onDelete: OnDeleteFunction;

  message?: string;
}
