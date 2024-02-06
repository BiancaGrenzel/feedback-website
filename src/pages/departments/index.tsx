import React from "react";
import DefaultLayout from "../../layout/default-layout";
import DepartmentTable from "../../components/table/department";
import { Button, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { changeModal } from "../../redux/modalSlice";
import CreateDepartmentModal from "../../components/modal/create-department";
import EditDepartmentModal from "../../components/modal/edit-departament";

const Departments: React.FC = () => {
  const dispatch = useDispatch();

  function openCreateTeamModal() {
    dispatch(changeModal({ isOpen: true, name: "create-department" }));
  }
  return (
    <DefaultLayout>
      <Col
        className="gutter-row"
        span={24}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          gap: 8,
          marginBottom: 32,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: "rgba(3,168,242,255)" }}
          onClick={openCreateTeamModal}
        >
          Criar Departamento
        </Button>
      </Col>
      <DepartmentTable />
      <CreateDepartmentModal />
      <EditDepartmentModal />
    </DefaultLayout>
  );
};

export default Departments;
