import { Button } from "antd";
import React from "react";

import pageNotFoundImage from "../../assets/img/pageNotFound.jpg";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";

const NotFound: React.FC = () => {
  return (
    <Content
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img alt="not found" width={320} src={pageNotFoundImage} />
      <Title>whoooops!</Title>
      <Title level={5}>Nós não podemos encontrar a página que estava procurando!</Title>
      <Button type="primary" href="/feedbacks" style={{marginTop: 32}} size="large">
        Voltar para a página inicial
      </Button>
    </Content>
  );
};

export default NotFound;
