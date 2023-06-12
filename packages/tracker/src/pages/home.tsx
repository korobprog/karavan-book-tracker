import React from "react";
import { Button, Divider, Typography } from "antd";
import {
  ReadOutlined,
  UserAddOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

export const Home = ({ currentUser }: Props) => {
  const { userDocLoading, profile } = currentUser;
  const navigate = useNavigate();
  const onAddReport = () => {
    navigate(routes.report);
  };
  const avatar = profile?.avatar;
  const { Paragraph } = Typography;

  return (
    <BaseLayout title="УЧЕТ КНИГ" userDocLoading={userDocLoading} avatar={avatar}>
      <Paragraph>Отметить распространненные книги</Paragraph>
      <Button type="primary" block size="large" icon={<ReadOutlined />} onClick={onAddReport}>
        Отметить книги
      </Button>
      <Divider dashed />
      <Button
        block
        size="large"
        icon={<BarChartOutlined />}
        onClick={() => navigate(routes.statistic)}
      >
        Моя статистика
      </Button>
      <Divider dashed />
      <Button block size="large" icon={<TeamOutlined />} onClick={() => navigate(routes.team)}>
        Моя команда
      </Button>
      <Divider dashed />
      <Button
        href="https://t.me/karavanBook_bot"
        target="_blank"
        block
        size="large"
        icon={<MessageOutlined />}
        type="dashed"
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
        type="dashed"
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
        type="dashed"
      >
        Вторая волна
      </Button>
      <Divider dashed />
    </BaseLayout>
  );
};
