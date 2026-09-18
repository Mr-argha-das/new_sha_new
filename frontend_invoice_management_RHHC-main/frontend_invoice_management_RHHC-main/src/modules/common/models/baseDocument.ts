export interface BaseDocument {
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  account_id?: number;
  branch_id?: number;
}
