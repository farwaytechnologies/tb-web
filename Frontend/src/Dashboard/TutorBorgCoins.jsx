import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coins, ArrowDownCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import '../Styles/DashbordStyle/TutorBorgCoins.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TutorBorgCoins() {
  const [wallet, setWallet] = useState({ borgCoins: 0, totalEarned: 0, totalWithdrawn: 0 });
  const [settings, setSettings] = useState({ pointsPerCoin: 10, usdPerCoin: 0.5, minWithdrawal: 10 });
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ borgCoins: '', paymentMethod: 'paypal', paymentDetails: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [tutorId, setTutorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem('user')); } catch (_) {}
    if (!stored || stored.role !== 'tutor') { navigate('/login'); return; }

    setTutorId(stored._id);

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/borgcoins/wallet/${stored._id}`);
        if (res.ok) {
          const data = await res.json();
          setWallet(data.wallet || { borgCoins: 0, totalEarned: 0, totalWithdrawn: 0 });
          setSettings(data.settings || { pointsPerCoin: 10, usdPerCoin: 0.5, minWithdrawal: 10 });
          setWithdrawals(Array.isArray(data.withdrawals) ? data.withdrawals : []);
          setTotalPoints(data.totalPoints || 0);
        }
      } catch (err) {
        console.error('BorgCoins load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const reload = async () => {
    if (!tutorId) return;
    try {
      const res = await fetch(`${API_URL}/api/borgcoins/wallet/${tutorId}`);
      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet || { borgCoins: 0, totalEarned: 0, totalWithdrawn: 0 });
        setSettings(data.settings || { pointsPerCoin: 10, usdPerCoin: 0.5, minWithdrawal: 10 });
        setWithdrawals(Array.isArray(data.withdrawals) ? data.withdrawals : []);
        setTotalPoints(data.totalPoints || 0);
      }
    } catch (err) { console.error(err); }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setFormError('');
    const coins = parseInt(form.borgCoins);
    if (!coins || coins < settings.minWithdrawal) {
      setFormError(`Minimum withdrawal is ${settings.minWithdrawal} BorgCoins.`);
      return;
    }
    if (coins > wallet.borgCoins) {
      setFormError('Insufficient balance.');
      return;
    }
    if (!form.paymentDetails.trim()) {
      setFormError('Payment details are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/borgcoins/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorId, borgCoins: coins, paymentMethod: form.paymentMethod, paymentDetails: form.paymentDetails })
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || 'Request failed.'); return; }
      setSuccessMsg(`Withdrawal of ${coins} BorgCoins ($${(coins * settings.usdPerCoin).toFixed(2)}) submitted!`);
      setShowForm(false);
      setForm({ borgCoins: '', paymentMethod: 'paypal', paymentDetails: '' });
      reload();
    } catch (err) {
      setFormError('Request failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusIcon = (status) => {
    if (status === 'approved') return <CheckCircle size={14} className="bc-status-icon approved" />;
    if (status === 'rejected') return <XCircle size={14} className="bc-status-icon rejected" />;
    return <Clock size={14} className="bc-status-icon pending" />;
  };

  const availableUSD = (wallet.borgCoins * settings.usdPerCoin).toFixed(2);
  const totalEarnedUSD = (wallet.totalEarned * settings.usdPerCoin).toFixed(2);

  if (loading) {
    return (
      <div className="bc-page">
        <div className="bc-loading">
          <Coins size={36} className="bc-spin" />
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bc-page">
      <div className="bc-header">
        <Coins size={30} className="bc-header-icon" />
        <div>
          <h1 className="bc-title">BorgCoins Wallet</h1>
          <p className="bc-subtitle">Convert your reward points into real money</p>
        </div>
      </div>

      {successMsg && (
        <div className="bc-success-banner">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}>✕</button>
        </div>
      )}

      <div className="bc-rate-bar">
        <span>⚡ {settings.pointsPerCoin} pts = 1 BorgCoin</span>
        <span>💵 1 BorgCoin = ${settings.usdPerCoin}</span>
        <span>📉 Min withdrawal: {settings.minWithdrawal} BorgCoins</span>
      </div>

      <div className="bc-cards">
        <div className="bc-card bc-card-main">
          <Coins size={28} className="bc-card-icon" />
          <span className="bc-card-val">{wallet.borgCoins}</span>
          <span className="bc-card-lbl">Available BorgCoins</span>
          <span className="bc-card-usd">${availableUSD} USD</span>
          <button className="bc-withdraw-btn" onClick={() => setShowForm(v => !v)}>
            <ArrowDownCircle size={16} /> Withdraw
          </button>
        </div>
        <div className="bc-card">
          <span className="bc-card-val">{totalPoints}</span>
          <span className="bc-card-lbl">Total Reward Points</span>
        </div>
        <div className="bc-card">
          <span className="bc-card-val">{wallet.totalEarned}</span>
          <span className="bc-card-lbl">Total BorgCoins Earned</span>
          <span className="bc-card-usd">${totalEarnedUSD} USD</span>
        </div>
        <div className="bc-card">
          <span className="bc-card-val">{wallet.totalWithdrawn}</span>
          <span className="bc-card-lbl">Total Withdrawn</span>
        </div>
      </div>

      {showForm && (
        <div className="bc-form-wrap">
          <h2 className="bc-form-title">Request Withdrawal</h2>
          <form onSubmit={handleWithdraw} className="bc-form">
            <div className="bc-form-row">
              <label>BorgCoins to Withdraw</label>
              <input
                type="number"
                min={settings.minWithdrawal}
                max={wallet.borgCoins}
                placeholder={`Min ${settings.minWithdrawal}`}
                value={form.borgCoins}
                onChange={e => setForm(f => ({ ...f, borgCoins: e.target.value }))}
              />
              {form.borgCoins > 0 && (
                <span className="bc-form-preview">
                  ≈ ${(parseInt(form.borgCoins || 0) * settings.usdPerCoin).toFixed(2)} USD
                </span>
              )}
            </div>
            <div className="bc-form-row">
              <label>Payment Method</label>
              <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>
            <div className="bc-form-row">
              <label>
                {form.paymentMethod === 'paypal' ? 'PayPal Email' :
                  form.paymentMethod === 'bank' ? 'Bank Account / IBAN' : 'Mobile Number'}
              </label>
              <input
                type="text"
                placeholder="Enter your payment details"
                value={form.paymentDetails}
                onChange={e => setForm(f => ({ ...f, paymentDetails: e.target.value }))}
              />
            </div>
            {formError && (
              <p className="bc-form-error">
                <AlertCircle size={14} /> {formError}
              </p>
            )}
            <div className="bc-form-btns">
              <button type="submit" className="bc-submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button type="button" className="bc-cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bc-history">
        <h2 className="bc-history-title">Withdrawal History</h2>
        {withdrawals.length === 0 ? (
          <p className="bc-empty">No withdrawal requests yet.</p>
        ) : (
          <div className="bc-history-list">
            {withdrawals.map(w => (
              <div key={w._id} className={`bc-history-row bc-status-${w.status}`}>
                <div className="bc-history-left">
                  {statusIcon(w.status)}
                  <div>
                    <span className="bc-history-coins">{w.borgCoins} BorgCoins</span>
                    <span className="bc-history-usd">${w.amountUSD} via {w.paymentMethod}</span>
                    <span className="bc-history-detail">{w.paymentDetails}</span>
                  </div>
                </div>
                <div className="bc-history-right">
                  <span className={`bc-status-badge ${w.status}`}>{w.status}</span>
                  <span className="bc-history-date">{new Date(w.requestedAt).toLocaleDateString()}</span>
                  {w.adminNote && <span className="bc-admin-note">"{w.adminNote}"</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bc-back">
        <Link to="/tutor/rewards" className="bc-back-link">← Back to Rewards</Link>
      </div>
    </div>
  );
}
