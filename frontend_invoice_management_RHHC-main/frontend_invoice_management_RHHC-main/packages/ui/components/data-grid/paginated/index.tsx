// import { useAuth } from '@/context/AuthContext.jsx';
import { useAuth } from '@/context/AuthContext';
import PageLoader from '@/modules/common/elements/page/page-loader';
import { Box, debounce } from '@mui/material';
import type {
  DataGridProps,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import type { ChangeEvent, FC } from 'react';
import { useMemo, useState } from 'react';
import Toolbar from './toolbar';
import type { ToolbarContainer } from './toolbar.tsx';
import type {
  PaginatedApi,
  PaginatedApiRequestParams,
  PaginatedResponseDto,
} from './types';
// import { useAuth } from '@/context/AuthContext.jsx';

interface Components {
  noRows: FC;
}

export interface PaginatedDataGridProps<Model>
  extends Omit<
    DataGridProps,
    'rows' | 'paginationModel' | 'onPaginationModelChange' | 'components'
  >,
  Pick<UseQueryOptions, 'queryKey'> {
  query: PaginatedApi<Model>;

  /** Is this data grid searchable? Defaults to `true` */
  searchable?: boolean;

  /** Label for search input */
  searchLabel?: string;

  /** If provided, this would be used as a container for search bar, you must consume `children` property in your container component to display the search bar. */
  toolbarContainer?: ToolbarContainer;

  /** Is Full page data grid ? Defaults to `true` */
  fullPage?: boolean;

  extraParams?: Record<string, string | number | boolean | undefined | null>;
  setExtraParams?: (params: Record<string, string | number | boolean>) => void;

  /** If we want to provide custom component for various scenarios as "No Rows" */
  components?: Partial<Components>;
}

const DEFAULT_RESPONSE: PaginatedResponseDto<any> = {
  data: [],
  meta: {
    totalRecords: 0,
  },
};

/** A cursor-based paginated data grid wrapper around MuiDataGrid */
const PaginatedDataGrid = <Model extends Record<string, any>>({
  query,
  queryKey,
  pageSizeOptions = [10, 50, 100],
  className,
  fullPage = true,
  searchable = true,
  searchLabel,
  toolbarContainer,
  extraParams = {},
  setExtraParams,
  components = {},
  ...rest
}: PaginatedDataGridProps<Model>) => {
  // const { user } = useAuth();
  const { isAuthLoading, token } = useAuth();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: (pageSizeOptions[0] as number) ?? 20,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchValue, setSearchValue] = useState(extraParams?.q ?? '');

  const queryParams: PaginatedApiRequestParams = useMemo(() => {
    const sortField = sortModel[0]?.field;
    const sortOrder = sortModel[0]?.sort;
    const baseParams = {
      page: Number(paginationModel.page + 1),
      limit: paginationModel.pageSize,
      ...(searchValue ? { q: String(searchValue).trim() } : {}),
    };
    if (sortField && sortOrder) {
      return {
        ...baseParams,
        sort: sortField,
        order: sortOrder,
      };
    }
    return baseParams;
  }, [paginationModel, searchValue, sortModel]);

  const {
    data: result,
    isFetching,
    error,
  } = useQuery({
    queryKey: [...queryKey, queryParams, extraParams],
    queryFn: () =>
      query({ ...queryParams, ...extraParams }).then(
        (response) => response.data,
      ),
    staleTime: 0,
    enabled: !!token,
  });

  const { data, meta } = useMemo(() => {
    return result ?? DEFAULT_RESPONSE;
  }, [result]);

  const noRowsFound =
    paginationModel.page === 0 &&
    !isFetching &&
    data.length === 0 &&
    !searchValue;

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel,
  ) => {
    setPaginationModel(newPaginationModel);
  };

  const handleSearchChange = debounce(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPaginationModel((prev) => ({
        ...prev,
        page: 0,
      }));
      setSearchValue(event.target.value);
      setExtraParams?.({ q: event.target.value });
    },
    600,
  );

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  if (isFetching || isAuthLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <></>;
  }

  if (components.noRows && noRowsFound) {
    /** We have custom `noRows` slot available, so need to show that */
    const NoRows = components.noRows;
    return <NoRows />;
  }

  return (
    <>
      {searchable ? (
        <Toolbar
          container={(props) =>
            toolbarContainer?.({
              ...props,
              rows: data,
            })
          }
          label={searchLabel}
          onChange={handleSearchChange}
          value={String(searchValue)}
        />
      ) : null}
      <Box display='flex' flexDirection='column' maxHeight={500}>
        <DataGrid
          getRowId={(row) => row._id || row.id}
          onSortModelChange={handleSortModelChange}
          className={classNames({ 'MuiDataGrid-FullPage': fullPage }, className)}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          filterMode="server"
          getRowHeight={() => 'auto'}
          loading={isFetching}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={pageSizeOptions}
          paginationMode="server"
          paginationModel={paginationModel}
          rowCount={meta?.total || 0}
          rows={data}
          sx={{
            '& .MuiDataGrid-cell': {
              py: '13px',
              '&:focus-within': {
                outline: 'none',
              },
            },
          }}
          {...rest}
        />
      </Box>
    </>
  );
};

export default PaginatedDataGrid;
