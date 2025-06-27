import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Invoice.css';

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetch('/Invoices.json')
      .then((res) => res.json())
      .then((data) => {
        // filter to only show this user's invoices
        const myInvoices = data.filter(inv => inv.userId === user.id);
        setInvoices(myInvoices);
      })
      .catch((err) => console.error('Failed to load invoices:', err));
  }, [user.id]);

  return (
    <div className="techborg-invoice-page">
      <h1 className="techborg-invoice-title">My Invoices</h1>
      <p className="techborg-invoice-sub">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
      <table className="techborg-invoice-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.orderNumber}</td>
                <td>{inv.date}</td>
                <td>₹ {inv.amount.toLocaleString('en-IN')}</td>
                <td>
                  <a href={inv.invoiceUrl} target="_blank" rel="noreferrer">
                    View Invoice
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="techborg-invoice-loading">
                You have no invoices yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Invoice;
