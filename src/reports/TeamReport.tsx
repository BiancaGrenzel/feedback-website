import { Divider } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Typography from "antd/es/typography";
import Title from "antd/es/typography/Title";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import teamsService from "../services/api/teamsService";
import usersService from "../services/api/usersService";
import { Filter } from "../types/filter";
import feedbacksService from "../services/api/feedbacksService";

const ReportComponent = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();
  const team = useSelector((state: any) => state.team);
  const [teamData, setTeamData] = React.useState<any>();
  const [users, setUsers] = React.useState<any[]>([]);
  const [feedbacks, setFeedbacks] = React.useState<any[]>([]);

  async function getTeamById(id: string) {
    try {
      const response = await teamsService.getTeamById(id);
      setTeamData(response as any);
    } catch (error) {
      console.error(error);
    }
  }

  async function getUsersByTeamId(id: string) {
    const filter: Filter = { field: "id_team", operator: "==", value: id };

    try {
      const response = await usersService.getUsers(filter);
      setUsers(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function getFeedbacks() {
    try {
      const response = await feedbacksService.getFeedbacks();
      setFeedbacks(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (team.id) {
      getUsersByTeamId(team.id);
      getTeamById(team.id);
      getFeedbacks();
    } else {
      setTeamData(null);
    }
  }, [team.id]);

  return (
    <div ref={ref} {...props}>
      <Header
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "15vh",
          background: "linear-gradient(270deg, #03A9F3 0.02%, #1E7BCA 99.95%)",
        }}
      >
        <Title style={{ color: "white" }}>Feedback Website</Title>
        <Typography style={{ color: "white", marginLeft: "16px" }}>
          Relatório de Feedbacks de Equipes
        </Typography>
      </Header>
      <Content style={{ padding: 32 }}>
        <Typography style={{ margin: "16px 0" }}>
          Nome da Equipe: {teamData?.name}
        </Typography>
        <Typography style={{ margin: "16px 0" }}>
          Data de Criação de Relatório: {formattedDate}
        </Typography>

        {teamData && (
          <div>
            <Divider orientation="left" style={{ marginTop: 16 }}>
              <Title level={5} style={{ margin: "16px 0" }}>
                Membros da Equipe
              </Title>
            </Divider>

            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.name} - Quantidade de Feedbacks: {feedbacks.map((feedback) => feedback.id_user === user.id).length}</li>
              ))}
            </ul>
          </div>
        )}

        {feedbacks && (
          <div>
            <Divider orientation="left" style={{ marginTop: 16 }}>
              <Title level={5} style={{ margin: "16px 0" }}>
                Feedbacks
              </Title>
            </Divider>
            <ul>
              {feedbacks.map((feedback) => (
                <li key={feedback.id}>{feedback.message}</li>
              ))}
            </ul>
          </div>
        )}
      </Content>

      <Footer style={{ textAlign: "center", background: "white" }}>
        Feedback ©{new Date().getFullYear()} Created by Bianca Grenzel Severo
      </Footer>
    </div>
  );
});

export default ReportComponent;
