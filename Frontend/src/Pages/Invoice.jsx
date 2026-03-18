import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, X } from 'lucide-react';
import '../Styles/PagesStyle/Invoice.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { navigate('/login'); return; }
    const uid = user._id || user.id;
    fetch(`${API_URL}/api/invoices/user/${uid}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setInvoices(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handlePrint = (inv) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const win = window.open('', '_blank');
    win.document.write(buildInvoiceHTML(inv, user));
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div className="inv-page">
      <div className="inv-header">
        <FileText size={26} className="inv-header-icon" />
        <div>
          <h1 className="inv-title">My Invoices</h1>
          <p className="inv-sub">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {loading ? (
        <div className="inv-empty">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="inv-empty">
          <FileText size={40} style={{ opacity: 0.3 }} />
          <p>No invoices yet. Enroll in a course to get started.</p>
        </div>
      ) : (
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id}>
                  <td className="inv-number">{inv.invoiceNumber}</td>
                  <td>{inv.courseTitle}</td>
                  <td className="inv-amount">
                    {inv.amount === 0 ? 'Free' : `₹${Number(inv.amount).toLocaleString('en-IN')}`}
                  </td>
                  <td>
                    <span className={`inv-badge inv-badge--${inv.status.toLowerCase()}`}>{inv.status}</span>
                  </td>
                  <td>{new Date(inv.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div className="inv-actions">
                      <button className="inv-btn inv-btn--view" onClick={() => setSelected(inv)}>
                        <Eye size={14} /> View
                      </button>
                      <button className="inv-btn inv-btn--print" onClick={() => handlePrint(inv)}>
                        <Download size={14} /> Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {selected && (
        <div className="inv-modal-overlay" onClick={() => setSelected(null)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <div className="inv-modal-header">
              <h2>Invoice Preview</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="inv-btn inv-btn--print" onClick={() => handlePrint(selected)}>
                  <Download size={14} /> Print / Save PDF
                </button>
                <button className="inv-modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
              </div>
            </div>
            <div className="inv-preview">
              <InvoicePreview inv={selected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoicePreview({ inv }) {
  const issued = new Date(inv.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  return (
    <div className="inv-doc">
      <div className="inv-doc-head">
        <div>
          <h2 className="inv-doc-brand">TechBorg</h2>
          <p className="inv-doc-brand-sub">Learning Management System</p>
        </div>
        <div className="inv-doc-meta">
          <p className="inv-doc-label">INVOICE</p>
          <p className="inv-doc-num">{inv.invoiceNumber}</p>
          <p className="inv-doc-date">Issued: {issued}</p>
        </div>
      </div>

      <div className="inv-doc-parties">
        <div className="inv-doc-party">
          <p className="inv-doc-party-label">Billed To</p>
          <p className="inv-doc-party-name">{inv.studentName}</p>
          <p>{inv.studentEmail}</p>
          {inv.studentPhone && <p>{inv.studentPhone}</p>}
        </div>
        <div className="inv-doc-party">
          <p className="inv-doc-party-label">From</p>
          <p className="inv-doc-party-name">TechBorg Education</p>
          <p>support@techborg.in</p>
        </div>
      </div>

      <table className="inv-doc-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Instructor</th>
            <th>Level</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{inv.courseTitle}</td>
            <td>{inv.courseInstructor || '—'}</td>
            <td>{inv.courseLevel || '—'}</td>
            <td>{inv.amount === 0 ? 'Free' : `₹${Number(inv.amount).toLocaleString('en-IN')}`}</td>
          </tr>
        </tbody>
      </table>

      <div className="inv-doc-total">
        <div className="inv-doc-total-row">
          <span>Subtotal</span>
          <span>{inv.amount === 0 ? 'Free' : `₹${Number(inv.amount).toLocaleString('en-IN')}`}</span>
        </div>
        <div className="inv-doc-total-row inv-doc-total-final">
          <span>Total</span>
          <span>{inv.amount === 0 ? 'Free' : `₹${Number(inv.amount).toLocaleString('en-IN')}`}</span>
        </div>
        <div className="inv-doc-status">
          <span className={`inv-badge inv-badge--${inv.status.toLowerCase()}`}>{inv.status}</span>
        </div>
      </div>

      <p className="inv-doc-footer">Thank you for enrolling with TechBorg. For support, contact support@techborg.in</p>
    </div>
  );
}

function buildInvoiceHTML(inv, user) {
  const issued = new Date(inv.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const amount = inv.amount === 0 ? 'Free' : `&#8377;${Number(inv.amount).toLocaleString('en-IN')}`;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${inv.invoiceNumber}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; color: #1f2937; margin: 0; padding: 40px; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; }
    .brand { font-size: 28px; font-weight: 800; color: #8b5cf6; margin: 0; }
    .brand-sub { font-size: 12px; color: #6b7280; margin: 4px 0 0; }
    .meta { text-align: right; }
    .meta .label { font-size: 22px; font-weight: 700; color: #8b5cf6; margin: 0; }
    .meta .num { font-size: 14px; font-weight: 600; margin: 4px 0; }
    .meta .date { font-size: 12px; color: #6b7280; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 28px; }
    .party-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; margin: 0 0 6px; }
    .party-name { font-size: 15px; font-weight: 700; margin: 0 0 4px; }
    .party p { font-size: 13px; color: #6b7280; margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #f5f3ff; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; }
    td { padding: 12px 14px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .total-section { margin-left: auto; width: 260px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #6b7280; }
    .total-final { font-size: 16px; font-weight: 700; color: #1f2937; border-top: 2px solid #e5e7eb; padding-top: 10px; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 10px; }
    .badge-paid { background: #d1fae5; color: #065f46; }
    .badge-free { background: #dbeafe; color: #1e40af; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
    @media print { body { padding: 20px; } }
  </style></head><body>
  <div class="head">
    <div><p class="brand">TechBorg</p><p class="brand-sub">Learning Management System</p></div>
    <div class="meta"><p class="label">INVOICE</p><p class="num">${inv.invoiceNumber}</p><p class="date">Issued: ${issued}</p></div>
  </div>
  <div class="parties">
    <div class="party"><p class="party-label">Billed To</p><p class="party-name">${inv.studentName}</p><p>${inv.studentEmail}</p>${inv.studentPhone ? `<p>${inv.studentPhone}</p>` : ''}</div>
    <div class="party"><p class="party-label">From</p><p class="party-name">TechBorg Education</p><p>support@techborg.in</p></div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Course</th><th>Instructor</th><th>Level</th><th>Amount</th></tr></thead>
    <tbody><tr><td>1</td><td>${inv.courseTitle}</td><td>${inv.courseInstructor || '—'}</td><td>${inv.courseLevel || '—'}</td><td>${amount}</td></tr></tbody>
  </table>
  <div class="total-section">
    <div class="total-row"><span>Subtotal</span><span>${amount}</span></div>
    <div class="total-row total-final"><span>Total</span><span>${amount}</span></div>
    <span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span>
  </div>
  <p class="footer">Thank you for enrolling with TechBorg. For support, contact support@techborg.in</p>
  </body></html>`;
}
