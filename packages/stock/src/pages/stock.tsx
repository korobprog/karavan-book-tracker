import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Typography } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { HolderTransferList } from "common/src/components/HolderTransferList";
import { StockList } from "common/src/components/StockList";
import { PlusCircleOutlined } from "@ant-design/icons";

type Props = {
  currentUser: CurrentUser;
};

export const Stock = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();

  const onEditStock = () => {
    navigate(routes.stockEdit);
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  return (
    <BaseLayout
      title="Склад книг"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Button block size="large" type="primary" icon={<PlusCircleOutlined />} onClick={onEditStock}>
        Изменить книги на складе
      </Button>

      <Divider dashed />
      <Typography.Title level={3}>Последние операции:</Typography.Title>
      <HolderTransferList currentUser={currentUser} />

      <Divider dashed />
      <Typography.Title level={3}> Книги на складе:</Typography.Title>
      <StockList currentUser={currentUser} />
    </BaseLayout>
  );
};
