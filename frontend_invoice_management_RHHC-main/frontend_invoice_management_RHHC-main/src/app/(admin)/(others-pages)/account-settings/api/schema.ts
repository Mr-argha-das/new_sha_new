import { AccountSettings } from '@/modules/common/models/accountSettings';
import { ResponseDto } from '@/modules/common/types/api';

export type GetAccountSettingsByIdApiResponseData = AccountSettings;
export type GetAccountSettingsByIdApiResponseDto =
  ResponseDto<GetAccountSettingsByIdApiResponseData>;

export interface AccountSettingsEditData {
  id?: ID;
  name: string;
  logo: File | string | null;
  stamp: File | string | null;
  qr_scanner: File | string | null;
  stamp_signature: File | string | null;
  address_lines: string;
  mobile: string;
  email: string;
  extra_ids: { key: string; value: string | number }[];
  service_type: string;
  bank_details: {
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc: string;
  };
  use_stamp_image: number;
  account_id: number;
  branch_id: number;
}
