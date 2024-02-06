import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { getAuth, signOut } from "firebase/auth";
import Title from "antd/es/typography/Title";
import Typography from "antd/es/typography/Typography";
import authService from "../../services/api/authService";
import usersService from "../../services/api/usersService";
import { User } from "../../types/user";

const { Header, Content, Footer } = Layout;

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
const [selectedKey, setSelectedKey] = useState("1");
  

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = useMemo(() => [
    { key: 1, label: "Meus Feedbacks", url: "/feedbacks" },
    { key: 2, label: "Dar Feedback", url: "/give-feedback" },
    ...(user?.admin
      ? [
          { key: 3, label: "Equipes", url: "/teams" },
          { key: 4, label: "Departamentos", url: "/departments" },
        ]
      : []),
    { key: 5, label: "Sair", url: "/", icon: <LogoutOutlined /> },
  ], [user?.admin]);

  useEffect(() => {
    authService.getUserUid().then((uid) => {
      usersService.getUserById(uid).then((user) => {
        setUser(user as User);
      });
    });

    if(user?.admin) setIsUserAdmin(true); else setIsUserAdmin(false);

    const url = window.location.pathname;
    const menuItem = menuItems.find((item) => item.url === url);
    if (menuItem) setSelectedKey(menuItem.key.toString());
  }, [menuItems, user?.admin]);

  useCallback(() => {
    if(isUserAdmin) {
      menuItems.push({ key: 3, label: "Equipes", url: "/teams" });
      menuItems.push({ key: 4, label: "Departamentos", url: "/departments" });
    } else {
      menuItems.splice(2, 2);
    }

  }, [isUserAdmin, menuItems]);

  const handleSignOut = () => {
    signOut(getAuth())
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{ display: "flex", alignItems: "center", background: "white" }}
      >
        <img
          src={require("../../assets/img/logo.png")}
          alt="logo"
          style={{ width: 30 }}
        />
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ flex: 1, minWidth: 0, background: "white" }}
          selectedKeys={[selectedKey]}
        >
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key.toString()} // Convert item.key to a string
              style={{ marginLeft: item.key === 5 ? "auto" : "0" }}
              onClick={() => {
                setSelectedKey(item.key.toString()); // Convert item.key to a string
                if (item.key === 5) handleSignOut();
              }}
            >
              <Link to={item.url}>
                {item.icon} {item.label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Header
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
          background: "linear-gradient(270deg, #03A9F3 0.02%, #1E7BCA 99.95%)",
        }}
      >
        <Title style={{ color: "white" }}>Feedback Website</Title>
        <Typography style={{ color: "white", marginLeft: "16px" }}>
          Seja bem-vindo, {user?.name}!
        </Typography>
      </Header>
      <Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 48,
            height: "100%",
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center", background: "white" }}>
        Feedback ©{new Date().getFullYear()} Created by Bianca Grenzel Severo
      </Footer>
    </Layout>
  );
};

export default DefaultLayout;
