import { AccountSettings } from '@/modules/common/models/accountSettings';
import api from '@/modules/common/libs/axios';
import { AxiosApi, ResponseDto } from '@/modules/common/types/api';
import { PaginatedApi } from '../../../../../../packages/ui/components/data-grid/paginated/types';

export const getAccountSettingsById: AxiosApi<ResponseDto<AccountSettings>, ID> = (id) => {
  return api.get(`/account-settings/get/${id}`);
};

export const getAccountSettingsByAccountAndBranchID: PaginatedApi<AccountSettings> = (params) => {
  return api.get('/account-settings/getByAccountAndBranch', {
    params,
  });
};

export const updateAccountSettings: AxiosApi<ResponseDto<AccountSettings>, [ID, FormData]> = (id, data) => {
  return api.patch(`/account-settings/update/${id}`, data);
};
