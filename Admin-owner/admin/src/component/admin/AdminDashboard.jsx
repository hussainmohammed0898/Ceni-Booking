import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { baseUrl } from '../../URL/baseUrl.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalTheaters: 0,
        approvedTheaters: 0,
        pendingTheaters: 0,
        totalUsers: 0,
        totalMovies: 0,
        totalReviews: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/adminDashboard`,{withCredentials:true});
                console.log(response.data);
                
                setStats(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    // Data for Bar Chart (Theaters)
    const theaterData = {
        labels: ['Total Theaters', 'Approved Theaters', 'Pending Theaters'],
        datasets: [
            {
                label: 'Number of Theaters',
                data: [stats.totalTheaters, stats.approvedTheaters, stats.pendingTheaters],
                backgroundColor: ['#1D4ED8', '#16A34A', '#F59E0B'],
            },
        ],
    };

    // Data for Pie Chart (Users, Movies, Reviews)
    const generalData = {
        labels: ['Total Users', 'Total Movies', 'Total Reviews'],
        datasets: [
            {
                data: [stats.totalUsers, stats.totalMovies, stats.totalReviews],
                backgroundColor: ['#3B82F6', '#10B981', '#EF4444'],
            },
        ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
          legend: {
              labels: {
                  color: 'white', 
              },
          },
          title: {
              display: true,
              text: 'Statistics',
              color: 'white', 
          },
          tooltip: {
              bodyColor: 'white', 
          },
      },
      scales: {
          x: {
              ticks: {
                  color: 'white', 
              },
          },
          y: {
              ticks: {
                  color: 'white', 
              },
          },
      },
  };

    return (
        <div className="p-8 ">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200  p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Theater Statistics</h2>
                    <Bar data={theaterData} options={chartOptions} />
                </div>
                <div className="bg-base-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">General Statistics</h2>
                    <Pie data={generalData} options={chartOptions} />
                </div>
            </div>
            <div className="bg-base-200 p-6 rounded-lg shadow-md col-span-1 md:col-span-2 mt-5 text-white">
                    <h2 className="text-xl font-semibold mb-4 ">Detailed Summary</h2>
                    <div className="space-y-4">
                        <p className="text-lg">
                            <strong>Total Theaters:</strong> {stats.totalTheaters}
                        </p>
                        <p className="text-lg">
                            <strong>Approved Theaters:</strong> {stats.approvedTheaters}
                        </p>
                        <p className="text-lg">
                            <strong>Pending Theaters:</strong> {stats.pendingTheaters}
                        </p>
                        <p className="text-lg">
                            <strong>Total Users:</strong> {stats.totalUsers}
                        </p>
                        <p className="text-lg">
                            <strong>Total Movies:</strong> {stats.totalMovies}
                        </p>
                        <p className="text-lg">
                            <strong>Total Reviews:</strong> {stats.totalReviews}
                        </p>
                    </div>
                </div>
        </div>
    );
};

export default AdminDashboard;
