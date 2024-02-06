import React, { useEffect, useReducer, useState } from "react";
import DefaultLayout from "../../layout/default-layout";
import TextArea from "antd/es/input/TextArea";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import Title from "antd/es/typography/Title";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import usersService from "../../services/api/usersService";
import teamsService from "../../services/api/teamsService";
import departmentsService from "../../services/api/departmentsService";
import { Filter } from "../../types/filter";
import feedbacksService from "../../services/api/feedbacksService";
import { ToastContainer, toast } from "react-toastify";

const tags = [
  {
    key: 1,
    color: "magenta",
    text: "Paciente",
  },
  {
    key: 2,
    color: "red",
    text: "Ágil",
  },
  {
    key: 3,
    color: "orange",
    text: "Comunicativo",
  },
  {
    key: 4,
    color: "gold",
    text: "Dedicado",
  },
  {
    key: 5,
    color: "lime",
    text: "Líder",
  },
  {
    key: 6,
    color: "green",
    text: "Inovador",
  },
  {
    key: 7,
    color: "cyan",
    text: "Criativo",
  },
  {
    key: 8,
    color: "blue",
    text: "Proativo",
  },
  {
    key: 9,
    color: "geekblue",
    text: "Inteligente",
  },
  {
    key: 10,
    color: "purple",
    text: "Estratégico",
  },
];

const initialState = {
  date: "",
  feedback: "",
  id_rated_user: "",
  id_user: "",
  isLoading: true,
  users: [],
  teams: [],
  departments: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_TEAMS":
      return { ...state, teams: action.payload };
    case "SET_DEPARTMENTS":
      return { ...state, departments: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const GiveFeedback: React.FC = () => {
  const [userSelected, setUserSelected] = useState<string>();
  const [teamSelected, setTeamSelected] = useState<string>();
  const [departmentSelected, setDepartmentSelected] = useState<string>();
  const [feedback, setFeedback] = useState<string>();
  const [tagsSelected, setTagsSelected] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form] = Form.useForm();

  function onClickTag(tag: string) {
    if (tagsSelected.includes(tag)) {
      setTagsSelected(tagsSelected.filter((item) => item !== tag));
    } else {
      setTagsSelected([...tagsSelected, tag]);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      const user = getAuth().currentUser;
      if (user) {
        const teamsData = await teamsService.getTeams();
        dispatch({ type: "SET_TEAMS", payload: teamsData });

        if (teamSelected) {
          const departmentsData = await departmentsService.getDepartments();
          dispatch({ type: "SET_DEPARTMENTS", payload: departmentsData });
        }

        if (departmentSelected) {
          const filter: Filter = {
            field: "id_area",
            operator: "==",
            value: departmentSelected,
          };
          const usersData = await usersService.getUsers(filter);
          dispatch({ type: "SET_USERS", payload: usersData });
        }

        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    const unsubscribe = onAuthStateChanged(getAuth(), fetchData);
    return () => unsubscribe();
  }, [teamSelected, departmentSelected]);

  function handleCleanFields() {
    setUserSelected("");
    setTeamSelected("");
    setDepartmentSelected("");
    setFeedback("");
    setTagsSelected([]);
    form.resetFields();
  }

  function handleSaveFeedback() {
    const user = getAuth().currentUser;

    if (!userSelected || !feedback || feedback.length < 10 || !user?.uid)
      return;

    feedbacksService.createFeedback({
      date: new Date().toISOString(),
      feedback: feedback,
      id_rated_user: userSelected,
      id_user: user.uid,
      tags: tagsSelected,
    });

    toast.success("Feedback salvo com sucesso!");

    handleCleanFields();
  }

  return (
    <DefaultLayout>
      <Row gutter={[32, 32]}>
        <Col span={4}>
          <Form form={form}>
            <Form.Item
              name="team"
              label="Equipe"
              labelCol={{ span: 24 }}
              style={{ marginTop: 40 }}
            >
              <Select
                placeholder="Escolha a Equipe"
                onSelect={(value) => setTeamSelected(value)}
                options={state.teams.map((user: any) => ({
                  value: user.id,
                  label: user.name,
                }))}
                loading={state.isLoading}
                allowClear
                value={teamSelected}
              />
            </Form.Item>
            <Form.Item
              name="department"
              label="Departamento"
              labelCol={{ span: 24 }}
            >
              <Select
                placeholder="Escolha o Departamento"
                onSelect={(value) => setDepartmentSelected(value)}
                options={state.departments.map((user: any) => ({
                  value: user.id,
                  label: user.name,
                }))}
                loading={state.isLoading}
                allowClear
                disabled={teamSelected ? false : true}
                value={departmentSelected}
              />
            </Form.Item>
            <Form.Item name="user" label="Usuário" labelCol={{ span: 24 }}>
              <Select
                placeholder="Escolha o Usuário"
                onSelect={(value) => setUserSelected(value)}
                options={state.users.map((user: any) => ({
                  value: user.id,
                  label: user.name,
                }))}
                loading={state.isLoading}
                allowClear
                disabled={departmentSelected ? false : true}
                value={userSelected}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={16}>
          <Title level={3}>Deixe um Feedback</Title>
          <Card
            style={{ background: "#f0f6ff", border: "none", marginTop: 24 }}
          >
            <TextArea
              rows={10}
              style={{ border: "none" }}
              onChange={(e) => setFeedback(e.target.value)}
              value={feedback}
            />
            <Button
              type="primary"
              size="large"
              style={{ marginTop: 32, float: "right" }}
              disabled={!userSelected || !feedback || feedback.length < 10}
              onClick={handleSaveFeedback}
            >
              Enviar Feedback
            </Button>
          </Card>
        </Col>
        <Col span={4}>
          <Divider orientation="left" style={{ marginTop: 40 }}>
            Tags
          </Divider>
          <Space size={[0, 8]} wrap>
            {tags.map((tag) => (
              <Tag
                color={tagsSelected.includes(tag.text) ? tag.color : undefined}
                style={{ cursor: "pointer" }}
                onClick={() => onClickTag(tag.text)}
              >
                {tag.text}
              </Tag>
            ))}
          </Space>
        </Col>
      </Row>
      <ToastContainer />
    </DefaultLayout>
  );
};

export default GiveFeedback;
