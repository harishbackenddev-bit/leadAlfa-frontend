import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/authSlice";
import BrandProfileVerification from "../ProfileVerification";

/**
 * Legacy route wrapper for /brand/campaigns/verification.
 * Profile gating is handled in BrandLayout; this reuses the shared screen.
 */
export default function ProfileVerification() {
  const user = useAppSelector(selectUser);
  const profile = user?.profile ?? null;

  return <BrandProfileVerification profile={profile} />;
}
