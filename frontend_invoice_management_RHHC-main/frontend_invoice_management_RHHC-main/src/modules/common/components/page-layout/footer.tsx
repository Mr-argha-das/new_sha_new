import { ReactNode } from 'react';
import PageContainer from '../../elements/page/page-container';

interface PageLayoutFooterProps {
  children: ReactNode;
}

const PageLayoutFooter = ({ children }: PageLayoutFooterProps) => {
  return <PageContainer>{children}</PageContainer>;
};

export default PageLayoutFooter;
