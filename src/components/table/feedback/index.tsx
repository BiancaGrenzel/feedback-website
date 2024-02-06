import React, { useEffect, useReducer } from "react";
import { Spin, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { formatTimestampDate } from "../../../helpers/date";
import feedbacksService from "../../../services/api/feedbacksService";
import usersService from "../../../services/api/usersService";
import departmentsService from "../../../services/api/departmentsService";
import teamsService from "../../../services/api/teamsService";
import { Filter } from "../../../types/filter";
import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { changeModal } from "../../../redux/modalSlice";
import { useDispatch } from "react-redux";
import { changeDepartment } from "../../../redux/departmentSlice";
import { changeFeedback } from "../../../redux/feedbackSlice";

interface DataType {
  key: string;
  name: string;
  area: string;
  team: string;
  date: Date;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Área de Atuação",
    dataIndex: "area",
    key: "area",
  },
  {
    title: "Equipe",
    dataIndex: "team",
    key: "team",
  },
  {
    title: "Data",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
  },
  {
    title: "Ações",
    dataIndex: "actions",
    key: "actions",
    width: 120,
  },
];

const initialState = {
  isLoading: true,
  feedbacks: [],
  users: [],
  areas: [],
  teams: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FEEDBACKS":
      return { ...state, feedbacks: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_AREAS":
      return { ...state, areas: action.payload };
    case "SET_TEAMS":
      return { ...state, teams: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const tags = [
  {
    color: "magenta",
    text: "Paciente",
  },
  {
    color: "red",
    text: "Ágil",
  },
  {
    color: "orange",
    text: "Comunicativo",
  },
  {
    color: "gold",
    text: "Dedicado",
  },
  {
    color: "lime",
    text: "Líder",
  },
  {
    color: "green",
    text: "Inovador",
  },
  {
    color: "cyan",
    text: "Criativo",
  },
  {
    color: "blue",
    text: "Proativo",
  },
  {
    color: "geekblue",
    text: "Inteligente",
  },
  {
    color: "purple",
    text: "Estratégico",
  },
];

const FeedbackTable: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      const user = getAuth().currentUser;
      if (user) {
        const filter: Filter = {
          field: "id_rated_user",
          operator: "==",
          value: user.uid || "",
        };

        const feedbacksData = await feedbacksService.getFeedbacks(filter);
        dispatch({ type: "SET_FEEDBACKS", payload: feedbacksData });

        const usersData = await usersService.getUsers();
        dispatch({ type: "SET_USERS", payload: usersData });

        const areasData = await departmentsService.getDepartments();
        dispatch({ type: "SET_AREAS", payload: areasData });

        const teamsData = await teamsService.getTeams();
        dispatch({ type: "SET_TEAMS", payload: teamsData });

        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    const unsubscribe = onAuthStateChanged(getAuth(), fetchData);
    return () => unsubscribe();
  }, []);

  const { isLoading, feedbacks, users, areas, teams } = state;

  function openViewFeedbackModal(id: string) {
    dispatchRedux(changeFeedback({ id: id }));
    dispatchRedux(changeModal({ isOpen: true, name: "view-feedback" }));
  }

  const data: DataType[] = feedbacks.map((feedback: any) => {
    const user = users.find((u: any) => u.id === feedback.id_user);
    const userName = user ? user.name : "";
    const area = areas.find((a: any) => a.id === user.id_area);
    const areaName = area ? area.name : "";
    const team = teams.find((t: any) => t.id === user.id_team);
    const teamName = team ? team.name : "";

    return {
      key: feedback.id,
      name: userName,
      area: areaName,
      team: teamName,
      date: formatTimestampDate(feedback.date),
      tags: <span>{feedback.tags.map((tag: string) => {
        const matchedTag = tags.find((t) => t.text === tag);
        const color = matchedTag ? matchedTag.color : "defaultColor";
        return <Tag key={tag} color={color}>{tag}</Tag>;
      })}</span>,
      actions: <Button type="primary" icon={<EyeOutlined />} onClick={() => openViewFeedbackModal(feedback.id)} />,
    };
  });

  if (isLoading) {
    return <Spin style={{ position: "absolute", top: "50%", left: "50%" }} />;
  }

  return (
    <Table style={{ height: "100%" }} columns={columns} dataSource={data} />
  );
};

export default FeedbackTable;
