import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import { Button, Divider, Layout, PageHeader, Tooltip, Typography } from "antd";
import {
  ReadOutlined,
  LogoutOutlined,
  UserAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";

const Home = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;
  const { Title, Paragraph } = Typography;

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  if (!user) {
    return <Spinner />;
  }

  const onAddReport = () => {
    navigate(routes.report);
  };

  const onLogout = () => {
    signOut(auth);
  };

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="УЧЕТ КНИГ"
          className="page-header"
          avatar={{ src: BbtLogo }}
          extra={[
            <Tooltip title="Выйти" key="logout">
              <Button
                type="ghost"
                shape="circle"
                icon={<LogoutOutlined />}
                onClick={onLogout}
              />
            </Tooltip>,
          ]}
        />
      </Header>

      <Content>
        <div className="site-layout-content">
          <Title className="site-page-title" level={2}>
            Привет, {user?.displayName || "друг"}
          </Title>
          <Paragraph>Отметить распространненные книги</Paragraph>
          <Button
            type="primary"
            block
            size="large"
            icon={<ReadOutlined />}
            onClick={onAddReport}
          >
            Отметить книги
          </Button>
          <Divider dashed />
          <Button
            href="https://t.me/MonahiSborIstoriy_bot"
            target="_blank"
            block
            size="large"
            icon={<MessageOutlined />}
          >
            Отправить историю
          </Button>
          <Divider dashed />
          <Paragraph>Отправить полученные контакты</Paragraph>
          <Button
            href="http://san.bhakti-vriksha.ru/"
            target="_blank"
            block
            size="large"
            icon={<UserAddOutlined />}
          >
            Вторая волна
          </Button>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Home;
