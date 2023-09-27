import { useState } from "react";
import { generatePath, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { $stock } from "common/src/services/api/holders";
import {
  HolderTransferDoc,
  HolderTransferMap,
  HolderTransferType,
} from "common/src/services/api/holderTransfer";
import { addHolderTransferMultiAction } from "common/src/services/api/stockMultiactions";
import { DistributorTransferType } from "common/src/components/TransferTypeSelect";

type Props = {
  currentUser: CurrentUser;
};

export const DistributorTransfer = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stock = useStore($stock);

  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam =
    (searchParams.get("type") as DistributorTransferType) || HolderTransferType.installments;

  const onTypeChange = (value: DistributorTransferType) => {
    setSearchParams({ type: value });
  };

  const { distributorId } = useParams<{ distributorId: string }>();
  const backPath = generatePath(routes.distributor, { distributorId });

  function onFinish(formValues: DistributorTransferFormValues) {
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

      addHolderTransferMultiAction(holderTransfer)
        .then(() => navigate(backPath))
        .finally(() => setIsSubmitting(false));
    }
  }

  const title = HolderTransferMap[typeParam].title;

  return (
    <BaseLayout title={title} backPath={backPath} userDocLoading={userDocLoading} avatar={avatar}>
      <Divider dashed />
      <DistributorTransferForm
        currentUser={currentUser}
        onFinish={onFinish}
        isSubmitting={isSubmitting}
        typeParam={typeParam}
        onTypeChange={onTypeChange}
      />
    </BaseLayout>
  );
};
