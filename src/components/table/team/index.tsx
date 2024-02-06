import React, { useEffect, useReducer } from "react";
import { Button, Popconfirm, Row, Table } from "antd";
import type { TableProps } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import teamsService from "../../../services/api/teamsService";
import usersService from "../../../services/api/usersService";
import { useDispatch, useSelector } from "react-redux";
import { changeTeam } from "../../../redux/teamSlice";
import { changeModal } from "../../../redux/modalSlice";
import { RootState } from "../../../redux/store";
import { onReload } from "../../../redux/tableSlice";

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
    title: "Qtd. Usuários",
    dataIndex: "qttUsers",
    key: "qttUsers",
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
  users: [],
  teams: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_TEAMS":
      return { ...state, teams: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const TeamTable: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();
  const table = useSelector((state: RootState) => state.table);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      const user = getAuth().currentUser;
      if (user) {
        const usersData = await usersService.getUsers();
        dispatch({ type: "SET_USERS", payload: usersData });

        const teamsData = await teamsService.getTeams();
        dispatch({ type: "SET_TEAMS", payload: teamsData });

        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    const unsubscribe = onAuthStateChanged(getAuth(), fetchData);
    return () => unsubscribe();
  }, [table]);

  function handleClickEditTeam(teamId: string, name: string) {
    dispatchRedux(changeTeam({ id: teamId, name: name }));
    dispatchRedux(changeModal({isOpen: true, name: "edit-team" }));
  }

  function handleClickDeleteTeam(teamId: string) {
    teamsService.deleteTeam(teamId);
    dispatchRedux(onReload({ reload: true, name: "team" }));
  }

  const { isLoading, users, teams } = state;

  const data: DataType[] = teams.map((team: any) => {
    const usersInTeam = users.filter((user: any) => user.id_team === team.id);

    return {
      key: team.id,
      name: team.name,
      qttUsers: usersInTeam.length,
      actions: (
        <Row style={{ gap: 8 }}>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleClickEditTeam(team.id, team.name)} style={{background: 'rgba(254,160,81,254)'}}/>
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => handleClickDeleteTeam(team.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="primary" icon={<DeleteOutlined/>} style={{background: 'rgba(254,84,105,254)'}} />
          </Popconfirm>
        </Row>
      ),
    };
  });

  return (
    <Table style={{ height: "100%" }} columns={columns} dataSource={data} loading={isLoading}/>
  );
};

export default TeamTable;
