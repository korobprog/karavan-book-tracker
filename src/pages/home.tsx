import React from "react";
import { signOut } from "firebase/auth";
import { Button, Divider, Layout, PageHeader, Tooltip, Typography } from "antd";
import {
  ReadOutlined,
  LogoutOutlined,
  UserAddOutlined,
  MessageOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useOperations } from "../firebase/useOperations";
import { CurrentUser } from "../firebase/useCurrentUser";

type Props = {
  currentUser: CurrentUser;
};

export const Home = ({ currentUser }: Props) => {
  const { auth, user, profile } = currentUser;
  const navigate = useNavigate();
  const { myOperationDocData } = useOperations();

  const onAddReport = () => {
    navigate(routes.report);
  };

  const onLogout = () => {
    signOut(auth);
  };

  const statistic2022 = profile?.statistic?.[2022];

  const { Content, Footer, Header } = Layout;
  const { Title, Paragraph } = Typography;

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="УЧЕТ КНИГ"
          className="page-header"
          avatar={{ src: BbtLogo }}
          extra={[
            <Tooltip title="Профиль" key="profile">
              <Button
                type="ghost"
                shape="circle"
                icon={<UserOutlined />}
                onClick={() => navigate(routes.profile)}
              />
            </Tooltip>,
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
            Привет,{" "}
            {profile?.nameSpiritual ||
              profile?.name ||
              user?.displayName ||
              "друг"}
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
          {statistic2022 && (
            <Paragraph>
              В этом году вы распространили - книг: {statistic2022.count},
              баллов: {statistic2022.points}
            </Paragraph>
          )}
          {myOperationDocData && <Paragraph>Последние операции:</Paragraph>}
          {myOperationDocData?.map((operation, index) => {
            return (
              <Paragraph key={index}>
                {new Date(operation.date).toLocaleDateString()} - книг:{" "}
                {operation.totalCount}, баллов: {operation.totalPoints}
              </Paragraph>
            );
          })}
          <Divider dashed />
          <Button
            href="https://t.me/karavanBook_bot"
            target="_blank"
            block
            size="large"
            icon={<MessageOutlined />}
          >
            Отправить историю / поддержка
          </Button>
          <Divider dashed />
          <Paragraph>Статистика:</Paragraph>
          <Divider dashed />
          <Button
            href="https://sankirtana-map.web.app"
            target="_blank"
            block
            size="large"
            icon={<EnvironmentOutlined />}
          >
            Общая на карте
          </Button>
          <Divider dashed />
          <Paragraph>Отправить полученные контакты:</Paragraph>
          <Divider dashed />
          <Button
            href="http://san.bhakti-vriksha.ru/"
            target="_blank"
            block
            size="large"
            icon={<UserAddOutlined />}
          >
            Вторая волна
          </Button>
          <Divider dashed />
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
