import NotFoundIllustration from '../../assets/illustrations/404.svg';
import Feedback, { FeedbackProps } from './feedback';

type NotFoundProps = Omit<FeedbackProps, 'illustration'>;

const DEFAULT_TITLE = "404 : The page you are looking for isn't here.";

/**
 * A variant of the {@link Feedback} component that renders a "Not Found"
 * message and an associated illustration.
 *
 * @param {NotFoundProps} props The component props.
 * @param {string} [props.title] The title of the Feedback component.
 * @param {ReactNode} [props.children] The children of the Feedback component.
 * @param {ActionProps} [props.action] The action of the Feedback component.
 *
 * @example
 * <NotFound title="Resource not found." />
 */
const NotFound = ({ title, ...rest }: NotFoundProps) => {
  return (
    <Feedback
      illustration={
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- TODO: Fix the lint error
        <img alt="Not Found" height={264} src={NotFoundIllustration.src} />
      }
      title={title || DEFAULT_TITLE}
      {...rest}
    />
  );
};

export default NotFound;
