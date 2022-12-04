import React from "react";
import { Typography, Spin, Avatar, Space } from "antd";
import BbtLogo from "common/src/images/bbt-logo.png";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

type Props = {
  currentUser: CurrentUser;
};

export const Loading = ({ currentUser }: Props) => {
  const { Title } = Typography;

  return (
    <div className="loading-appearance">
      <div className="loading-page">
        <Title className="site-page-title loading-title" level={2}>
          <Space>
            <Avatar src={BbtLogo} />
            Добро пожаловать
            <Spin />
          </Space>
        </Title>
      </div>
    </div>
  );
};
