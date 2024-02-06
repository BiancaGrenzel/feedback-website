import { Button, Descriptions, Modal, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { changeModal } from "../../../redux/modalSlice";
import { useEffect, useState } from "react";
import feedbacksService from "../../../services/api/feedbacksService";
import { Feedback } from "../../../types/feedback";
import { formatTimestampDate } from "../../../helpers/date";

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

const ViewFeedbackModal: React.FC = () => {
  const modal = useSelector((state: RootState) => state.modal);
  const feedbackId = useSelector((state: RootState) => state.feedback);
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState<Feedback>();

  function closeModal() {
    dispatch(changeModal({ isOpen: false, name: "view-feedback" }));
  }

  useEffect(() => {
    if (!feedbackId.id) return;
    async function getFeedbackById() {
      try {
        const feedback = await feedbacksService.getFeedbackById(feedbackId.id);
        setFeedback(feedback as Feedback);
      } catch (error) {
        console.error(error);
      }
    }

    getFeedbackById();
  }, [feedbackId.id, feedbackId.id_user]);

  return (
    <Modal
      centered
      open={modal.isOpen && modal.name === "view-feedback"}
      title="Visualizar Feedback"
      onCancel={() =>
        dispatch(changeModal({ isOpen: false, name: "view-feedback" }))
      }
      footer={[
        <Button key="cancel" onClick={closeModal}>
          Cancelar
        </Button>,
      ]}
    >
      <Descriptions style={{ marginTop: 32 }}>
        <Descriptions.Item label="Nome" span={2}>
          {feedback?.id_user}
        </Descriptions.Item>
        {feedback?.date && (
          <Descriptions.Item label="Data" span={2}>
            {formatTimestampDate(feedback.date)?.split(" ")[0]}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Feedback" span={4}>
          {feedback?.feedback}
        </Descriptions.Item>

        <Descriptions.Item label="Tags" span={4}>
          {tags
            .filter((tag) => feedback?.tags.includes(tag.text))
            .map((tag) => (
              <Tag key={tag.text} color={tag.color}>{tag.text}</Tag>
            ))}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewFeedbackModal;
