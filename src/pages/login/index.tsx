import React, { useState } from "react";
import { Form, Input, Button, Typography, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { auth } from "../../services/firebaseConfig";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInWithEmailAndPassword, loading] =
    useSignInWithEmailAndPassword(auth);

  async function handleSignIn() {
    await signInWithEmailAndPassword(email, password)
      .then((data) => {
        if(data) {
          return (window.location.href = "/feedbacks");
        } else {
          toast.error("Erro ao fazer login!");
        }
      })
  }

  function handleRecoverPassword() {
    // sendPasswordResetEmail(auth, email)
    //   .then(() => {
    //     toast.success("E-mail de recuperação de senha enviado!");
    //   })
    //   .catch((error) => {
    //     toast.error("Erro ao enviar e-mail de recuperação de senha!");
    //   });
    window.location.href = "/recover-password";
  }

  const contentStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1677ff",
  };

  const formStyle: React.CSSProperties = {
    padding: "32px",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#fff",
    maxWidth: "480px",
    width: "440px",
    borderRadius: "8px",
    backgroundColor: "white",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    height: "32px",
    marginTop: "16px",
  };

  if (loading) {
    return (
      <Content style={contentStyle}>
        <Spin />
      </Content>
    );
  }

  return (
    <Content style={contentStyle}>
      <Form style={formStyle} name="login">
        <Title level={2}>Login</Title>
        <Form.Item
          name="email"
          label="E-mail"
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: "Por favor, insira seu e-mail!" }]}
        >
          <Input
            placeholder="Insira seu e-mail"
            prefix={<UserOutlined className="site-form-item-icon" />}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Senha"
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
        >
          <Input.Password
            placeholder="Senha"
            prefix={<LockOutlined className="site-form-item-icon" />}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Typography>
          <p onClick={handleRecoverPassword}>Esqueceu sua senha?</p>
        </Typography>
        <Form.Item>
          <Button type="primary" style={buttonStyle} onClick={handleSignIn}>
            Entrar
          </Button>
        </Form.Item>
        <Typography>Não tem uma conta?</Typography>
        <Button style={buttonStyle} type="dashed" color="" href="/register">
          Criar conta
        </Button>
      </Form>
      <ToastContainer />
    </Content>
  );
};

export default Login;
