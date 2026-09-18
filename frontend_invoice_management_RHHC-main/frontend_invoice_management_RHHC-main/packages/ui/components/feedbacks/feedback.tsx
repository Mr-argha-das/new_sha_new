import type { ReactNode } from 'react';
import type { ButtonProps } from '../..';
import { Box, Button, FlexBox, Typography } from '../..';
import FeedbackIllustration from '../../assets/illustrations/search.svg';

interface ActionProps extends ButtonProps {
  label?: string;
}

export interface FeedbackProps {
  title?: string;

  subtitle?: string;

  action?: ActionProps;

  illustration?: ReactNode;

  illustrationHeight?: number;

  children?: ReactNode;
}

const DEFAULT_LABEL = 'Go Back';

const DEFAULT_ILLUSTRATION_HEIGHT = 236;

const Action = ({ label = DEFAULT_LABEL, ...rest }: ActionProps) => {
  return (
    <Button color="primary" sx={{ mt: 4 }} variant="contained" {...rest}>
      {label}
    </Button>
  );
};

const Feedback = ({
  title = 'Some error Occurred.',
  subtitle,
  children,
  action,
  illustration,
  illustrationHeight,
}: FeedbackProps) => {
  return (
    <FlexBox
      align="center"
      direction="column"
      flex={1}
      height="100%"
      justify="center"
      py={12}
    >
      {illustration || (
        <img
          alt={title}
          height={illustrationHeight || DEFAULT_ILLUSTRATION_HEIGHT}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- TODO: Fix the lint error
          src={FeedbackIllustration.src}
        />
      )}

      <Typography color="neutral.500" sx={{ my: 1 }} variant="h4">
        {title}
      </Typography>

      {subtitle ? (
        <Typography color="neutral.300" sx={{ my: 1 }} variant="body1">
          {subtitle}
        </Typography>
      ) : null}

      {action ? <Action {...action} /> : null}

      {children ? <Box mt={2}>{children}</Box> : null}
    </FlexBox>
  );
};

export default Feedback;
