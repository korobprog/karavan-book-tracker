import React, { useEffect } from "react";
import { Typography, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { AuthEmail } from "common/src/features/auth/AuthEmail";
import { AuthGoogle } from "common/src/features/auth/AuthGoogle";
import { AuthSMS } from "common/src/features/auth/AuthSMS";

type Props = {
  currentUser: CurrentUser;
};

export const Auth = ({ currentUser }: Props) => {
  const { user } = currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(routes.root);
    }
  }, [navigate, user]);

  const { Title } = Typography;

  return (
    <BaseLayout title="УЧЕТ КНИГ" headerActions={[]}>
      <Title className="site-page-title" level={2}>
        ВХОД В УЧЕТ КНИГ С ПОМОЩЬЮ
      </Title>
      <Tabs
        defaultActiveKey="1"
        centered
        items={[
          {
            label: "SMS",
            key: "1",
            children: <AuthSMS currentUser={currentUser} />,
          },
          {
            label: "Google",
            key: "2",
            children: <AuthGoogle currentUser={currentUser} />,
          },
          {
            label: "eMail",
            key: "3",
            children: <AuthEmail currentUser={currentUser} />,
          },
        ]}
      />
    </BaseLayout>
  );
};
