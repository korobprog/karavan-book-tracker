import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { StockForm } from "common/src/components/forms/stock/StockForm";
import { Divider } from "antd";
import {
  StockFormValues,
  calcBooksCountsFromValues,
} from "common/src/components/forms/stock/helpers";

type Props = {
  currentUser: CurrentUser;
};

export const StockEdit = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onFinish(formValues: StockFormValues) {
    if (user && profile?.name && formValues.userId) {
      setIsSubmitting(true);
      const { transferType, userId, date } = formValues;

      const { operationBooks, totalCount, totalPoints } = calcBooksCountsFromValues(formValues);

      if (totalCount === 0) {
        setIsSubmitting(false);
        return;
      }

      console.log(formValues);
      // const operation: OperationDoc = {
      //   userId,
      //   date: date.format(),
      //   transferType,
      //   userName: usersDocData?.find((value) => value.id === userId)?.name || "",
      //   books: operationBooks,
      //   totalCount,
      //   totalPoints,
      //   isAuthorized: totalCount <= 100 || profile?.role?.includes("authorized") ? true : false,
      //   isOnline,
      //   yatraLocationId: usersDocData?.find((value) => value.id === userId)?.yatraLocationId,
      // };

      // addOperationMultiAction(operation)
      //   .then(() => navigate(routes.reports))
      //   .finally(() => setIsSubmitting(false));
    }
  }

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  return (
    <BaseLayout
      title="Склад книг"
      backPath={routes.stock}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Divider dashed />
      <StockForm currentUser={currentUser} onFinish={onFinish} isSubmitting={isSubmitting} />
    </BaseLayout>
  );
};
