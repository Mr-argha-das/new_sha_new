import { cloneElement, useState } from 'react';
import DeleteConfirmationTooltip from './confirmation-tooltip';
import { DeleteConfirmationProps } from './types';

interface DeleteConfirmationContainerProps extends DeleteConfirmationProps {
  /** Do we want to show Delete confirmation dialog or tooltip? Defaults to "false" */
  dialog?: boolean;
  message?: string;
  warningMessage?: string;
  isToastMessage?: boolean;
}

const DeleteConfirmation = ({
  onDelete,
  resourceId,
  children,
  message,
  warningMessage,
  isToastMessage,
  dialog = false,
}: DeleteConfirmationContainerProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const showTooltip = async (event: any) => {
    event.stopPropagation();
    setIsTooltipVisible(true);
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

  if (dialog) {
    /** TODO: Add implementation for DeleteConfirmationModal when required */
    return null;
  }

  return (
    <DeleteConfirmationTooltip
      open={isTooltipVisible}
      onClose={hideTooltip}
      resourceId={resourceId}
      onDelete={onDelete}
      message={message ?? ''}
      warningMessage={warningMessage}
      isToastMessage={isToastMessage}
    >
      {/* @ts-ignore */}
      {cloneElement(children, { onClick: showTooltip })}
    </DeleteConfirmationTooltip>
  );
};

export default DeleteConfirmation;
