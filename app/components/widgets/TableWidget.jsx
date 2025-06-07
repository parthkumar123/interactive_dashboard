"use client";

import { useState, useEffect } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { mockData } from '../../services/mockData';
import WidgetWrapper from './WidgetWrapper';

export default function TableWidget({ widget }) {
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: 'Name',
        }),
        columnHelper.accessor('email', {
            cell: info => info.getValue(),
            header: 'Email',
        }),
        columnHelper.accessor('status', {
            cell: info => {
                const status = info.getValue();
                const getStatusColor = () => {
                    switch (status) {
                        case 'Active':
                            return 'bg-green-100 text-green-800';
                        case 'Inactive':
                            return 'bg-gray-100 text-gray-800';
                        case 'Pending':
                            return 'bg-yellow-100 text-yellow-800';
                        default:
                            return 'bg-gray-100 text-gray-800';
                    }
                };

                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {status}
                    </span>
                );
            },
            header: 'Status',
        }),
        columnHelper.accessor('lastOrder', {
            cell: info => info.getValue(),
            header: 'Last Order',
        }),
        columnHelper.accessor('totalSpent', {
            cell: info => info.getValue(),
            header: 'Total Spent',
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
        const fetchCustomerData = async () => {
            setLoading(true);
            try {
                const customers = await mockData.fetchData('customers');
                setData(customers);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, []);

    const handleExportCSV = () => {
        // Convert data to CSV
        const headers = columns.map(col => col.header);
        const csvRows = [
            headers.join(','),
            ...data.map(row =>
                Object.values(row)
                    .map(val => `"${val}"`)
                    .join(',')
            )
        ];

        const csvContent = `data:text/csv;charset=utf-8,${csvRows.join('\n')}`;
        const encodedUri = encodeURI(csvContent);

        // Create download link and trigger download
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${widget.title}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <WidgetWrapper widget={widget}>
            <div className="flex justify-between mb-4">
                <div className="text-sm text-gray-500">
                    {data.length} customers
                </div>
                <button
                    onClick={handleExportCSV}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Export CSV
                </button>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <span className="ml-2">
                                                    {{
                                                        asc: <ArrowUpIcon className="h-4 w-4" />,
                                                        desc: <ArrowDownIcon className="h-4 w-4" />,
                                                        false: <ArrowsUpDownIcon className="h-4 w-4 text-gray-300" />,
                                                    }[header.column.getIsSorted() || false]}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </WidgetWrapper>
    );
}
