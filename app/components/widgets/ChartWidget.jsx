"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import WidgetWrapper from './WidgetWrapper';
import { mockData } from '../../services/mockData';
import { useDashboardStore } from '../../store/dashboardStore';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ChartWidget({ widget }) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { updateWidget } = useDashboardStore();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
                switch (widget.title) {
                    case 'Monthly Revenue':
                        data = await mockData.fetchData('revenue');
                        break;
                    case 'Sales Trends':
                        data = await mockData.fetchData('sales');
                        break;
                    case 'Customer Distribution':
                        data = await mockData.fetchData('distribution');
                        break;
                    default:
                        data = await mockData.fetchData('revenue');
                }
                setChartData(data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [widget.title]);

    const renderBarChart = () => {
        const options = {
            chart: {
                type: 'bar',
                toolbar: {
                    show: false
                }
            },
            colors: ['#4F46E5'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 4
                },
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: chartData.map(item => item.month),
            },
            yaxis: {
                title: {
                    text: 'Revenue ($)'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val.toLocaleString()
                    }
                }
            }
        };

        const series = [{
            name: 'Revenue',
            data: chartData.map(item => item.revenue)
        }];

        return (
            <ReactApexChart options={options} series={series} type="bar" height="100%" />
        );
    };

    const renderLineChart = () => {
        const options = {
            chart: {
                type: 'line',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3,
            },
            colors: ['#10B981'],
            grid: {
                borderColor: '#f1f1f1',
            },
            xaxis: {
                categories: chartData.map(item => {
                    const date = new Date(item.date);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                }),
                labels: {
                    rotate: -45,
                    rotateAlways: false,
                }
            },
            yaxis: {
                title: {
                    text: 'Sales'
                }
            },
            markers: {
                size: 4
            },
            tooltip: {
                x: {
                    format: 'MM/dd/yy'
                },
            }
        };

        const series = [{
            name: 'Sales',
            data: chartData.map(item => item.sales)
        }];

        return (
            <ReactApexChart options={options} series={series} type="line" height="100%" />
        );
    };

    const renderPieChart = () => {
        const options = {
            chart: {
                type: 'pie',
                toolbar: {
                    show: false
                }
            },
            colors: ['#4F46E5', '#10B981', '#F59E0B'],
            labels: chartData.map(item => item.category),
            legend: {
                position: 'bottom'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + "%"
                    }
                }
            }
        };

        const series = chartData.map(item => item.value);

        return (
            <ReactApexChart options={options} series={series} type="pie" height="100%" />
        );
    };

    const handleChartTypeChange = (e) => {
        updateWidget(widget.id, { chartType: e.target.value });
    };

    return (
        <WidgetWrapper widget={widget}>
            <div className="h-full flex flex-col">
                <div className="flex justify-between mb-4">
                    <div>
                        <select
                            value={widget.chartType || 'bar'}
                            onChange={handleChartTypeChange}
                            className="text-sm border-gray-300 rounded-md"
                        >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                        </select>
                    </div>
                </div>

                <div className="flex-grow">
                    {loading ? (
                        <div className="flex h-full justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <>
                            {widget.chartType === 'bar' && renderBarChart()}
                            {widget.chartType === 'line' && renderLineChart()}
                            {widget.chartType === 'pie' && renderPieChart()}
                        </>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
}
