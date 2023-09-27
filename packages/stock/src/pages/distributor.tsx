import React, { useEffect, useMemo } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Tooltip, Space, Empty, Typography } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { DistributionStatistic } from "../features/DistributionStatistic";
import { $distributors } from "common/src/services/api/holders";
import { useStore } from "effector-react";
import { StockList } from "common/src/components/StockList";
import {
  DistributorTransferType,
  HolderTransferType,
} from "common/src/components/TransferTypeSelect";
import { $holderTransfers, HolderTransferMap } from "common/src/services/api/holderTransfer";
import { BaseButtonProps } from "antd/es/button/button";

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

  const holderTransfers = useStore($holderTransfers);
  const currentHolderTransfers = useMemo(
    () =>
      holderTransfers.filter((transfer) => {
        return transfer.fromHolderId === distributorId || transfer.toHolderId === distributorId;
      }),
    [holderTransfers, distributorId]
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
        <Divider type="vertical" />
      </>
    );
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
            {getButtonWithTooltip(HolderTransferType.installments, "primary")}
            {getButtonWithTooltip(HolderTransferType.sale)}
            {getButtonWithTooltip(HolderTransferType.report)}
            {getButtonWithTooltip(HolderTransferType.return)}
          </Space>
          <Divider dashed />
          <Typography.Title level={3}> Подотчетные книги у распространителя:</Typography.Title>
          <StockList currentUser={currentUser} holderBooks={currentDistributor.books || {}} />
          <Divider dashed />

          <DistributionStatistic holderTransfers={currentHolderTransfers} />
        </>
      )}
    </BaseLayout>
  );
};
