import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WebApp } from '@twa-dev/sdk';
import axios from 'axios';
import useTelegramAuth from '../hooks/useTelegramAuth';

interface Offer {
  id: number;
  title: string;
  description: string;
  reward_amount: number;
  referral_reward: number;
  offer_link: string;
}

export default function OfferPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const { user } = useTelegramAuth();
  
  useEffect(() => {
    // Fetch offer details
    const fetchOffer = async () => {
      try {
        const response = await axios.get(`/api/offers/${id}`);
        setOffer(response.data);
      } catch (err) {
        setError('Failed to load offer');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOffer();
  }, [id]);
  
  const joinOffer = async () => {
    if (!user || !offer) return;
    
    try {
      // Join the offer
      await axios.post(`/api/offers/${offer.id}/join`, {
        userId: user.id
      });
      
      setJoined(true);
      WebApp.showAlert('You have joined this offer!');
      
      // Show button to complete offer
      WebApp.MainButton.setText('Complete Offer');
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(() => {
        window.open(offer.offer_link, '_blank');
      });
    } catch (err) {
      WebApp.showAlert('Failed to join offer');
    }
  };
  
  const generateReferralLink = () => {
    if (!user || !offer) return;
    
    const referralLink = `https://t.me/your_bot/app?startapp=ref_${offer.id}_${user.id}`;
    WebApp.showAlert(`Share this link: ${referralLink}`);
    
    // Enable Telegram sharing
    WebApp.share(referralLink);
  };

  if (loading) return <div>Loading offer...</div>;
  if (error) return <div>{error}</div>;
  if (!offer) return <div>Offer not found</div>;

  return (
    <div className="offer-page">
      <h1>{offer.title}</h1>
      <p>{offer.description}</p>
      
      <div className="reward-info">
        <p>Reward: ₹{offer.reward_amount}</p>
        <p>Referral Bonus: ₹{offer.referral_reward}</p>
      </div>
      
      {joined ? (
        <div>
          <p>You've joined this offer!</p>
          <button onClick={generateReferralLink} className="tg-button">
            Generate Referral Link
          </button>
        </div>
      ) : (
        <button onClick={joinOffer} className="tg-button">
          Join Offer
        </button>
      )}
    </div>
  );
}
