import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { Button, Divider, Tooltip, Typography } from "antd";
import { LogoutOutlined, MessageOutlined, BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";

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

  const { Title, Paragraph } = Typography;

  return (
    <BaseLayout
      title="Учет книг"
      isAdmin
      backPath={routes.root}
      headerActions={[
        <Tooltip title="Выйти" key="logout">
          <Button type="default" shape="circle" icon={<LogoutOutlined />} onClick={onLogout} />
        </Tooltip>,
      ]}
    >
      <Title className="site-page-title" level={2}>
        Доступ закрыт
      </Title>
      <Paragraph>
        Уважаемый {profile?.name || user?.displayName || "друг"}, Ваш аккаунт не обладает правами
        администратора.
      </Paragraph>
      <Paragraph>Вы можете связаться с поддержкой для получения доступа:</Paragraph>
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
    </BaseLayout>
  );
};
