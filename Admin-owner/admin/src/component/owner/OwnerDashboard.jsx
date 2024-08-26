import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { baseUrl } from '../../URL/baseUrl.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function OwnerDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/owner/dashboardStats`, { withCredentials: true });
                console.log("res:", response.data);
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <p className="text-center text-gray-500">Loading...</p>;

    const chartData = {
        labels: ['Total Bookings', 'Total Theaters', 'Total Shows', 'Total Movies'],
        datasets: [
            {
                label: 'Dashboard Stats',
                data: [stats.totalBookings, stats.totalTheaters, stats.totalShows, stats.totalMovies],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6 bg-base-500 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
            <div className="max-w-4xl mx-auto bg-base-200 p-6 rounded-lg shadow-md">
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Dashboard Statistics',
                            },
                        },
                    }}
                />
            </div>
            <div className="mt-6 space-y-4">
                    <p className="text-lg font-medium">Total Theaters: {stats.totalTheaters}</p>
                    <p className="text-lg font-medium">Total Shows: {stats.totalShows}</p>
                    <p className="text-lg font-medium">Total Movies: {stats.totalMovies}</p>
                    <p className="text-lg font-medium badge-success rounded p-2 text-center">Total Revenue: {stats.totalRevenue}Rs</p>
                </div>
        </div>
    );
}

export default OwnerDashboard;
