import { Layout, theme } from "antd";
import DefaultLayout from "../../layout/default-layout";
import Feedback from "../../components/table/feedback";
import ViewFeedbackModal from "../../components/modal/view-feedback";

const { Content } = Layout;

const Home: React.FC = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <DefaultLayout>
      <Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            borderRadius: borderRadiusLG,
            height: "100%",
          }}
        >
          <Feedback />
          <ViewFeedbackModal/>
        </div>
      </Content>
    </DefaultLayout>
  );
};

export default Home;
