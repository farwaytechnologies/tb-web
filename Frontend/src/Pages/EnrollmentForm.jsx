import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FileText, CheckCircle, ChevronRight } from 'lucide-react';
import '../Styles/PagesStyle/EnrollmentForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function EnrollmentForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: '', message: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { navigate('/login'); return; }
    setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
    fetch(`${API_URL}/api/courses`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        setCourses(data);
        const preId = searchParams.get('courseId');
        if (preId) {
          const found = data.find(c => c._id === preId);
          if (found) { setForm(f => ({ ...f, course: preId })); setSelectedCourse(found); }
        }
      })
      .catch(() => {});
  }, [navigate, searchParams]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'course') setSelectedCourse(courses.find(c => c._id === value) || null);
  };

  const isFree = !selectedCourse || Number(selectedCourse.price) === 0;

  const enrollFree = async (user) => {
    const res = await fetch(`${API_URL}/api/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id || user.id,
        courseId: form.course,
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Enrollment failed');
    setInvoice(null);
    setDone(true);
  };

  const startRazorpay = async (user) => {
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error('Failed to load payment gateway. Check your connection.');

    const orderRes = await fetch(`${API_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: form.course })
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(orderData.error || 'Could not create order.');

    setSubmitting(false); // allow UI to update before popup

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY || orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TechBorg',
        description: orderData.courseTitle,
        order_id: orderData.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#8b5cf6' },
        modal: { ondismiss: () => reject(new Error('Payment cancelled.')) },
        handler: (response) => resolve(response)
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => reject(new Error(`Payment failed: ${r.error.description}`)));
      rzp.open();
    }).then(async (response) => {
      setSubmitting(true);
      const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          userId: user._id || user.id,
          courseId: form.course,
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed.');
      setInvoice(verifyData.invoice);
      setDone(true);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      if (isFree) { await enrollFree(user); } else { await startRazorpay(user); }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="enroll-container">
        <div className="enroll-done">
          <CheckCircle size={52} color="#10b981" />
          <h2 className="enroll-done-title">{invoice ? 'Payment Successful!' : 'Enrollment Submitted!'}</h2>
          <p className="enroll-done-sub">
            {invoice
              ? 'Your payment is confirmed. You are now enrolled.'
              : 'Your enrollment request has been submitted and will be reviewed shortly.'}
          </p>
          {invoice && (
            <div className="enroll-invoice-card">
              <div className="enroll-invoice-icon"><FileText size={22} /></div>
              <div className="enroll-invoice-info">
                <p className="enroll-invoice-num">{invoice.invoiceNumber}</p>
                <p className="enroll-invoice-course">{invoice.courseTitle}</p>
                <p className="enroll-invoice-amount">
                  &#8377;{Number(invoice.amount).toLocaleString('en-IN')}
                  <span className="enroll-inv-badge enroll-inv-badge--paid">Paid</span>
                </p>
                {invoice.paymentRef && <p className="enroll-invoice-ref">Ref: {invoice.paymentRef}</p>}
              </div>
              <Link to="/invoices" className="enroll-invoice-link">View Invoice</Link>
            </div>
          )}
          <div className="enroll-done-actions">
            <Link to="/courses" className="enroll-submit-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
              Browse More Courses
            </Link>
            {invoice && <Link to="/invoices" className="enroll-outline-btn">My Invoices</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enroll-container">
      <h2 className="enroll-title">Course Enrollment</h2>
      {error && <div className="enroll-msg enroll-msg--err">{error}</div>}

      <form className="enroll-form" onSubmit={handleSubmit}>
        <div className="enroll-form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" className="enroll-input"
            value={form.name} onChange={handleChange} required />
        </div>
        <div className="enroll-form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" className="enroll-input"
            value={form.email} onChange={handleChange} required />
        </div>
        <div className="enroll-form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" className="enroll-input"
            value={form.phone} onChange={handleChange} required />
        </div>
        <div className="enroll-form-group">
          <label htmlFor="course">Select Course</label>
          <select id="course" name="course" className="enroll-select"
            value={form.course} onChange={handleChange} required>
            <option value="">-- Select a Course --</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>
                {c.title}{Number(c.price) > 0
                  ? ` \u2014 \u20B9${Number(c.price).toLocaleString('en-IN')}`
                  : ' \u2014 Free'}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div className={`enroll-price-tag ${isFree ? 'enroll-price-tag--free' : 'enroll-price-tag--paid'}`}>
            {isFree
              ? '\u2713 Free course \u2014 no payment required'
              : `\u20B9${Number(selectedCourse.price).toLocaleString('en-IN')} \u2014 Razorpay secure checkout`}
          </div>
        )}

        <div className="enroll-form-group">
          <label htmlFor="message">Message (optional)</label>
          <textarea id="message" name="message" className="enroll-textarea"
            value={form.message
} onChange={handleChange} rows={3} />
        </div>

        <button type="submit" className="enroll-submit-btn" disabled={submitting}>
          {submitting
            ? (isFree ? 'Enrolling...' : 'Opening payment...')
            : isFree
              ? 'Enroll Now'
              : <><ChevronRight size={15} /> Pay with Razorpay</>}
        </button>

        {!isFree && (
          <p className="enroll-razorpay-note">
            <span>&#128274;</span> Secured by Razorpay. Supports UPI, Cards, Net Banking &amp; Wallets.
          </p>
        )}
      </form>
    </div>
  );
}
