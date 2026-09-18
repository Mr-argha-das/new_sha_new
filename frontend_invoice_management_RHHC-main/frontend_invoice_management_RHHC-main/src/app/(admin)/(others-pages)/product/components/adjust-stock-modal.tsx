'use client';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { incDecProductStock } from '../api';
import { IncDecProductStockPayload } from '../api/schema';

type AdjustStockModalProps = {
  open: boolean;
  onClose: () => void;
  productId: number;
  availableStock: number;
  onSuccess: () => void;
};

export default function AdjustStockModal({
  open,
  onClose,
  productId,
  availableStock,
  onSuccess,
}: AdjustStockModalProps) {
  const [type, setType] = useState<'increment' | 'decrement'>('increment');
  const [quantity, setQuantity] = useState<string>('1');
  const [submitting, setSubmitting] = useState(false);

  const isAdd = type === 'increment';
  const qtyNum = Math.max(0, parseInt(quantity, 10) || 0);
  const canSubmit = qtyNum >= 1 && (isAdd || qtyNum <= availableStock);

  useEffect(() => {
    if (open) {
      setType('increment');
      setQuantity('1');
    }
  }, [open]);

  const handleClose = () => {
    setQuantity('1');
    onClose();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload: IncDecProductStockPayload = {
        product_id: productId,
        type,
        quantity: qtyNum,
      };
      await incDecProductStock(payload);
      toast.success(
        isAdd ? 'Stock added successfully' : 'Stock removed successfully',
      );
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(
        message || (isAdd ? 'Failed to add stock' : 'Failed to remove stock'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Adjust stock</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, v) => v != null && setType(v)}
            fullWidth
            size="small"
          >
            <ToggleButton value="increment" aria-label="Add stock">
              <AddIcon sx={{ mr: 0.5 }} /> Add stock
            </ToggleButton>
            <ToggleButton
              value="decrement"
              aria-label="Remove stock"
              disabled={availableStock <= 0}
            >
              <RemoveIcon sx={{ mr: 0.5 }} /> Remove stock
            </ToggleButton>
          </ToggleButtonGroup>
          <TextField
            autoFocus
            fullWidth
            type="number"
            label="Quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            slotProps={{
              htmlInput: {
                min: 1,
                max: isAdd ? undefined : availableStock,
              },
            }}
            helperText={
              !isAdd && availableStock !== undefined
                ? `Available: ${availableStock}. Enter 1–${availableStock} to remove.`
                : 'Enter quantity.'
            }
            error={!isAdd && qtyNum > availableStock}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          color={isAdd ? 'primary' : 'error'}
        >
          {submitting ? 'Updating…' : 'Update stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
