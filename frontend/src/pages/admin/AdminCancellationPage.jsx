import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCancellationRequests, processCancellationRequest } from "../../api/admin";

const AdminCancellationPage = () => {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [processing, setProcessing] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchCancellationRequests();
  }, [statusFilter]);

  const fetchCancellationRequests = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const data = await getCancellationRequests(params);
      setCancellations(data);
    } catch (err) {
      console.error("Error fetching cancellation requests:", err);
      setError("Failed to load cancellation requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProcessDialog = (request) => {
    setCurrentRequest(request);
    setAdminNote("");
  };

  const handleCloseProcessDialog = () => {
    setCurrentRequest(null);
    setAdminNote("");
  };

  const handleProcessRequest = async (status) => {
    if (processing || !currentRequest) return;

    try {
      setProcessing(true);
      await processCancellationRequest(currentRequest.order._id, {
        status,
        note: adminNote.trim() || `Cancellation request ${status.toLowerCase()} by admin`,
      });

      // Update the list after processing
      await fetchCancellationRequests();
      setSuccessMessage(`Cancellation request ${status.toLowerCase()} successfully`);
      
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Close the dialog
      handleCloseProcessDialog();
    } catch (err) {
      console.error(`Error ${status.toLowerCase()} cancellation request:`, err);
      setError(`Failed to ${status.toLowerCase()} cancellation request. Please try again.`);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Cancellations</span>
          </h1>
          <div className="h-0.5 w-24 bg-amber-500 mt-2"></div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
          >
            <option value="">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-lg mb-6">
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchCancellationRequests();
            }}
            className="text-amber-500 hover:text-amber-400 mt-2 text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner h-12 w-12 border-4 border-t-4 border-neutral-800 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      ) : cancellations.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-500/70 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No Cancellation Requests Found</h3>
          <p className="text-gray-400 mb-6">
            {statusFilter
              ? `There are currently no ${statusFilter.toLowerCase()} cancellation requests.`
              : "There are currently no cancellation requests."}
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Order Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {cancellations.map((request) => (
                  <tr key={request._id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link to={`/admin/orders/${request.order._id}`} className="text-amber-500 hover:text-amber-400">
                        #{request.order._id.substring(request.order._id.length - 6)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {request.user?.name || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                      ${request.order.totalPrice ? request.order.totalPrice.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'Approved' ? 'bg-green-900/30 text-green-400 border border-green-700/50' :
                        request.status === 'Rejected' ? 'bg-red-900/30 text-red-400 border border-red-700/50' :
                        'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-300">
                      <div className="max-w-xs truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'Pending' ? (
                        <button
                          onClick={() => handleOpenProcessDialog(request)}
                          className="text-amber-500 hover:text-amber-400"
                        >
                          Process
                        </button>
                      ) : (
                        <Link to={`/admin/orders/${request.order._id}`} className="text-amber-500 hover:text-amber-400">
                          View Order
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Process Cancellation Dialog */}
      {currentRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Process Cancellation Request</h2>
            
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-400">Order ID:</p>
              <p className="text-white">{currentRequest.order._id}</p>
            </div>
            
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-400">Customer:</p>
              <p className="text-white">{currentRequest.user?.name || 'Unknown User'}</p>
            </div>
            
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-400">Reason for Cancellation:</p>
              <p className="text-white">{currentRequest.reason}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Admin Note (optional):</label>
              <textarea
                className="w-full p-2 bg-neutral-800 text-white rounded-lg border border-neutral-700 focus:outline-none focus:border-amber-500"
                rows="3"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note about this cancellation decision"
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseProcessDialog}
                className="py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcessRequest('Rejected')}
                className="py-2 px-4 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => handleProcessRequest('Approved')}
                className="py-2 px-4 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCancellationPage;