import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { Button, Divider, Layout, PageHeader, Tooltip, Typography } from "antd";
import {
  LogoutOutlined,
  MessageOutlined,
  BookOutlined,
} from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "../firebase/useCurrentUser";

type Props = {
  currentUser: CurrentUser;
};

export const Denied = ({ currentUser }: Props) => {
  const { auth, user, profile, loading } = currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, navigate, loading]);

  const onLogout = () => {
    signOut(auth);
  };

  const { Content, Footer, Header } = Layout;
  const { Title, Paragraph } = Typography;

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="УЧЕТ КНИГ (АДМИН)"
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
            Доступ закрыт
          </Title>
          <Paragraph>
            Уважаемый {profile?.name || user?.displayName || "друг"}, Ваш аккаунт
            не обладает правами администратора.
          </Paragraph>
          <Paragraph>
            Вы можете связаться с поддержкой для получения доступа:
          </Paragraph>
          <Button
            href="https://t.me/karavanBook_bot"
            target="_blank"
            block
            size="large"
            icon={<MessageOutlined />}
          >
            Открыть поддержку в телеграмм
          </Button>
          <Divider />
          <Button
            href="https://karavan-book-tracker.web.app/"
            block
            size="large"
            icon={<BookOutlined />}
          >
            Перейти в трекер
          </Button>
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
