import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "../../layout/default-layout";
import Team from "../../components/table/team";
import EditTeamModal from "../../components/modal/edit-team";
import { Col, Form, Select, Button } from "antd";
import Title from "antd/es/typography/Title";
import { PrinterOutlined, PlusOutlined } from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import TeamReport from "../../reports/TeamReport";
import { useDispatch } from "react-redux";
import { changeModal } from "../../redux/modalSlice";
import CreateTeamModal from "../../components/modal/create-team";
import teamsService from "../../services/api/teamsService";
import { changeTeam } from "../../redux/teamSlice";

const Teams: React.FC = () => {
  const reportRef = useRef(null);
  const dispatch = useDispatch();
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getTeams();
  }, []);

  function openCreateTeamModal() {
    dispatch(changeModal({ isOpen: true, name: "create-team" }));
  }

  function onSelectReportFilter(id: string) {
    dispatch(changeTeam({ id }));
  }

  function getTeams() {
    teamsService.getTeams().then((response) => {
      setTeams(response as any);
    });
  }

  return (
    <DefaultLayout>
      <Form layout="inline" style={{ marginBottom: 32 }}>
        <Col className="gutter-row" span={6}>
          <Form.Item>
            <Title level={5}>Equipe</Title>
            <Select
              allowClear
              placeholder="Equipe"
              options={teams.map((team) => ({
                value: team.id,
                label: team.name,
              }))}
              onSelect={(value) => onSelectReportFilter(value)}
            ></Select>
          </Form.Item>
        </Col>
        <Col
          className="gutter-row"
          span={5}
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <ReactToPrint
            trigger={() => (
              <Button type="primary" icon={<PrinterOutlined />}>
                Imprimir Relatório
              </Button>
            )}
            content={() => reportRef.current}
          />
        </Col>
        <Col
          className="gutter-row"
          span={13}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: 165, background: "rgba(3,168,242,255)" }}
            onClick={openCreateTeamModal}
          >
            Criar Equipe
          </Button>
        </Col>
      </Form>
      <Team />
      <EditTeamModal />
      <CreateTeamModal />
      <TeamReport ref={reportRef} />
    </DefaultLayout>
  );
};

export default Teams;
