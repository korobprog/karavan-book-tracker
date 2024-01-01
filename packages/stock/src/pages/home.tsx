import React from "react";
import { Button, Divider, Typography } from "antd";
import { ReadOutlined, TeamOutlined, BarChartOutlined } from "@ant-design/icons";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { DistributionStatistic } from "../features/DistributionStatistic";
import { useStore } from "effector-react";
import { $holderTransfers } from "common/src/services/api/holderTransfer";

type Props = {
  currentUser: CurrentUser;
};

export const Home = ({ currentUser }: Props) => {
  const { userDocLoading, profile, user } = currentUser;
  const holderTransfers = useStore($holderTransfers);

  const navigate = useTransitionNavigate();
  const onStockClick = () => {
    navigate(routes.stock);
  };
  const onDitributorsClick = () => {
    navigate(routes.distributors);
  };
  const onStatisticClick = () => {
    navigate(routes.statistic);
  };
  const avatar = profile?.avatar;
  const { Title } = Typography;

  const stockTitle = "Склад книг";

  return (
    <StockBaseLayout
      title="Book Stock"
      userDocLoading={userDocLoading}
      avatar={avatar}
      onAvatarClick={undefined}
    >
      <Title className="site-page-title" level={2}>
        Привет,
        <br />
        {profile?.nameSpiritual || profile?.name || user?.displayName || "друг"}
      </Title>
      <Divider dashed />
      <Button type="primary" block size="large" icon={<ReadOutlined />} onClick={onStockClick}>
        {stockTitle}
      </Button>
      <Divider dashed />
      <Button
        type="default"
        block
        size="large"
        icon={<TeamOutlined />}
        onClick={onDitributorsClick}
      >
        Распространители
      </Button>
      <Divider dashed />
      <Button
        type="default"
        block
        size="large"
        icon={<BarChartOutlined />}
        onClick={onStatisticClick}
      >
        Статистика по регионам
      </Button>
      <Divider dashed />
      <DistributionStatistic holderTransfers={holderTransfers} />
    </StockBaseLayout>
  );
};
