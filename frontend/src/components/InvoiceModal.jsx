import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const InvoiceModal = ({ order, onClose }) => {
  const componentRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return Number(price || 0).toFixed(2);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${order._id}`,
    onAfterPrint: onClose,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div className="bg-white max-w-4xl w-full mx-auto text-black p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-2xl font-bold">Invoice</h2>
          <div className="space-x-2">
            <button 
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Print
            </button>
            <button 
              onClick={onClose}
              className="bg-neutral-700 text-white px-4 py-2 rounded hover:bg-neutral-800"
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Printable Invoice Content */}
        <div className="p-6 bg-white" ref={componentRef}>
          <style type="text/css" media="print">
            {`
              @page {
                size: auto;
                margin: 10mm;
              }
              
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                .print\\:hidden {
                  display: none !important;
                }
              }
            `}
          </style>
          <div className="invoice-box" style={{maxWidth: '800px', margin: 'auto', padding: '30px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)', fontSize: '14px', lineHeight: '24px', fontFamily: '\'Helvetica Neue\', \'Helvetica\', Helvetica, Arial, sans-serif', color: '#555'}}>
            <table style={{width: '100%', lineHeight: 'inherit', textAlign: 'left', borderCollapse: 'collapse'}}>
              <tbody>
                <tr className="top">
                  <td colSpan="5" style={{padding: '5px', verticalAlign: 'top'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <tbody>
                        <tr>
                          <td style={{padding: '5px', verticalAlign: 'top', textAlign: 'left', width: '50%'}}>
                            <h1 style={{margin: '0', color: '#333', fontSize: '24px', fontWeight: 'bold'}}>INVOICE</h1>
                            <div style={{marginTop: '10px'}}>
                              <div><strong>Order ID:</strong> #{order._id}</div>
                              <div><strong>Date:</strong> {formatDate(order.createdAt)}</div>
                              <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                              <div><strong>Status:</strong> {order.status || "Processing"}</div>
                            </div>
                          </td>
                          <td style={{padding: '5px', verticalAlign: 'top', textAlign: 'right', width: '50%'}}>
                            <div className="logo" style={{fontSize: '28px', fontWeight: 'bold', color: '#333'}}>
                              COMPANY NAME
                            </div>
                            <div>123 Main Street</div>
                            <div>City, State ZIP</div>
                            <div>Phone: (123) 456-7890</div>
                            <div>Email: support@example.com</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                
                <tr className="information">
                  <td colSpan="5" style={{padding: '5px', verticalAlign: 'top'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px'}}>
                      <tbody>
                        <tr>
                          <td style={{padding: '5px', verticalAlign: 'top', width: '50%'}}>
                            <div style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
                              <strong>BILLING INFORMATION</strong>
                            </div>
                            <div>{order.user?.name || "Customer"}</div>
                            <div>{order.user?.email || ""}</div>
                          </td>
                          <td style={{padding: '5px', verticalAlign: 'top', width: '50%'}}>
                            <div style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px'}}>
                              <strong>SHIPPING INFORMATION</strong>
                            </div>
                            <div>{order.shippingAddress?.address}</div>
                            <div>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state || ''} {order.shippingAddress?.postalCode || order.shippingAddress?.zip}
                            </div>
                            <div>{order.shippingAddress?.country}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td colSpan="5">
                    <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px'}}>
                      <thead>
                        <tr style={{background: '#eee', fontWeight: 'bold'}}>
                          <th style={{padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd'}}>Item</th>
                          <th style={{padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd'}}>Size</th>
                          <th style={{padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd'}}>Qty</th>
                          <th style={{padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd'}}>Price</th>
                          <th style={{padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd'}}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map((item, index) => (
                          <tr key={index}>
                            <td style={{padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee'}}>{item.name}</td>
                            <td style={{padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee'}}>{item.size}</td>
                            <td style={{padding: '10px', textAlign: 'center', borderBottom: '1px solid #eee'}}>{item.quantity}</td>
                            <td style={{padding: '10px', textAlign: 'right', borderBottom: '1px solid #eee'}}>${formatPrice(item.price)}</td>
                            <td style={{padding: '10px', textAlign: 'right', borderBottom: '1px solid #eee'}}>${formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td colSpan="5">
                    <table style={{width: '100%', marginTop: '20px', borderCollapse: 'collapse'}}>
                      <tbody>
                        <tr>
                          <td style={{width: '60%'}}></td>
                          <td style={{width: '20%', padding: '5px', textAlign: 'right'}}><strong>Subtotal:</strong></td>
                          <td style={{width: '20%', padding: '5px', textAlign: 'right'}}>${formatPrice(order.itemsPrice)}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td style={{padding: '5px', textAlign: 'right'}}><strong>Shipping:</strong></td>
                          <td style={{padding: '5px', textAlign: 'right'}}>${formatPrice(order.shippingPrice)}</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td style={{padding: '5px', textAlign: 'right'}}><strong>Tax:</strong></td>
                          <td style={{padding: '5px', textAlign: 'right'}}>${formatPrice(order.taxPrice)}</td>
                        </tr>
                        <tr style={{fontWeight: 'bold'}}>
                          <td></td>
                          <td style={{padding: '5px', textAlign: 'right', borderTop: '2px solid #eee'}}><strong>Total:</strong></td>
                          <td style={{padding: '5px', textAlign: 'right', borderTop: '2px solid #eee'}}>${formatPrice(order.totalPrice)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td colSpan="5" style={{padding: '20px 5px 5px 5px'}}>
                    <div style={{borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px', textAlign: 'center', color: '#777', fontSize: '12px'}}>
                      <p>Thank you for your business! If you have any questions, please contact customer support.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;