import type { DataTableColumn } from "@/components/Shared/DataTable.vue"


const { renderUserAvatar, renderActionButton, renderDeleteActionButton } = useRender()

export const columns: DataTableColumn[] = [
    {
        title: 'FullName',
        dataIndex: 'fullname',
        key: 'fullname', // Fixed: key should match dataIndex
        sorter: true,
        customRender: ({ record }) => {
            return renderUserAvatar(record.picture, record.fullname)
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        sorter: true,
    },
    {
        title: 'Status',
        dataIndex: 'is_active',
        key: 'is_active',
        customRender: ({ text }) => (text ? 'active dev' : 'inactive'),
    },
    {
        title: 'Action',
        fixed: 'right',
        key: 'action',
        width: 100,
        customRender: ({ record }) => [
            renderActionButton(useRenderIcon('hugeicons:pencil-edit-02'), () => { }),
            renderDeleteActionButton(t('common.deleteConfirm'), () =>
                handleDeleteItem(record),
            ),
        ],
    },
]