import { ComponentType } from 'react';


import DeleteConfirmation from './index';
import { OnDeleteFunction } from './types';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { DeleteRoundedIcon } from '../../icons';

interface DeleteButtonProps extends IconButtonProps {
  resourceId: ID | object;
  onDelete: OnDeleteFunction;
  isToast?: boolean;
  iconColor?: string;
  opacity?: string;
  message?: string;
  warningMessage?: string;
  IconComponent?: ComponentType<any>;
  isToastMessage?: boolean;
}

const DeleteConfirmationButton = ({
  resourceId,
  onDelete,
  message,
  iconColor,
  opacity,
  IconComponent,
  warningMessage,
  isToastMessage,
  ...rest
}: DeleteButtonProps) => {
  const handleDelete = async () => onDelete(resourceId);

  return (
    <DeleteConfirmation
      resourceId={resourceId}
      onDelete={handleDelete}
      message={message}
      warningMessage={warningMessage}
      isToastMessage={isToastMessage}
    >

      <IconButton size="small" {...rest}>
        {IconComponent ? (
          <IconComponent style={{ color: 'neutral.200', fontSize: 20 }} />
        ) : (
          <DeleteRoundedIcon style={{ opacity: opacity ? opacity : '1' }} />
        )}
      </IconButton>
    </DeleteConfirmation>
  );
};

export default DeleteConfirmationButton;
