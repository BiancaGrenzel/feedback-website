import React, { useEffect, useReducer } from "react";
import { Button, Popconfirm, Row, Spin, Table } from "antd";
import type { TableProps } from "antd";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import usersService from "../../../services/api/usersService";
import departmentsService from "../../../services/api/departmentsService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { changeDepartment } from "../../../redux/departmentSlice";
import { changeModal } from "../../../redux/modalSlice";
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
  departments: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_DEPARTMENTS":
      return { ...state, departments: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const DepartmentTable: React.FC = () => {
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

        const departmentsData = await departmentsService.getDepartments();
        dispatch({ type: "SET_DEPARTMENTS", payload: departmentsData });

        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    const unsubscribe = onAuthStateChanged(getAuth(), fetchData);
    return () => unsubscribe();
  }, [table]);

  function handleClickEditDepartment(departmentId: string, name: string) {
    dispatchRedux(changeDepartment({ id: departmentId, name: name }));
    dispatchRedux(changeModal({ isOpen: true, name: "edit-department" }));
  }

  function handleClickDeleteDepartment(departmentId: string) {
    departmentsService.deleteDepartment(departmentId);
    dispatchRedux(onReload({ reload: true, name: "department" }));
  }

  const { isLoading, users, departments } = state;

  const data: DataType[] = departments.map((department: any) => {
    const usersInDepartment = users.filter(
      (user: any) => user.id_area === department.id
    );

    return {
      key: department.id,
      name: department.name,
      qttUsers: usersInDepartment.length,
      actions: (
        <Row style={{ gap: 8 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() =>
              handleClickEditDepartment(department.id, department.name)
            }
            style={{ background: "rgba(254,160,81,254)" }}
          />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => handleClickDeleteDepartment(department.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              style={{ background: "rgba(254,84,105,254)" }}
            />
          </Popconfirm>
        </Row>
      ),
    };
  });

  if (isLoading) {
    return (
      <Spin
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      />
    );
  }

  return (
    <Table style={{ height: "100%" }} columns={columns} dataSource={data} />
  );
};

export default DepartmentTable;
