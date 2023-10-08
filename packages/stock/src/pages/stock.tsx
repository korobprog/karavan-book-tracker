import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Typography } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { HolderTransferList } from "common/src/components/HolderTransferList";
import { StockList } from "common/src/components/StockList";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useStore } from "effector-react";
import { $stock } from "common/src/services/api/holders";

type Props = {
  currentUser: CurrentUser;
};

export const Stock = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const stock = useStore($stock);
  const stockBooks = stock?.books || {};

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
      <Typography.Title className="site-page-title" level={2}>
        {stock?.name}
      </Typography.Title>

      <Button block size="large" type="primary" icon={<PlusCircleOutlined />} onClick={onEditStock}>
        Изменить книги на складе
      </Button>

      <Divider dashed />
      <HolderTransferList title="Последние операции:" />

      <Divider dashed />
      <StockList currentUser={currentUser} holderBooks={stockBooks} title="Книги на складе:" />
    </BaseLayout>
  );
};
