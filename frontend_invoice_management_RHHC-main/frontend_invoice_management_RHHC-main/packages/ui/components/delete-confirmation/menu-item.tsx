// import { MenuItem, Typography } from 'ui';
/* eslint-disable */
import { MenuItem, Typography } from '@mui/material';
// import { useMenu } from 'ui/elements/Menu/context';
import DeleteConfirmation from './index';
import { DeleteConfirmationProps, OnDeleteFunction } from './types';
import { useMenu } from '../../elements/Menu/context';

const DeleteConfirmationMenuItem = ({
  resourceId,
  onDelete,
  message = '',
}: Omit<DeleteConfirmationProps, 'children'>) => {
  const { close } = useMenu();

  const handleDelete: OnDeleteFunction = async (id) => {
    try {
      await onDelete(id);
      close();
    } catch (error) {
      throw error;
    }
  };

  return (
    <MenuItem sx={{ padding: '0 !important' }} preventCloseOnClick>
      <DeleteConfirmation
        message={message}
        resourceId={resourceId}
        onDelete={handleDelete}
      >
        <Typography sx={{ py: 1.5, px: 3 }}>Delete</Typography>
      </DeleteConfirmation>
    </MenuItem>
  );
};

export default DeleteConfirmationMenuItem;
