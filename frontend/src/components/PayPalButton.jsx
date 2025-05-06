import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, onSuccess }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  useEffect(() => {
    setScriptLoaded(true);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: 'USD'
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      // Call the onSuccess function with payment details
      onSuccess({
        id: details.id,
        status: details.status,
        update_time: details.update_time,
        email_address: details.payer.email_address,
        payer: {
          email_address: details.payer.email_address,
          payer_id: details.payer.payer_id,
          name: {
            given_name: details.payer.name.given_name,
            surname: details.payer.name.surname
          }
        }
      });
    });
  };

  return (
    <div className="paypal-button-container">
      {scriptLoaded && (
        <PayPalScriptProvider 
          options={{ 
            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
            currency: "USD"
          }}
        >
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'pay'
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PayPalButton;
