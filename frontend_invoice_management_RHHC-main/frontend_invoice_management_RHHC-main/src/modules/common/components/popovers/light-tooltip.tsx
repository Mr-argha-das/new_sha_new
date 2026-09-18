import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
// import { Tooltip, tooltipClasses, TooltipProps } from 'ui';
// import { styled } from 'ui/styles';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[3],
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    color: 'unset',
  },
  [`& .${tooltipClasses.arrow}::before`]: {
    color: theme.palette.common.white,
    boxShadow: theme.shadows[3],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
}));

export default LightTooltip;
