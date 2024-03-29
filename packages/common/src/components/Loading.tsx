import React from "react";
import { Typography, Spin, Avatar, Space } from "antd";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import Logo from "../images/logo.png";

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
            <Avatar src={Logo} />
            Добро пожаловать
            <Spin />
          </Space>
        </Title>
      </div>
    </div>
  );
};
