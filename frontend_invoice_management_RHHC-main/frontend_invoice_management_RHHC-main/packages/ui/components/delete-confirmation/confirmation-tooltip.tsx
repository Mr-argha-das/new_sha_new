import {
  Button,
  ClickAwayListener,
  // FlexBox,
  // LoadingButton,
  Typography,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import toast from 'react-hot-toast';

// import LightTooltip from '../popovers/light-tooltip';
import LightTooltip from '@/modules/common/components/popovers/light-tooltip';
// import { LoadingButton } from '../..';
import { FlexBox } from '../../elements';
import { DeleteConfirmationProps } from './types';
import { LoadingButton } from '../..';

interface DeleteConfirmationTooltipProps
  extends Omit<any, 'title' | 'onClose' | 'children'>,
    DeleteConfirmationProps {
  onClose: () => void;
  message: string;
  warningMessage?: string;
  isToastMessage?: boolean;
}

const DeleteConfirmationTooltip = ({
  children,
  resourceId,
  onDelete,
  onClose,
  message,
  warningMessage,
  isToastMessage = true,
  ...rest
}: DeleteConfirmationTooltipProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    if (loading) return;
    onClose();
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      await onDelete(resourceId);
      if (isToastMessage) {
        toast.success(
          message
            ? `${message} successfully deleted.`
            : 'Resource successfully deleted.',
        );
      }

      handleClose();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <LightTooltip
          arrow
          onClose={handleClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          sx={{
            maxWidth: '400px',
            wordBreak: 'break-word',
          }}
          title={
            <DeleteConfirmationTooltipContent
              loading={loading}
              onDelete={handleDelete}
              onClose={handleClose}
              warningMessage={warningMessage}
            />
          }
          {...rest}
        >
          {children}
        </LightTooltip>
      </div>
    </ClickAwayListener>
  );
};

interface DeleteConfirmationTooltipContentProps {
  loading?: boolean;

  onDelete: () => void;

  onClose: () => void;

  warningMessage?: string;
}

const DeleteConfirmationTooltipContent = ({
  onDelete,
  loading = false,
  onClose,
  warningMessage,
}: DeleteConfirmationTooltipContentProps) => {
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <FlexBox
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        width: '100%',
        maxWidth: 300,
        px: 1,
        py: 0.5,
      }}
    >
      <Typography
        color="neutral.600"
        variant="body2"
        sx={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {warningMessage || 'Are you sure ?'}
      </Typography>

      {!warningMessage && (
        <FlexBox
          align="center"
          sx={{
            gap: 1,
            flexShrink: 0,
            ml: 'auto',
          }}
        >
          <LoadingButton
            color="error"
            variant="contained"
            size="small"
            sx={{
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
            onClick={handleDelete}
            loading={loading}
          >
            Yes, Delete
          </LoadingButton>

          <Button
            size="small"
            onClick={handleClose}
            disabled={loading}
            sx={{
              minWidth: 'auto',
              px: 1.5,
              fontSize: '0.75rem',
              color: 'text.secondary',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
        </FlexBox>
      )}
    </FlexBox>
  );
};

export default DeleteConfirmationTooltip;
