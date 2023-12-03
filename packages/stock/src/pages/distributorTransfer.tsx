import { useState } from "react";
import { generatePath, useParams, useSearchParams } from "react-router-dom";
import { Divider, Empty, Form } from "antd";
import { useStore } from "effector-react";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { DistributorTransferForm } from "common/src/components/forms/stock";
import {
  DistributorTransferFormValues,
  calcBooksCountsFromValues,
} from "common/src/components/forms/stock/helpers";
import { $distributors, $stock } from "common/src/services/api/holders";
import {
  HolderTransferDoc,
  HolderTransferMap,
  HolderTransferType,
  TransferFromDistributorTypes,
} from "common/src/services/api/holderTransfer";
import { addHolderTransferMultiAction } from "common/src/services/api/stockMultiactions";
import { DistributorTransferType } from "common/src/components/TransferTypeSelect";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";

type Props = {
  currentUser: CurrentUser;
};

export const DistributorTransfer = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stock = useStore($stock);
  const distributors = useStore($distributors);

  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam =
    (searchParams.get("type") as DistributorTransferType) || HolderTransferType.installments;

  const onTypeChange = (value: DistributorTransferType) => {
    setSearchParams({ type: value });
  };

  const { distributorId } = useParams<{ distributorId: string }>();
  const backPath = generatePath(routes.distributor, { distributorId });

  function onFinish(formValues: DistributorTransferFormValues, totalPrice: number) {
    if (user && profile?.name && stock && distributorId) {
      setIsSubmitting(true);
      const { date, transferType, priceMultiplier } = formValues;

      const newBooks = calcBooksCountsFromValues(formValues);

      const holderTransfer: HolderTransferDoc = {
        userId: profile.id,
        date: date.format(),
        type: transferType,
        fromHolderId: stock.id,
        toHolderId: distributorId,
        books: newBooks.operationBooks,
        priceMultiplier: priceMultiplier,
        totalPrice,
      };

      if (TransferFromDistributorTypes.includes(transferType)) {
        holderTransfer.fromHolderId = distributorId;
        holderTransfer.toHolderId = stock.id;
      }

      addHolderTransferMultiAction(holderTransfer, {}, priceMultiplier)
        .then(() => navigate(backPath))
        .finally(() => setIsSubmitting(false));
    }
  }

  const distributorName = distributors.find(({ id }) => id === distributorId)?.name;
  const distributorBooks = distributorId ? stock?.distributors?.[distributorId].books : undefined;

  const availableBooks = TransferFromDistributorTypes.includes(typeParam)
    ? distributorBooks
    : stock?.books;

  const title = HolderTransferMap[typeParam].title;
  const label = TransferFromDistributorTypes.includes(typeParam) ? "От кого:" : "Кому";

  return !distributorId || !stock ? (
    <Empty />
  ) : (
    <StockBaseLayout
      title={title}
      backPath={backPath}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Divider dashed />
      <Form.Item name="transferType" label={label}>
        {distributorName}
      </Form.Item>
      <DistributorTransferForm
        currentUser={currentUser}
        onFinish={onFinish}
        isSubmitting={isSubmitting}
        typeParam={typeParam}
        onTypeChange={onTypeChange}
        availableBooks={availableBooks}
        bookPrices={stock?.bookPrices || {}}
        priceMultiplier={
          stock?.distributors?.[distributorId].priceMultiplier || stock?.priceMultiplier || 1
        }
      />
    </StockBaseLayout>
  );
};
