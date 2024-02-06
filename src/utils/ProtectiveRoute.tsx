import React, { useEffect } from "react";
import authService from "../services/api/authService";
import { Spin } from "antd";

const ProtectiveRoutes: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        await authService.checkUserLoggedIn().then((res) => {
          setIsLoggedIn(res);
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoggedIn();
  }, [children]);

  if (isLoggedIn && !isLoading) {
    return <>{children}</>;
  } else if(!isLoggedIn && !isLoading) {
    window.location.href = "/";
  }

  return <Spin size="large" fullscreen style={{background: "rgb(22, 119, 255)"}}/>;
};

export default ProtectiveRoutes;
