// @ts-expect-error - temporary fix

/* eslint-disable */
import { CircularProgress } from '@mui/material';
import FlexBox, {
  FlexBoxProps,
} from '../../../../../packages/ui/elements/FlexBox';

type PageLoaderProps = FlexBoxProps & {
  disableShrink?: boolean;
};

const PageLoader = ({
  sx,
  disableShrink = false,
  ...rest
}: PageLoaderProps) => {
  return (
    <FlexBox justify="center" sx={{ flex: 1, ...sx }} {...rest}>
      <CircularProgress disableShrink />
    </FlexBox>
  );
};

export default PageLoader;
