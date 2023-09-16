import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Tooltip, Space } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { DistributionStatistic } from "../features/DistributionStatistic";

type Props = {
  currentUser: CurrentUser;
};

export const Distributor = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const { distributorId } = useParams<{ distributorId: string }>();

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  return (
    <BaseLayout
      title={distributorId || "Распространитель"}
      backPath={routes.distributors}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Space>
        <Tooltip title="Выдать под распространение - позже получившему за них нужно будет отчитаться">
          <Button type="primary" block size="large" onClick={() => navigate(routes.root)}>
            Выдать
          </Button>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="Выдать и сразу рассчитаться - книги сразу считаются как распространенные">
          <Button block size="large" onClick={() => navigate(routes.root)}>
            Продать
          </Button>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip
          title="Принять отчет по выданным ранее книгам - снимает с баланса санкиртанщика и добавляет в
        распространенные"
        >
          <Button block size="large" onClick={() => navigate(routes.root)}>
            Отчет
          </Button>
        </Tooltip>
      </Space>
      <Divider dashed />
      <DistributionStatistic />
    </BaseLayout>
  );
};
