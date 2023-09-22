import React, { useEffect } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Tooltip, Space, Empty, Typography } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { DistributionStatistic } from "../features/DistributionStatistic";
import { $distributors } from "common/src/services/api/holders";
import { useStore } from "effector-react";
import { StockList } from "common/src/components/StockList";

type Props = {
  currentUser: CurrentUser;
};

export const Distributor = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const { distributorId } = useParams<{ distributorId: string }>();
  const distributors = useStore($distributors);
  const currentDistributor = distributors.find((value) => value.id === distributorId);

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const onTransferNavigate = () => {
    navigate(generatePath(routes.distributorTransfer, { distributorId }));
  };

  return (
    <BaseLayout
      title={currentDistributor?.name || "Распространитель не найден"}
      backPath={routes.distributors}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      {!currentDistributor || !distributorId ? (
        <Empty />
      ) : (
        <>
          <Space>
            <Tooltip title="Выдать под распространение - позже получившему за них нужно будет отчитаться">
              <Button type="primary" block size="large" onClick={onTransferNavigate}>
                Выдать
              </Button>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Выдать и сразу рассчитаться - книги сразу считаются как распространенные">
              <Button block size="large" onClick={onTransferNavigate}>
                Продать
              </Button>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip
              title="Принять отчет по выданным ранее книгам - снимает с баланса санкиртанщика и добавляет в
        распространенные"
            >
              <Button block size="large" onClick={onTransferNavigate}>
                Отчет
              </Button>
            </Tooltip>
          </Space>
          <Divider dashed />
          <Typography.Title level={3}> Книги на складе:</Typography.Title>
          <StockList currentUser={currentUser} holderBooks={currentDistributor.books || {}} />
          <Divider dashed />

          <DistributionStatistic />
        </>
      )}
    </BaseLayout>
  );
};
