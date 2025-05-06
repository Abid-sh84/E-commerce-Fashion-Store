import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, getSalesStats, getAllOrders, getAllProducts, getUsers } from "../../api/admin";
import axios from "axios";
import { API_URL } from "../../api/config";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: [],
    ordersToday: 0,
    newUsersToday: 0,
    salesByCategory: [],
    orderStatusCounts: {},
    totalSubscribers: 0,
    totalReviews: 0
  });
  const [salesData, setSalesData] = useState({
    labels: [],
    sales: [],
    orders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [salesPeriod, setSalesPeriod] = useState('week');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute in milliseconds

  useEffect(() => {
    // Fetch all required data for dashboard
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch main dashboard stats
        const dashboardStats = await getDashboardStats();
        
        // Fetch sales stats for the chart
        const sales = await getSalesStats(salesPeriod);
        
        // Fetch additional metrics (subscribers, reviews)
        const token = localStorage.getItem("token");
        const [subscribersResponse, reviewsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/subscribers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/reviews`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        const totalSubscribers = Array.isArray(subscribersResponse.data) ? subscribersResponse.data.length : 0;
        const totalReviews = Array.isArray(reviewsResponse.data) ? reviewsResponse.data.length : 0;
        
        // If backend doesn't return all required data, fetch additional data
        let recentOrders = dashboardStats.recentOrders || [];
        let topProducts = dashboardStats.topProducts || [];
        
        // If recent orders not provided by dashboard endpoint, fetch separately
        if (!recentOrders.length) {
          const ordersResponse = await getAllOrders({ limit: 5, sort: '-createdAt' });
          recentOrders = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse.orders || [];
        }
        
        // If top products not provided by dashboard endpoint, fetch separately
        if (!topProducts.length) {
          const productsResponse = await getAllProducts({ limit: 5, sort: '-sold' });
          topProducts = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];
        }

        // Process sales data for charts
        const labels = sales.data?.map(item => item.date) || [];
        const salesValues = sales.data?.map(item => item.revenue) || [];
        const ordersCount = sales.data?.map(item => item.orders) || [];

        setSalesData({
          labels,
          sales: salesValues,
          orders: ordersCount
        });

        // Update all stats
        setStats({
          totalOrders: dashboardStats.totalOrders || 0,
          totalRevenue: dashboardStats.totalRevenue || 0,
          totalProducts: dashboardStats.totalProducts || 0,
          totalUsers: dashboardStats.totalUsers || 0,
          recentOrders,
          topProducts,
          ordersToday: dashboardStats.ordersToday || 0,
          newUsersToday: dashboardStats.newUsersToday || 0,
          salesByCategory: dashboardStats.salesByCategory || [],
          orderStatusCounts: dashboardStats.orderStatusCounts || {
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
          },
          totalSubscribers,
          totalReviews
        });
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // If API fails, try to fetch data separately as fallback
        try {
          const token = localStorage.getItem("token");
          const [orders, products, users, subscribers, reviews] = await Promise.all([
            getAllOrders(),
            getAllProducts(),
            getUsers(),
            axios.get(`${API_URL}/api/subscribers`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/api/reviews`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          ]);
          
          // Process orders to calculate revenue and order status
          const ordersList = Array.isArray(orders) ? orders : orders.orders || [];
          const productsList = Array.isArray(products) ? products : products.products || [];
          const usersList = Array.isArray(users) ? users : users.users || [];
          
          // Get subscribers and reviews count
          const totalSubscribers = Array.isArray(subscribers.data) ? subscribers.data.length : 0;
          const totalReviews = Array.isArray(reviews.data) ? reviews.data.length : 0;
          
          const totalRevenue = ordersList.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
          
          // Calculate order status counts
          const orderStatusCounts = {
            processing: 0,
            shipped: 0,
            delivered: 0, 
            cancelled: 0
          };
          
          // Count orders by status
          ordersList.forEach(order => {
            const status = order.status ? order.status.toLowerCase() : (order.isPaid ? 'processing' : 'processing');
            if (orderStatusCounts.hasOwnProperty(status)) {
              orderStatusCounts[status]++;
            } else {
              orderStatusCounts.processing++;
            }
          });
          
          // Get today's orders and new users
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const ordersToday = ordersList.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= today;
          }).length;
          
          const newUsersToday = usersList.filter(user => {
            const userDate = new Date(user.createdAt);
            return userDate >= today;
          }).length;
          
          // Generate sales data for the selected period
          const salesData = generateSalesDataForPeriod(ordersList, salesPeriod);
          
          setSalesData(salesData);
          
          setStats({
            totalOrders: ordersList.length,
            totalRevenue,
            totalProducts: productsList.length,
            totalUsers: usersList.length,
            recentOrders: ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
            topProducts: productsList.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5),
            ordersToday,
            newUsersToday,
            salesByCategory: calculateSalesByCategory(ordersList, productsList),
            orderStatusCounts,
            activeCoupons: 0,
            totalReviews,
            totalSubscribers
          });
          
          setLastUpdated(new Date());
        } catch (fallbackError) {
          console.error('Fallback data fetching failed:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Set up auto-refresh interval
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        console.log(`Auto-refreshing dashboard data every ${refreshInterval / 1000} seconds`);
        fetchDashboardData();
      }, refreshInterval);
    }

    // Clean up interval on component unmount or when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [salesPeriod, autoRefresh, refreshInterval]);

  // Helper function to generate sales data based on orders for a specific period
  const generateSalesDataForPeriod = (orders, period) => {
    let labels = [];
    let salesByDay = {};
    let ordersByDay = {};
    
    const today = new Date();
    let startDate;
    
    // Calculate start date based on period
    if (period === 'week') {
      startDate = new Date();
      startDate.setDate(today.getDate() - 6); // Last 7 days
      // Create labels for each day of the week
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(formattedDate);
        salesByDay[formattedDate] = 0;
        ordersByDay[formattedDate] = 0;
      }
    } else if (period === 'month') {
      startDate = new Date();
      startDate.setDate(today.getDate() - 29); // Last 30 days
      // Create labels for each day of the month
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(formattedDate);
        salesByDay[formattedDate] = 0;
        ordersByDay[formattedDate] = 0;
      }
    } else if (period === 'year') {
      // Create labels for each month of the year
      for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), i, 1);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short' });
        labels.push(formattedDate);
        salesByDay[formattedDate] = 0;
        ordersByDay[formattedDate] = 0;
      }
      startDate = new Date(today.getFullYear(), 0, 1); // Start of year
    }
    
    // Aggregate sales and orders data by day/month
    orders.forEach(order => {
      if (!order.createdAt) return;
      
      const orderDate = new Date(order.createdAt);
      
      // Skip orders before the start date
      if (orderDate < startDate) return;
      
      let dateKey;
      if (period === 'year') {
        dateKey = orderDate.toLocaleDateString('en-US', { month: 'short' });
      } else {
        dateKey = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      if (salesByDay.hasOwnProperty(dateKey)) {
        salesByDay[dateKey] += (order.totalPrice || 0);
        ordersByDay[dateKey] += 1;
      }
    });
    
    // Convert aggregated data to arrays for chart
    const salesData = labels.map(label => salesByDay[label] || 0);
    const ordersData = labels.map(label => ordersByDay[label] || 0);
    
    return {
      labels,
      sales: salesData,
      orders: ordersData
    };
  };

  // Helper function to calculate sales by product category
  const calculateSalesByCategory = (orders, products) => {
    const productMap = {};
    const categoryMap = {};
    
    // Create a map of product IDs to their category
    products.forEach(product => {
      productMap[product._id] = product.category;
      
      // Initialize category in the map
      if (product.category && !categoryMap[product.category]) {
        categoryMap[product.category] = 0;
      }
    });
    
    // Calculate sales by category
    orders.forEach(order => {
      if (!order.orderItems) return;
      
      order.orderItems.forEach(item => {
        const productId = item.product?._id || item.product;
        const category = productMap[productId];
        
        if (category && categoryMap.hasOwnProperty(category)) {
          categoryMap[category] += (item.price * item.qty) || 0;
        }
      });
    });
    
    // Format data for chart
    return Object.entries(categoryMap).map(([category, sales]) => ({
      category,
      sales
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Chart configuration for sales
  const salesChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: salesData.sales,
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Chart configuration for orders
  const ordersChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Orders',
        data: salesData.orders,
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderRadius: 6,
        barThickness: 12,
        maxBarThickness: 25
      }
    ]
  };

  // Chart configuration for order status
  const orderStatusData = {
    labels: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.orderStatusCounts.processing || 0,
          stats.orderStatusCounts.shipped || 0,
          stats.orderStatusCounts.delivered || 0,
          stats.orderStatusCounts.cancelled || 0
        ],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'system-ui'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'system-ui'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        borderWidth: 1,
        padding: 12
      }
    },
    cutout: '70%'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <button 
              onClick={() => fetchDashboardData()}
              className="mr-4 px-3 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <div className="flex items-center mr-4">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
                className="mr-2 h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="autoRefresh" className="text-xs text-gray-400">Auto refresh</label>
            </div>
            <select 
              value={refreshInterval} 
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="text-xs bg-neutral-800 border border-neutral-700 text-gray-400 rounded-md px-2 py-1"
              disabled={!autoRefresh}
            >
              <option value={30000}>30 seconds</option>
              <option value={60000}>1 minute</option>
              <option value={300000}>5 minutes</option>
            </select>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-900/30 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalOrders}</h3>
              <p className="text-xs text-amber-400">+{stats.ordersToday} today</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-900/30 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-900/30 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Products</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalProducts}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-900/30 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
              <p className="text-xs text-blue-400">+{stats.newUsersToday} today</p>
            </div>
          </div>
        </div>
        
        {/* Subscribers Stats Box */}
        <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-cyan-900/30 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Subscribers</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalSubscribers}</h3>
              <Link to="/admin/subscribers" className="text-xs text-cyan-400 hover:underline">Manage</Link>
            </div>
          </div>
        </div>
        
        {/* Reviews Stats Box */}
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-900/30 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Reviews</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalReviews}</h3>
              <Link to="/admin/reviews" className="text-xs text-yellow-400 hover:underline">Manage</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue and Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-xs rounded-md ${salesPeriod === 'week' ? 'bg-amber-700 text-white' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}
                onClick={() => setSalesPeriod('week')}
              >
                Week
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${salesPeriod === 'month' ? 'bg-amber-700 text-white' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}
                onClick={() => setSalesPeriod('month')}
              >
                Month
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-md ${salesPeriod === 'year' ? 'bg-amber-700 text-white' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}
                onClick={() => setSalesPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-80">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Order Status Chart */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h2 className="text-xl font-bold text-white mb-4">Order Status</h2>
          <div className="h-72">
            <Doughnut data={orderStatusData} options={doughnutOptions} />
          </div>
        </div>
      </div>
      
      {/* Orders Chart */}
      <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <h2 className="text-xl font-bold text-white mb-4">Order Trends</h2>
        <div className="h-64">
          <Bar data={ordersChartData} options={chartOptions} />
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg mb-8">
        <div className="border-b border-neutral-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-amber-500 hover:text-amber-400 text-sm">
            View All
          </Link>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-neutral-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        #{order._id.substring(order._id.length - 6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.user?.name || order.shippingAddress?.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'Delivered' 
                            ? 'bg-green-900/30 text-green-400' 
                            : order.status === 'Shipped' 
                              ? 'bg-blue-900/30 text-blue-400' 
                              : order.status === 'Cancelled'
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-amber-900/30 text-amber-400'
                          }`}
                        >
                          {order.status || (order.isPaid ? "Paid" : "Processing")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link 
                          to={`/admin/orders/${order._id}`} 
                          className="text-amber-500 hover:text-amber-400"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Top Products */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg">
        <div className="border-b border-neutral-800 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Top Products</h2>
          <Link to="/admin/products" className="text-amber-500 hover:text-amber-400 text-sm">
            View All
          </Link>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-neutral-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white flex items-center">
                        {product.images && product.images[0] && (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-8 h-8 mr-3 object-cover rounded"
                          />
                        )}
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {product.sold || 0} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.countInStock > 10 
                            ? 'bg-green-900/30 text-green-400' 
                            : product.countInStock > 0 
                              ? 'bg-amber-900/30 text-amber-400' 
                              : 'bg-red-900/30 text-red-400'
                        }`}>
                          {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link 
                          to={`/admin/products/edit/${product._id}`} 
                          className="text-amber-500 hover:text-amber-400 mr-3"
                        >
                          Edit
                        </Link>
                        <Link 
                          to={`/product/${product._id}`}
                          className="text-gray-400 hover:text-white"
                          target="_blank"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      No top products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;