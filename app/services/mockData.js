// Mock data service for dashboard widgets
export const mockData = {
    // Customer data for tables
    customers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', lastOrder: '2025-06-01', totalSpent: '$1,240' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', lastOrder: '2025-05-28', totalSpent: '$890' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', status: 'Inactive', lastOrder: '2025-04-15', totalSpent: '$2,100' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', status: 'Active', lastOrder: '2025-06-02', totalSpent: '$345' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', status: 'Pending', lastOrder: '2025-05-30', totalSpent: '$1,560' },
        { id: 6, name: 'Sarah Taylor', email: 'sarah@example.com', status: 'Active', lastOrder: '2025-05-25', totalSpent: '$780' },
        { id: 7, name: 'David Brown', email: 'david@example.com', status: 'Active', lastOrder: '2025-06-03', totalSpent: '$2,340' },
    ],

    // Revenue data for bar charts
    revenueData: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18000 },
        { month: 'Apr', revenue: 14000 },
        { month: 'May', revenue: 21000 },
        { month: 'Jun', revenue: 25000 }
    ],

    // Sales data for line charts
    salesTrends: [
        { date: '2025-01-01', sales: 420 },
        { date: '2025-01-15', sales: 480 },
        { date: '2025-02-01', sales: 550 },
        { date: '2025-02-15', sales: 520 },
        { date: '2025-03-01', sales: 680 },
        { date: '2025-03-15', sales: 720 },
        { date: '2025-04-01', sales: 750 },
        { date: '2025-04-15', sales: 790 },
        { date: '2025-05-01', sales: 860 },
        { date: '2025-05-15', sales: 940 },
        { date: '2025-06-01', sales: 980 },
    ],

    // Customer distribution data for pie charts
    customerDistribution: [
        { category: 'New', value: 30 },
        { category: 'Returning', value: 45 },
        { category: 'Regular', value: 25 }
    ],

    // Key metrics for stats widgets
    keyMetrics: [
        { name: 'Total Revenue', value: '$82,400', change: '+12%', isPositive: true },
        { name: 'Active Users', value: '1,245', change: '+8%', isPositive: true },
        { name: 'Conversion Rate', value: '3.2%', change: '-0.5%', isPositive: false },
        { name: 'Avg. Order Value', value: '$128', change: '+5%', isPositive: true }
    ],

    // Function to get filtered data with delay to simulate API call
    fetchData: async (dataType, filters = {}) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return appropriate data based on type
        switch (dataType) {
            case 'customers':
                return mockData.customers;
            case 'revenue':
                return mockData.revenueData;
            case 'sales':
                return mockData.salesTrends;
            case 'distribution':
                return mockData.customerDistribution;
            case 'metrics':
                return mockData.keyMetrics;
            default:
                return [];
        }
    }
};
