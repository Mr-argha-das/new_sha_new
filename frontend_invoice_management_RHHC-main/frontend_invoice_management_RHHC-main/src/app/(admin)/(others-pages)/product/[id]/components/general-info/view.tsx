import PageLayout from '@/modules/common/components/page-layout';
import ResourceDetail from '@/modules/common/components/resource-detail';
import { capitalizeWords } from '@/modules/common/helpers/capitalizeWords';
import { toDDMMYYYY } from '@/modules/common/helpers/dateFormat';
import { formatINR } from '@/modules/common/helpers/helper';
import { chipLable } from '@/modules/common/helpers/helpers';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import AdjustStockModal from '../../../components/adjust-stock-modal';
import { useProductEditPageContext } from '../../context';

interface ViewGeneralInformationProps {
  onEdit: () => void;
}

const ViewGeneralInformation = ({ onEdit }: ViewGeneralInformationProps) => {
  const { product, activeSection } = useProductEditPageContext();
  const invalidate = useInvalidate();
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);

  const productId = product?.id ? Number(product.id) : 0;
  const availableStock = Number(product?.available_stock ?? 0);

  const handleStockSuccess = async () => {
    if (product?.id != null) {
      await invalidate(['getProductById', String(product.id)]);
    }
  };

  return (
    <PageLayout.FormSection
      blur={Boolean(activeSection)}
      onEdit={onEdit}
      title={
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          marginRight={2}
        >
          <Typography variant="h5">General Information</Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<InventoryIcon />}
            onClick={() => setAdjustModalOpen(true)}
          >
            Adjust stock
          </Button>
        </Box>
      }
      sx={{ mt: 3 }}
    >
      <Grid container spacing={[4, 4]} sx={{ mb: 6 }}>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="SKU Code" value={product?.sku_code || ''} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Name" value={capitalizeWords(product?.name)} />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Purchase Date"
            value={
              product?.purchase_date ? toDDMMYYYY(product?.purchase_date) : ''
            }
          />
        </Grid>

        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Base Price"
            value={formatINR(Number(product?.base_price), true)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Sale Price"
            value={formatINR(Number(product?.sale_price), true)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Hour Rent Price"
            value={formatINR(Number(product?.hour_rent_price), true)}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Status"
            isComponent={true}
            value={chipLable(product?.status ?? '')}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Total Stock"
            value={product?.total_stock ?? 0}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Available Stock"
            value={product?.available_stock ?? 0}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail
            label="Rented Stock"
            value={product?.rented_stock ?? 0}
          />
        </Grid>
        <Grid size={{ lg: 4, xs: 12 }}>
          <ResourceDetail label="Sold Stock" value={product?.sold_stock ?? 0} />
        </Grid>
        <Grid size={{ lg: 12, xs: 12 }}>
          <ResourceDetail
            label="Description"
            value={capitalizeWords(product?.description)}
          />
        </Grid>
      </Grid>

      <AdjustStockModal
        open={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        productId={productId}
        availableStock={availableStock}
        onSuccess={handleStockSuccess}
      />
    </PageLayout.FormSection>
  );
};

export default ViewGeneralInformation;
