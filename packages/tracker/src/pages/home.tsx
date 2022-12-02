import React from "react";
import { Button, Divider, Layout, PageHeader, Tooltip, Typography } from "antd";
import {
  ReadOutlined,
  UserAddOutlined,
  MessageOutlined,
  UserOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

type Props = {
  currentUser: CurrentUser;
};

export const Home = ({ currentUser }: Props) => {
  const { user, profile } = currentUser;
  const navigate = useNavigate();

  const onAddReport = () => {
    navigate(routes.report);
  };


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
          <Divider dashed />
          <Button
            block
            size="large"
            icon={<BarChartOutlined />}
            onClick={() => navigate(routes.statistic)}
          >
            Моя статискика
          </Button>
          <Divider dashed />
          <Button
            block
            size="large"
            icon={<TeamOutlined />}
            onClick={() => navigate(routes.team)}
          >
            Моя команда
          </Button>
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
          <Button
            href="https://sankirtana-map.web.app"
            target="_blank"
            block
            size="large"
            icon={<EnvironmentOutlined />}
          >
            Общая статистика на карте
          </Button>
          <Divider dashed />
          <Paragraph>Отправить полученные контакты:</Paragraph>
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
