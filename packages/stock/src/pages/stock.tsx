import React, { useEffect } from "react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { Button, Divider, Typography } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { StockBaseLayout } from "../shared/StockBaseLayout";
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
  const navigate = useTransitionNavigate();
  const stock = useStore($stock);
  const stockBooks = stock?.books || {};
  const stockBookPrices = stock?.bookPrices || {};

  const onEditStock = () => {
    navigate(routes.stockEdit);
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  return (
    <StockBaseLayout
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
      <StockList
        title="Книги на складе:"
        currentUser={currentUser}
        holderBooks={stockBooks}
        prices={stockBookPrices}
        priceMultiplier={stock?.priceMultiplier}
      />

      <Divider dashed />
      <HolderTransferList title="Последние операции:" />
    </StockBaseLayout>
  );
};
