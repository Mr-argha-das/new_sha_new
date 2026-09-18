import { Chip } from '@mui/material';
import { ChipPropsColorOverrides } from '@mui/material/Chip';
import { OverridableStringUnion } from '@mui/types';
import { capitalizeFirstLetter } from './capitalizeWords';

export const sleep = (ms: number) => {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
};

type ChipColor = OverridableStringUnion<
  | 'error'
  | 'success'
  | 'warning'
  | 'secondary'
  | 'primary'
  | 'default'
  | 'info',
  ChipPropsColorOverrides
>;

const STATUS_COLOR_MAP: Record<string, ChipColor> = {
  // success
  paid: 'success',
  completed: 'success',
  yes: 'success',
  done: 'success',

  // primary
  returned: 'primary',
  published: 'primary',
  finalised: 'primary',
  active: 'primary',

  // warning
  partial: 'warning',
  onhold: 'warning',
  productReturnPending: 'warning',

  // secondary
  no: 'secondary',
  draft: 'secondary',
  inprogress: 'secondary',
  'on rent': 'secondary',

  // error
  sold: 'error',
  unpaid: 'error',
  invalid: 'error',
  block: 'error',
};

export const chipLable = (rawStatus?: string, renderText?: string) => {
  if (!rawStatus) return null;

  const status = rawStatus.toLowerCase().trim();
  const color = STATUS_COLOR_MAP[status] ?? 'default';

  return (
    <Chip
      label={renderText ? capitalizeFirstLetter(renderText) : capitalizeFirstLetter(status)}
      color={color}
      size="medium"
    />
  );
};