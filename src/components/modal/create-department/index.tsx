import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { changeModal } from "../../../redux/modalSlice";
import { onReload } from "../../../redux/tableSlice";
import departmentsService from "../../../services/api/departmentsService";
import { changeDepartment } from "../../../redux/departmentSlice";

const CreateDepartmentModal: React.FC = () => {
  const [form] = Form.useForm();
  const modal = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  function closeModal() {
    dispatch(changeDepartment({ id: null, name: null }));
    dispatch(changeModal({ isOpen: false, name: "create-department" }));
  }

  const onFinish = async () => {
    try {
      await form.validateFields();

      const values = await form.getFieldsValue();
      departmentsService.createDepartment({name: values.departmentName});
      closeModal();
      dispatch(onReload({ reload: true, name: "department" }));

      form.resetFields();
    } catch (error: any) {
      console.error("Validation error:", error.errorFields[0].errors[0]);
    }
  };

  return (
    <Modal
      centered
      open={modal.isOpen && modal.name === "create-department"}
      title="Criar Departamento"
      onCancel={() =>
        dispatch(changeModal({ isOpen: false, name: "create-department" }))
      }
      footer={[
        <Button key="cancel" onClick={closeModal}>Cancelar</Button>,
        <Button key="save" type="primary" onClick={onFinish}>
          Salvar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="departmentName"
          label="Nome do Departamento"
          rules={[
            { required: true, message: "Por favor insira o nome do departamento!" },
          ]}
          style={{ marginTop: 16 }}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDepartmentModal;
