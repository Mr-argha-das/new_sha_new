'use client';

import { useAuth } from '@/context/AuthContext';
import PageLayoutHeader from '@/modules/common/components/page-layout/header';
import Link from '@/modules/common/elements/link';
import { capitalizeFirstLetter } from '@/modules/common/helpers/capitalizeWords';
import { truncateText } from '@/modules/common/helpers/truncateText';
import useInvalidate from '@/modules/common/libs/react-query/useInvalidate';
import PagePermissionGuard from '@/modules/guards/page/permission-guard';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import PaginatedDataGrid from '../../../../../packages/ui/components/data-grid/paginated';
import { ToolbarContainer } from '../../../../../packages/ui/components/data-grid/paginated/toolbar';
import DeleteConfirmationButton from '../../../../../packages/ui/components/delete-confirmation/button';
import { OnDeleteFunction } from '../../../../../packages/ui/components/delete-confirmation/types';
import { VisibilityIcon } from '../../../../../packages/ui/icons';
import { getCategories, removeCategory, StaffExperienceCategory } from './api';

const CategoryList = () => {
    const invalidate = useInvalidate();
    const { user } = useAuth();

    const handleDelete: OnDeleteFunction = async (id) => {
        let categoryId: string;
        if (typeof id === 'string') {
            categoryId = id;
        } else if (id && typeof id === 'object' && 'id' in id) {
            categoryId = String((id as { id: string | number }).id);
        } else {
            throw new Error('Invalid id type');
        }
        await removeCategory(categoryId);
        await invalidate(['getCategories']);
    };

    const columns: GridColDef<StaffExperienceCategory>[] = [
        {
            field: 'id',
            headerName: 'ID',
            minWidth: 80,
            renderCell: ({ row }) => {
                return <span>{row.id}</span>;
            },
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: ({ row }) => {
                return <span>{capitalizeFirstLetter(truncateText(row.name, 17))}</span>;
            },
        },
        {
            field: 'description',
            headerName: 'Description',
            minWidth: 250,
            renderCell: ({ row }) => {
                return <span>{truncateText(row?.description || '', 22)}</span>;
            },
        },
        {
            field: 'actions',
            headerName: '',
            sortable: false,
            filterable: false,
            minWidth: 200,
            disableColumnMenu: true,
            renderCell: ({ row }) => {
                return (
                    <Stack spacing={2} direction="row">
                        <Box display={'flex'}>
                            <Link href={`/staff-experience-category/${row.id}`} tenantId>
                                <Tooltip title={`View`}>
                                    <IconButton
                                        size="small"
                                        onClick={async () => {
                                            await invalidate(['getCategoryById']);
                                        }}
                                    >
                                        <VisibilityIcon
                                            style={{ color: 'neutral.500', opacity: 1 }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <DeleteConfirmationButton
                                message="Are you sure you want to delete this category?"
                                iconColor="neutral.500"
                                opacity="1"
                                resourceId={String(row.id)}
                                onDelete={handleDelete}
                                sx={{
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 23,
                                    },
                                }}
                            />
                        </Box>
                    </Stack>
                );
            },
        },
    ];

    return (
        <PagePermissionGuard permissions={'user-management/staff-experience-category:read'}>
            <PaginatedDataGrid
                query={async (params) => {
                    const response = await getCategories(params);
                    return response;
                }}
                queryKey={['getCategories']}
                columns={columns}
                searchLabel="Search"
                toolbarContainer={HeaderToolbar}
                extraParams={{
                    account_id: user?.account_id,
                    branch_id: user?.branch_id,
                }}
            />
        </PagePermissionGuard>
    );
};

const HeaderToolbar: ToolbarContainer = ({ children }) => {
    return (
        <>
            <PageLayoutHeader
                breadcrumbs={[
                    {
                        href: `/staff-experience-category`,
                        name: 'Experience Category',
                    },
                ]}
                title="Experience Category"
            >
                {children}
                <Link href="/staff-experience-category/add">
                    <Tooltip title={`Add Category`}>
                        <Button variant="contained" sx={{ ml: 4 }}>
                            Add
                        </Button>
                    </Tooltip>
                </Link>
            </PageLayoutHeader>
        </>
    );
};

export default CategoryList;

