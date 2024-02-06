import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import teamsService from "../../../services/api/teamsService";
import { changeTeam } from "../../../redux/teamSlice";
import { changeModal } from "../../../redux/modalSlice";
import { onReload } from "../../../redux/tableSlice";

const EditTeamModal: React.FC = () => {
  const [form] = Form.useForm();
  const team = useSelector((state: RootState) => state.team);
  const modal = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue({ teamName: team.name });
  }, [modal.isOpen]);

  function closeModal() {
    dispatch(changeTeam({ id: null, name: null }));
    dispatch(changeModal({ isOpen: false, name: "edit-team" }));
  }

  const onFinish = async () => {
    try {
      await form.validateFields();

      const values = await form.getFieldsValue();
      teamsService.updateTeam(team.id, values.teamName);
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
      open={modal.isOpen && modal.name === "edit-team"}
      title="Editar Time"
      onCancel={() =>
        dispatch(changeModal({ isOpen: false, name: "edit-team" }))
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
          label="Nome do Time"
          rules={[
            { required: true, message: "Por favor insira o nome do time" },
          ]}
          style={{ marginTop: 16 }}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTeamModal;
