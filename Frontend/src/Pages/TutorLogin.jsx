import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tutor login is now unified at /login
export default function TutorLogin() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/login', { replace: true }); }, [navigate]);
  return null;
}
