import ForbiddenIllustration from '../../assets/illustrations/401.svg';
// import ForbiddenIllustration from './'
import type { FeedbackProps } from './feedback';
import Feedback from './feedback';

type ForbiddenProps = Omit<FeedbackProps, 'illustration'>;

const DEFAULT_TITLE = 'You are not authorized to perform this action.';

const Forbidden = ({ title, ...rest }: ForbiddenProps) => {
  return (
    <Feedback
      illustration={
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- TODO: Fix the lint error
        <img
          alt="Forbidden"
          // height={100}
          width={300}
          src={'/images/illustrations/401.svg'}
        />
      }
      title={title ?? DEFAULT_TITLE}
      {...rest}
    />
  );
};

export default Forbidden;
