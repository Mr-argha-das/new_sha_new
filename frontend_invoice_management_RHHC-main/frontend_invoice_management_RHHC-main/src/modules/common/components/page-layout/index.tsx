import { ReactNode } from 'react';
import FlexBox, { FlexBoxProps } from '../../../../../packages/ui/elements/FlexBox';
import { APPBAR_HEIGHT } from '../../../../../packages/ui/theme/sizes';
import PageLayoutHeader from './header';
import PageLayoutContent from './content';
import PageLayoutFooter from './footer';
import PageLayoutFormSection from './form-section';
// import { FlexBox, FlexBoxProps } from 'ui';

interface PageLayoutProps extends FlexBoxProps {
  children: ReactNode;

  /** If true, page height would be restricted to (100vh - AppBarHeight) */
  fullPage?: boolean;
}

const PageLayout = ({
  children,
  fullPage = false,
  ...rest
}: PageLayoutProps) => {
  const height = fullPage ? `calc(100vh - ${APPBAR_HEIGHT}px)` : 'auto';

  return (
    <FlexBox
      component="main"
      sx={{ flex: 1, height, maxHeight: height, overflow: 'hidden' }}
      direction="column"
      align="stretch"
      justify="stretch"
      {...rest}
    >
      {children}
    </FlexBox>
  );
};

PageLayout.Header = PageLayoutHeader;

PageLayout.Content = PageLayoutContent;

PageLayout.Footer = PageLayoutFooter;

PageLayout.FormSection = PageLayoutFormSection;

export default PageLayout;
