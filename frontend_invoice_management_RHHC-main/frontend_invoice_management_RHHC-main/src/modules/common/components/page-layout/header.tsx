import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import FlexBox, {
  FlexBoxProps,
} from '../../../../../packages/ui/elements/FlexBox';
import Avatar from '../../elements/avatar';
import PageContainer from '../../elements/page/page-container';
import Breadcrumbs from '../breadcrumbs';
import { BreadcrumbItemType } from '../breadcrumbs/types';

interface PageLayoutHeaderProps
  extends Pick<FlexBoxProps, 'justify' | 'align'> {
  title: string;
  children?: ReactNode;
  caption?: ReactNode;
  icon?: any;
  breadcrumbs?: BreadcrumbItemType[];
  isListHeader?: boolean;
  back?: ReactNode;
}

const PageLayoutHeader = ({
  title,
  caption,
  children,
  breadcrumbs,
  icon,
  back,
  isListHeader = true,
  ...rest
}: PageLayoutHeaderProps) => {
  return isListHeader ? (
    <ListHeader
      title={title}
      caption={caption}
      children={children}
      breadcrumbs={breadcrumbs}
      icon={icon}
      back={back}
    />
  ) : (
    <EditHeader
      title={title}
      caption={caption}
      children={children}
      breadcrumbs={breadcrumbs}
      icon={icon}
      back={back}
    />
  );
};

const EditHeader = ({
  title,
  caption,
  children,
  breadcrumbs,
  icon,
  back,
  ...rest
}: PageLayoutHeaderProps) => {
  return (
    <PageContainer sx={{ pb: 0, p: 0 }}>
      <FlexBox justify="space-between" mb={2}>
        <Box>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} sx={{ mb: 1 }} />}
        </Box>
        <Box>{back}</Box>
      </FlexBox>
      <FlexBox
        sx={{ border: '1px solid #00000026', p: '20px', borderRadius: '4px' }}
        justify="space-between"
        {...rest}
      >
        <Box display={'flex'} alignItems={'center'}>
          <Avatar sx={{ height: 40, width: 40, fontSize: 15 }}>{title}</Avatar>
          <Typography
            color="neutral.500"
            variant="h4"
            ml={3}
            display={'flex'}
            alignItems={'center'}
            sx={{
              fontSize: {
                xs: '1.2rem', // mobile
                sm: '1.5rem', // tablet
                md: '2rem', // desktop
              },
            }}
          >
            {title} {icon && icon}
          </Typography>
          <Box ml={3}>{caption}</Box>
        </Box>
        <Box>{children}</Box>
      </FlexBox>
    </PageContainer>
  );
};

const ListHeader = ({
  title,
  caption,
  children,
  breadcrumbs,
  icon,
  back,
  ...rest
}: PageLayoutHeaderProps) => {
  return (
    <PageContainer sx={{ px: 0, py: 0, pb: 4 }}>
      <FlexBox justify="space-between" {...rest}>
        <Box>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} sx={{ mb: 1 }} />}
          <Typography
            color="neutral.500"
            variant="h4"
            display={'flex'}
            alignItems={'center'}
            sx={{
              fontSize: {
                xs: '1.2rem', // mobile
                sm: '1.5rem', // tablet
                md: '2rem', // desktop
              },
            }}
          >
            {title} {icon && icon}
          </Typography>
          {caption}
        </Box>
        <Box>{children}</Box>
      </FlexBox>
    </PageContainer>
  );
};
export default PageLayoutHeader;
