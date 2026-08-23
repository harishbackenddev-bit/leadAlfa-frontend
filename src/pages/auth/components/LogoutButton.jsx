import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import { clearOnboardingProfileCache } from '../../../utils/onboardingProfile';

const LogoutButton = ({
  onLogout, // optional custom function
  children, // ✅ custom content
  className = 'p-2 bg-red-500 text-white rounded-full',
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearOnboardingProfileCache();
    dispatch(logout());
    if (onLogout) onLogout(); // custom logic (optional)
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
    >
      {children ? children : 'Logout'}
    </button>
  );
};

export default LogoutButton;
