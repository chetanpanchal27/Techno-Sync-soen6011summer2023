import { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";

import { PopupContext } from "../App";

const Logout = (props) => {
  const setPopup = useContext(PopupContext);
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    setPopup({
      open: true,
      severity: "success",
      message: "Logged out successfully",
    });
  }, []);
  return <Navigate to="/login" />;
};

export default Logout;
