import React from 'react';
import '../Styles/PagesStyle/SettingStyle.css';

export default function SettingsLayout({ user, children }) {
  return (
    <div className="techborg-settings-container">
      <h2>Settings: {user.role?.toUpperCase()}</h2>
      {children}
    </div>
  );
}
