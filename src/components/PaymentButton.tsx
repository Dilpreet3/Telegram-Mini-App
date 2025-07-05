import { useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';

interface PaymentButtonProps {
  amount: number;
  description: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentButton({ 
  amount, 
  description, 
  onSuccess, 
  onError 
}: PaymentButtonProps) {
  useEffect(() => {
    // Setup payment callback
    WebApp.onEvent('invoiceClosed', (event) => {
      if (event.status === 'paid') {
        onSuccess();
      } else {
        onError('Payment failed or was cancelled');
      }
    });
    
    return () => {
      WebApp.offEvent('invoiceClosed');
    };
  }, [onSuccess, onError]);
  
  const initiatePayment = () => {
    const invoice = {
      title: description,
      description: `Payment for ${description}`,
      currency: 'INR',
      prices: [
        { label: 'Total', amount: amount * 100 } // Amount in paise
      ]
    };
    
    WebApp.openInvoice(invoice);
  };
  
  return (
    <button onClick={initiatePayment} className="tg-button">
      Pay ₹{amount}
    </button>
  );
}
