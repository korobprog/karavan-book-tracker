import { useEffect, useState } from "react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { Divider } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { addHolderTransferMultiAction } from "common/src/services/api/stockMultiactions";
import { HolderTransferDoc, HolderTransferType } from "common/src/services/api/holderTransfer";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { StockForm } from "common/src/components/forms/stock/StockForm";
import {
  StockFormValues,
  calcBooksCountsFromValues,
} from "common/src/components/forms/stock/helpers";
import { useStore } from "effector-react";
import { $stock } from "common/src/services/api/holders";

type Props = {
  currentUser: CurrentUser;
};

export const StockEdit = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const stock = useStore($stock);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onFinish(formValues: StockFormValues) {
    if (user && profile?.name && stock) {
      setIsSubmitting(true);
      const { transferType, date, priceMultiplier } = formValues;

      const { operationBooks, totalCount, bookPrices } = calcBooksCountsFromValues(formValues);

      if (totalCount === 0 && transferType !== HolderTransferType.adjustment) {
        setIsSubmitting(false);
        return;
      }

      const holderTransfer: HolderTransferDoc = {
        userId: profile.id,
        date: date.format(),
        type: transferType,
        fromHolderId: null,
        toHolderId: stock?.id,
        books: operationBooks,
        priceMultiplier,
      };

      addHolderTransferMultiAction(holderTransfer, bookPrices, priceMultiplier)
        .then(() => navigate(routes.stock))
        .finally(() => setIsSubmitting(false));
    }
  }

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  return (
    <StockBaseLayout
      title="Склад книг"
      backPath={routes.stock}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Divider dashed />
      <StockForm
        currentUser={currentUser}
        onFinish={onFinish}
        isSubmitting={isSubmitting}
        availableBooks={stock?.books}
        bookPrices={stock?.bookPrices}
        initialValues={{ priceMultiplier: stock?.priceMultiplier }}
      />
    </StockBaseLayout>
  );
};
