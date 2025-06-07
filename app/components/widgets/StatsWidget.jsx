"use client";

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { mockData } from '../../services/mockData';
import WidgetWrapper from './WidgetWrapper';

export default function StatsWidget({ widget }) {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const metricsData = await mockData.fetchData('metrics');
                setStats(metricsData);
            } catch (error) {
                console.error('Error fetching stats data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <WidgetWrapper widget={widget}>
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="text-sm text-gray-500">{stat.name}</div>
                            <div className="text-2xl font-semibold mt-1">{stat.value}</div>
                            <div className={`flex items-center mt-1 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.isPositive ? (
                                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                                )}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </WidgetWrapper>
    );
}
