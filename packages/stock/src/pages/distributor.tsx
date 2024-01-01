import React, { useCallback, useEffect, useMemo } from "react";
import { generatePath, useParams } from "react-router-dom";
import { Button, Divider, Tooltip, Space, Empty, Statistic } from "antd";
import { BaseButtonProps } from "antd/es/button/button";
import { useStore } from "effector-react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { DistributionStatistic } from "../features/DistributionStatistic";
import { $distributors, $stock } from "common/src/services/api/holders";
import { StockList } from "common/src/components/StockList";
import {
  DistributorTransferType,
  HolderTransferType,
} from "common/src/components/TransferTypeSelect";
import {
  $holderTransfers,
  HolderTransferMap,
  HolderTransferDoc,
} from "common/src/services/api/holderTransfer";
import { WithId } from "common/src/services/api/refs";
import { HolderTransferList } from "common/src/components/HolderTransferList";
import { calcTotalBooksAndSum } from "common/src/components/forms/stock/helpers";

type Props = {
  currentUser: CurrentUser;
};

export const Distributor = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const { distributorId } = useParams<{ distributorId: string }>();
  const distributors = useStore($distributors);
  const stock = useStore($stock);
  const currentDistributor = distributors.find((value) => value.id === distributorId);

  const holderTransfers = useStore($holderTransfers);

  const transferFilter = useCallback(
    ({ fromHolderId, toHolderId }: WithId<HolderTransferDoc>): boolean => {
      return fromHolderId === distributorId || toHolderId === distributorId;
    },
    [distributorId]
  );

  const currentHolderTransfers = useMemo(
    () => holderTransfers.filter(transferFilter),
    [holderTransfers, transferFilter]
  );

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const onTransferNavigate = (operationType: DistributorTransferType) => () => {
    const path = generatePath(routes.distributorTransfer, { distributorId });
    navigate(`${path}?type=${operationType}`);
  };

  const getButtonWithTooltip = (
    operationType: DistributorTransferType,
    buttonType?: BaseButtonProps["type"]
  ) => {
    const { description, title, icon: Icon } = HolderTransferMap[operationType];

    return (
      <>
        <Tooltip title={description}>
          <Button
            type={buttonType}
            onClick={onTransferNavigate(operationType)}
            block
            size="large"
            icon={<Icon />}
          >
            {title}
          </Button>
        </Tooltip>
      </>
    );
  };

  const { totalCount = 0, totalPrice = 0 } =
    stock && distributorId ? calcTotalBooksAndSum(stock, distributorId) : {};

  const account = (distributorId && stock?.distributors?.[distributorId].account) || 0;

  return (
    <StockBaseLayout
      title={currentDistributor?.name || "Распространитель не найден"}
      backPath={routes.distributors}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      {!currentDistributor || !distributorId || !stock ? (
        <Empty />
      ) : (
        <>
          <Space wrap>
            {getButtonWithTooltip(HolderTransferType.installments, "primary")}
            {getButtonWithTooltip(HolderTransferType.sale)}
            {getButtonWithTooltip(HolderTransferType.return)}
            {getButtonWithTooltip(HolderTransferType.report)}
            {getButtonWithTooltip(HolderTransferType.reportByMoney)}
          </Space>

          <Divider dashed />
          {<Statistic title="Счет санкиртанщика" value={`${account} руб.`} />}

          <Divider dashed />

          <HolderTransferList
            transferFilter={transferFilter}
            title="Последние операции:"
            isReverseColor
          />
          <Divider dashed />

          <StockList
            title={`Книги на руках: ${totalCount} шт. на ${totalPrice} руб.`}
            currentUser={currentUser}
            holderBooks={stock.distributors?.[distributorId].books || {}}
            prices={stock.bookPrices}
            priceMultiplier={
              stock.distributors?.[distributorId].priceMultiplier || stock.priceMultiplier
            }
          />
          <Divider dashed />

          <DistributionStatistic holderTransfers={currentHolderTransfers} />
        </>
      )}
    </StockBaseLayout>
  );
};
