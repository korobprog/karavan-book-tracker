import { useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { Divider } from "antd";
import { useStore } from "effector-react";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { DistributorTransferForm } from "common/src/components/forms/stock";
import {
  DistributorTransferFormValues,
  calcBooksCountsFromValues,
} from "common/src/components/forms/stock/helpers";
import { $distributors, $stock, updateHolder } from "common/src/services/api/holders";
import { HolderTransferDoc, addHolderTransfer } from "common/src/services/api/holderTransfer";

type Props = {
  currentUser: CurrentUser;
};

export const DistributorTransfer = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stock = useStore($stock);

  const { distributorId } = useParams<{ distributorId: string }>();
  const distributors = useStore($distributors);
  const currentDistributor = distributors.find((value) => value.id === distributorId);

  function onFinish(formValues: DistributorTransferFormValues) {
    console.log("🚀 ~ onFinish ~ formValues:", formValues);
    if (user && profile?.name && stock && distributorId) {
      setIsSubmitting(true);
      const { date, transferType } = formValues;

      const newBooks = calcBooksCountsFromValues(formValues);

      const holderTransfer: HolderTransferDoc = {
        userId: profile.id,
        date: date.format(),
        type: transferType,
        fromHolderId: stock.id,
        toHolderId: distributorId,
        books: newBooks.operationBooks,
      };

      const sumObjectValues = (obj1: Record<string, number>, obj2: Record<string, number>) => {
        return Object.entries(obj2).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: (acc[key] || 0) + value }),
          { ...obj1 }
        );
      };

      const booksSum = sumObjectValues(currentDistributor?.books || {}, newBooks.operationBooks);

      // TODO: Списать со своего склада
      Promise.all([
        updateHolder(distributorId, { books: booksSum }),
        addHolderTransfer(holderTransfer),
      ])
        .then(() => navigate(generatePath(routes.distributor, { distributorId })))
        .finally(() => setIsSubmitting(false));
    }
  }

  const title = "Выдать книги";

  return (
    <BaseLayout
      title={title}
      backPath={routes.distributors}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Divider dashed />
      <DistributorTransferForm
        currentUser={currentUser}
        onFinish={onFinish}
        isSubmitting={isSubmitting}
      />
    </BaseLayout>
  );
};
