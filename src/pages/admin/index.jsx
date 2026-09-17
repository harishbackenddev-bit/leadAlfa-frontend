import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  return <div />;
};

export default AdminPage;
