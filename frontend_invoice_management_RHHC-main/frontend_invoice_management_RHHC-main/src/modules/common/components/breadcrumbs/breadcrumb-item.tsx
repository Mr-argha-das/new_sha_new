import { Box, Typography } from '@mui/material';
import { FontSize } from '../../../../../packages/ui/theme/sizes';
import { BreadcrumbItemType } from './types';
import Link from 'next/link';

interface BreadcrumbItemProps {
  data: BreadcrumbItemType;
  active?: boolean;
}

const BreadcrumbItem = ({ data, active }: BreadcrumbItemProps) => {
  const { content, icon: Icon, name, href, onClick } = data;

  const BreadcrumbItemContent = () => {
    if (content) return <>{content}</>;

    return (
      <Typography color={active ? 'neutral.300' : 'neutral.200'}>
        {Icon && <Icon sx={{ mr: 1, fontSize: FontSize.LG, mb: '-3px' }} />}
        {name}
      </Typography>
    );
  };

  if (href) {
    return (
      <Link href={href}>
        {BreadcrumbItemContent()}
      </Link>
    );
  }

  return <Box onClick={onClick}>{BreadcrumbItemContent()}</Box>;
};

export default BreadcrumbItem;
