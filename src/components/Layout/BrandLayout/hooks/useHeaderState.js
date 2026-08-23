import { useState } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { selectUser } from "../../../../store/slices/authSlice";

export const useHeaderState = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [credits, setCredits] = useState(240.0);
  const user = useAppSelector(selectUser);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return {
    isProfileOpen,
    credits,
    user,
    toggleProfile,
    closeProfile,
  };
};
