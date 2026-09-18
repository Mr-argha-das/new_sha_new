import { ReactNode } from 'react';
import { capitalizeFirstLetter } from '../../helpers/capitalizeWords';
import Link from '../../elements/link';
import { Box, Typography } from '@mui/material';
interface ResourceDetailProps {
  label: string;

  value: string | null | undefined | ReactNode;

  style?: any;

  isLink?: string;

  isComponent?: boolean
}

const ResourceDetail = ({
  label,
  value,
  style = '',
  isLink = '',
  isComponent = false,
}: ResourceDetailProps) => {
  const getValue = () => {
    if (isLink) {
      return (
        <Typography color="neutral.400" component="p" fontWeight={600}>
          <Link href={`${isLink}`} tenantId>
            {capitalizeFirstLetter(value || '')}
          </Link>
        </Typography>
      );
    }
    if (
      value === null ||
      value === 'NaN' ||
      value === undefined ||
      value === ''
    ) {
      return (
        <Typography color="neutral.400" component="p" fontWeight={600}>
          Not Available
        </Typography>
      );
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <Typography color="neutral.600" component="p" fontWeight={600}>
          {typeof value === 'string' ? capitalizeFirstLetter(value) : value}
        </Typography>
      );
    }

    if (isComponent) {
      return < Box sx={{ mt: 0.5 }
      }> {value}</ Box>;
    }
    return value;
  };

  return (
    <Box sx={style}>
      <Typography color="neutral.300" component="label" variant="body2">
        {label}
      </Typography>

      {getValue()}
    </Box>
  );
};

export const ResourceDetailDescription = ({
  label,
  value,
  style = '',
}: ResourceDetailProps) => {
  const getValue = () => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography color="neutral.400" component="p" fontWeight={600}>
          Not Available
        </Typography>
      );
    }

    if (typeof value === 'string') {
      return (
        <Typography color="neutral.600" component="p" fontWeight={600}>
          {capitalizeFirstLetter(value)}
        </Typography>
      );
    } else if (typeof value === 'number') {
      return (
        <Typography color="neutral.600" component="p" fontWeight={600}>
          {value}
        </Typography>
      );
    }

    return value;
  };

  return (
    <Box sx={style}>
      <Typography color="neutral.300" component="label" variant="body2">
        {label}
      </Typography>
      {getValue()}
    </Box>
  );
};

export const ResourceDetailEmail = ({
  label,
  value,
  style = '',
}: ResourceDetailProps) => {
  const getValue = () => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography color="neutral.400" component="p" fontWeight={600}>
          Not Available
        </Typography>
      );
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <Typography color="neutral.600" component="p" fontWeight={600}>
          {value}
        </Typography>
      );
    }

    return value;
  };

  return (
    <Box sx={style}>
      <Typography color="neutral.300" component="label" variant="body2">
        {label}
      </Typography>

      {getValue()}
    </Box>
  );
};

export default ResourceDetail;
