import React from "react";
import { Button, Divider, Typography } from "antd";
import {
  ReadOutlined,
  TeamOutlined,
  FlagOutlined,
  BookOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";

type Props = {
  currentUser: CurrentUser;
};

const Home = ({ currentUser }: Props) => {
  const { user, profile } = currentUser;
  const navigate = useTransitionNavigate();
  const onAddReport = () => {
    navigate(routes.reports);
  };
  const onLocationsSelect = () => {
    navigate(routes.locations);
  };
  const onUsersSelect = () => {
    navigate(routes.users);
  };

  const { Title } = Typography;

  return (
    <BaseLayout title="Karavan Book Tracker" isAdmin avatar={profile?.avatar}>
      <Title className="site-page-title" level={2}>
        Привет,
        <br />
        {profile?.nameSpiritual || profile?.name || user?.displayName || "друг"}
      </Title>
      <Title className="site-page-subtitle" level={5}>
        Удачной санкиртаны!
      </Title>
      <Button type="primary" block size="large" icon={<ReadOutlined />} onClick={onAddReport}>
        Последние операции
      </Button>
      <Divider dashed />
      <Button block size="large" icon={<TeamOutlined />} onClick={onUsersSelect}>
        Пользователи
      </Button>
      <Divider dashed />
      <Button block size="large" icon={<TrophyOutlined />} onClick={() => navigate(routes.teams)}>
        Команды
      </Button>
      <Divider dashed />
      <Button block size="large" icon={<FlagOutlined />} onClick={onLocationsSelect}>
        Города
      </Button>
      <Divider />
      <Button
        href="https://sankirtana-map.web.app"
        block
        size="large"
        icon={<EnvironmentOutlined />}
        type="dashed"
        target="_blank"
      >
        Общая статистика на карте
      </Button>
      <Divider />
      <Button
        href="https://karavan-book-tracker.web.app/"
        block
        size="large"
        icon={<BookOutlined />}
        type="dashed"
      >
        Перейти в трекер
      </Button>
    </BaseLayout>
  );
};

export default Home;
