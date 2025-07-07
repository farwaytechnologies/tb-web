import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/DashbordStyle/AdminManageCms.css';

export default function AdminManageCms() {
  return (
    <div className="cms-container">
      <h2 className="cms-title">Manage CMS Pages</h2>
      <div className="cms-options">
        <Link to="/admin/edit-home" className="cms-card">Edit Home Page</Link>
        <Link to="/admin/edit-about" className="cms-card">Edit About Page</Link>
        <Link to="/admin/edit-contact" className="cms-card">Edit Contact Page</Link>
        <Link to="/admin/edit-support" className="cms-card">Edit Support Page</Link>
        <Link to="/admin/edit-privacy-policy" className="cms-card">Edit Privacy Policy</Link>
        <Link to="/admin/edit-terms" className="cms-card">Edit Terms & Conditions</Link>
      </div>
    </div>
  );
}
