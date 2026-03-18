import { useNavigate, Link } from 'react-router-dom';
import { FileText, Home, Info, HelpCircle, Shield, FileCheck, ChevronRight } from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageCms.css';

const PAGES = [
  { to: '/admin/edit-home',          icon: Home,      label: 'Home Page',           desc: 'Hero, features, CTA section' },
  { to: '/admin/edit-about',         icon: Info,      label: 'About Page',          desc: 'Title and description' },
  { to: '/admin/edit-support',       icon: HelpCircle,label: 'Support Page',        desc: 'FAQ categories and answers' },
  { to: '/admin/edit-privacy-policy',icon: Shield,    label: 'Privacy Policy',      desc: 'Full privacy policy content' },
  { to: '/admin/edit-terms',         icon: FileCheck, label: 'Terms & Conditions',  desc: 'Terms of service content' },
  { to: '/admin/edit-contact',       icon: FileText,  label: 'Contact Page',        desc: 'Contact info and details' },
];

export default function AdminManageCms() {
  const navigate = useNavigate();

  return (
    <div className="cms-hub">
      <div className="cms-hub-header">
        <FileText size={28} className="cms-hub-icon" />
        <div>
          <h1 className="cms-hub-title">Mentor Editor</h1>
          <p className="cms-hub-sub">Edit and manage all website page content</p>
        </div>
      </div>

      <div className="cms-hub-grid">
        {PAGES.map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="cms-hub-card">
            <div className="cms-hub-card-icon">
              <Icon size={22} />
            </div>
            <div className="cms-hub-card-body">
              <span className="cms-hub-card-label">{label}</span>
              <span className="cms-hub-card-desc">{desc}</span>
            </div>
            <ChevronRight size={18} className="cms-hub-card-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
}
