// import { BoxProps } from '@material-ui/core';
import { ReactNode, useCallback } from 'react';

import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { FlexBox, LoadingButton } from '../../../../../packages/ui';
import { EditRoundedIcon } from '../../../../../packages/ui/icons';
import PageContainer from '../../elements/page/page-container';
import { Mode } from '../../types/enum';

interface PageLayoutFormSectionProps
  extends Partial<ViewModeActionsProps>,
    Partial<EditModeActionsProps>,
    Pick<BoxProps, 'sx'> {
  title: ReactNode;

  children: ReactNode;

  actions?: ReactNode;

  /** Is this form section editable? If yes, we would show an edit icon beside title */
  editable?: boolean;

  /** Current mode of form section. Defaults to `Mode.VIEW` */
  mode?: Mode;

  /** If true, opacity would be decreased for this section */
  blur?: boolean;

  extraItems?: ReactNode;
}

const PageLayoutFormSection = ({
  children,
  mode = Mode.VIEW,
  blur = false,
  sx,
  loading,
  extraItems,
  ...rest
}: PageLayoutFormSectionProps) => {
  return (
    <PageContainer
      component="section"
      sx={{
        // m: '20px',

        border: '1px solid #00000026',
        borderRadius: '4px',
        opacity: blur ? 0.4 : 1,
        filter: blur ? 'blur(1px)' : 'none',
        ...sx,
      }}
    >
      <PageLayoutFormSectionHeader
        loading={loading}
        mode={mode}
        extraItems={extraItems && extraItems}
        {...rest}
      />
      <Box sx={{ mt: 4 }}>{children}</Box>
    </PageContainer>
  );
};

export const PageLayoutFormSectionHeader = ({
  mode,
  title,
  actions,
  editable = true,
  onEdit,
  onSave,
  onCancel,
  loading,
  extraItems,
}: Omit<PageLayoutFormSectionProps, 'children' | 'blur'>) => {
  const Actions = useCallback(() => {
    if (actions) {
      return (
        <Box display={'flex'} justifyContent={'space-between'}>
          {actions}
        </Box>
      );
    }

    if (mode === Mode.EDIT) {
      return (
        <EditModeActions
          loading={loading}
          onCancel={onCancel!}
          onSave={onSave}
        />
      );
    }
    {
      extraItems && extraItems;
    }
    return (
      editable && <ViewModeActions onEdit={onEdit!} extraItems={extraItems} />
    );
  }, [actions, mode, onEdit, onSave, onCancel]);

  return (
    <FlexBox
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {typeof title === 'string' ? (
        <Typography
          color={mode === Mode.EDIT ? 'primary.dark' : 'neutral.500'}
          letterSpacing={-0.4}
          variant="h5"
        >
          {title}
        </Typography>
      ) : (
        title
      )}

      {/* {editable && (
        <Box
          role="divider"
          sx={{
            mx: 4,
            borderRightWidth: 1,
            borderRightStyle: 'solid',
            borderRightColor: 'divider',
            height: 24,
          }}
        />
      )} */}

      {editable ? <Actions /> : null}
    </FlexBox>
  );
};

interface ViewModeActionsProps {
  onEdit: () => void;
  extraItems?: ReactNode;
}

const ViewModeActions = ({ onEdit, extraItems }: ViewModeActionsProps) => {
  return (
    <FlexBox>
      <Tooltip title={'Edit'}>
        <IconButton size="small" onClick={onEdit}>
          <EditRoundedIcon fontSize="small" sx={{ color: 'neutral.300' }} />
        </IconButton>
      </Tooltip>
      {extraItems}
      {/* <EditRoundedIcon fontSize="small" sx={{ color: 'neutral.300' }} /> */}
    </FlexBox>
  );
};

interface EditModeActionsProps {
  loading?: boolean;

  onSave?: () => void;

  onCancel: () => void;
}

const EditModeActions = ({
  loading,
  onSave,
  onCancel,
}: EditModeActionsProps) => {
  return (
    <FlexBox sx={{ gap: 1 }}>
      <LoadingButton
        size="small"
        variant="contained"
        type="submit"
        loading={loading}
        onClick={onSave}
        sx={{ fontWeight: 600 }}
      >
        Save
      </LoadingButton>
      <Button
        variant="text"
        size="small"
        type="button"
        disabled={loading}
        onClick={onCancel}
        sx={{ fontWeight: 600, px: 1, color: 'neutral.300' }}
      >
        Cancel
      </Button>
    </FlexBox>
  );
};

export default PageLayoutFormSection;
