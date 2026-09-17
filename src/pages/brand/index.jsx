import { useEffect } from "react";
import { Router, useNavigate } from "react-router-dom";

const BrandPage = () => {
// Redirect to /brand/campaigns on mount
const  navigate = useNavigate();
    useEffect(() => {
        navigate('/brand/campaigns', { replace: true });
    }, []);
  return (
    <div>  </div>
  );
}


export default BrandPage;