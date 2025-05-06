import { useState, useEffect } from 'react';
import { getSubscribers } from '../../api/admin';
import { FiMail, FiTrash2, FiDownload, FiRefreshCw } from 'react-icons/fi';

const AdminSubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await getSubscribers();
      setSubscribers(data.subscribers || data); // Handle different response formats
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch subscribers');
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Handle select all
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedSubscribers(subscribers.map(sub => sub._id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  // Handle single selection
  const handleSelectSubscriber = (id) => {
    if (selectedSubscribers.includes(id)) {
      setSelectedSubscribers(selectedSubscribers.filter(subId => subId !== id));
    } else {
      setSelectedSubscribers([...selectedSubscribers, id]);
    }
  };

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Export subscribers to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Subscribed Date', 'Status'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        new Date(sub.createdAt).toISOString().split('T')[0],
        sub.active ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete subscriber functionality would connect to backend endpoint
  const deleteSubscriber = async (id) => {
    // This would need a backend endpoint implementation
    // For now, just update the UI
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        // Simulating backend call
        // await apiClient.delete(`/subscribers/${id}`);
        
        // Update UI
        setSubscribers(subscribers.filter(sub => sub._id !== id));
        setSelectedSubscribers(selectedSubscribers.filter(subId => subId !== id));
      } catch (err) {
        setError('Failed to delete subscriber');
        console.error('Error deleting subscriber:', err);
      }
    }
  };

  return (
    <div className="bg-neutral-900 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Subscribers</h1>
          <p className="text-neutral-400">Manage your newsletter subscribers</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
          >
            <FiDownload /> Export CSV
          </button>
          <button 
            onClick={fetchSubscribers}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Search & filters */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search subscribers by email..."
            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiMail className="text-neutral-500" />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Subscribers table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-800 text-neutral-400 text-left">
              <th className="p-3 rounded-tl-lg">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded bg-neutral-700 border-transparent focus:ring-cyan-500 focus:ring-2 text-cyan-500"
                />
              </th>
              <th className="p-3">Email</th>
              <th className="p-3">Subscribed Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 rounded-tr-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-neutral-400">
                  Loading subscribers...
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-neutral-400">
                  {searchTerm ? 'No subscribers match your search' : 'No subscribers found'}
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="p-3">
                    <input 
                      type="checkbox" 
                      checked={selectedSubscribers.includes(subscriber._id)}
                      onChange={() => handleSelectSubscriber(subscriber._id)}
                      className="rounded bg-neutral-700 border-transparent focus:ring-cyan-500 focus:ring-2 text-cyan-500"
                    />
                  </td>
                  <td className="p-3 text-white">{subscriber.email}</td>
                  <td className="p-3 text-neutral-400">{formatDate(subscriber.createdAt)}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscriber.active ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'
                    }`}>
                      {subscriber.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => deleteSubscriber(subscriber._id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      title="Delete subscriber"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscribersPage;