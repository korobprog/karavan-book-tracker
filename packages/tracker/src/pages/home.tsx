import React from "react";
import { Button, Divider, Typography } from "antd";
import { useTranslation } from "react-i18next";
import {
  ReadOutlined,
  UserAddOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import config from "../../package.json";

type Props = {
  currentUser: CurrentUser;
};

export const Home = ({ currentUser }: Props) => {
  const { t } = useTranslation();
  const { userDocLoading, profile, user } = currentUser;
  const navigate = useTransitionNavigate();

  const onAddReport = () => {
    navigate(routes.report);
  };
  const avatar = profile?.avatar;
  const { Paragraph, Title } = Typography;

  return (
    <BaseLayout
      title="Karavan Book Tracker"
      userDocLoading={userDocLoading}
      avatar={avatar}
      version={config.version}
    >
      <Title className="site-page-title" level={2}>
        {t("home.hello")},
        <br />
        {profile?.nameSpiritual || profile?.name || user?.displayName || "друг"}
      </Title>
      <Title className="site-page-subtitle" level={5}>
        {t("home.happy_sankirtana")}
      </Title>
      <Button type="primary" block size="large" icon={<ReadOutlined />} onClick={onAddReport}>
        {t("home.report")}
      </Button>
      <Divider dashed />
      <Button
        block
        size="large"
        icon={<BarChartOutlined />}
        onClick={() => navigate(routes.statistic)}
      >
        {t("home.my_statistic")}
      </Button>
      <Divider dashed />
      <Button block size="large" icon={<TeamOutlined />} onClick={() => navigate(routes.team)}>
        {t("home.my_team")}
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
        {t("home.map")}
      </Button>
      <Divider dashed />
      <Button
        block
        size="large"
        icon={<WalletOutlined />}
        onClick={() => navigate(routes.pageDonations)}
      >
        {t("home.donations")}
      </Button>
      <Divider dashed />
      <Paragraph>{t("home.second-wave.help")}</Paragraph>
      <Button
        href="http://san.bhakti-vriksha.ru/"
        target="_blank"
        block
        size="large"
        icon={<UserAddOutlined />}
        type="dashed"
      >
        {t("home.second-wave")}
      </Button>
      <Divider dashed />
      <Button
        onClick={() => navigate(routes.contactUs)}
        target="_blank"
        block
        size="large"
        icon={<MessageOutlined />}
        type="link"
      >
        {t("home.contact")}
      </Button>
      <Divider dashed />
    </BaseLayout>
  );
};
