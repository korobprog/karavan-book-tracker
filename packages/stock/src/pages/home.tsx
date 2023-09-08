import React from "react";
import { Button, Divider, Typography } from "antd";
import { ReadOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Home = ({ currentUser }: Props) => {
  const { userDocLoading, profile, user } = currentUser;
  const navigate = useNavigate();
  const onStockClick = () => {
    navigate(routes.stock);
  };
  const avatar = profile?.avatar;
  const { Paragraph, Title } = Typography;

  return (
    <BaseLayout title="Karavan Book Tracker" userDocLoading={userDocLoading} avatar={avatar}>
      <Title className="site-page-title" level={2}>
        Привет,
        <br />
        {profile?.nameSpiritual || profile?.name || user?.displayName || "друг"}
      </Title>
      <Divider dashed />
      <Button type="primary" block size="large" icon={<ReadOutlined />} onClick={onStockClick}>
        Склад книг
      </Button>
      <Divider dashed />
      <Button type="default" block size="large" icon={<TeamOutlined />} onClick={onStockClick}>
        Выдача книг
      </Button>
    </BaseLayout>
  );
};
