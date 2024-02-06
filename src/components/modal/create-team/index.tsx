import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import teamsService from "../../../services/api/teamsService";
import { changeTeam } from "../../../redux/teamSlice";
import { changeModal } from "../../../redux/modalSlice";
import { onReload } from "../../../redux/tableSlice";

const CreateTeamModal: React.FC = () => {
  const [form] = Form.useForm();
  const modal = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  function closeModal() {
    dispatch(changeTeam({ id: null, name: null }));
    dispatch(changeModal({ isOpen: false, name: "create-team" }));
  }

  const onFinish = async () => {
    try {
      await form.validateFields();

      const values = await form.getFieldsValue();
      teamsService.createTeam({name: values.teamName});
      closeModal();
      dispatch(onReload({ reload: true, name: "team" }));

      form.resetFields();
    } catch (error: any) {
      console.error("Validation error:", error.errorFields[0].errors[0]);
    }
  };

  return (
    <Modal
      centered
      open={modal.isOpen && modal.name === "create-team"}
      title="Criar Equipe"
      onCancel={() =>
        dispatch(changeModal({ isOpen: false, name: "create-team" }))
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
          name="teamName"
          label="Nome da Equipe"
          rules={[
            { required: true, message: "Por favor insira o nome da equipe!" },
          ]}
          style={{ marginTop: 16 }}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeamModal;
