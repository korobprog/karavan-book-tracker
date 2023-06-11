import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import { routes } from "../shared/routes";
import { OperationDoc, useOperation } from "common/src/services/api/operations";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import {
  calcBooksCountsFromValues,
  ReportForm,
  ReportFormValues,
} from "common/src/components/forms/report";
import { calcFormValuesFromBooks } from "common/src/components/forms/report/helpers";
import { editOperationMultiAction } from "common/src/services/api/multiactions";

type Props = {
  currentUser: CurrentUser;
};

export const ReportEdit = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;

  const { operationId } = useParams<{ operationId: string }>();
  const { operationDocData, loading: operationLoading } = useOperation(operationId);

  const [isOnline, setIsOnline] = useState(operationDocData?.isOnline || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const initialValues: ReportFormValues | undefined = operationDocData
    ? {
        date: moment(operationDocData.date),
        locationId: operationDocData.locationId,
        userId: operationDocData.userId,
        ...calcFormValuesFromBooks(operationDocData.books),
      }
    : undefined;

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  function onFinish(formValues: ReportFormValues) {
    if (user && profile?.name && operationId) {
      setIsSubmitting(true);
      const { operationBooks, totalCount, totalPoints } = calcBooksCountsFromValues(formValues);
      const { locationId, date } = formValues;

      if (totalCount === 0) {
        setIsSubmitting(false);
        return;
      }

      const operation: OperationDoc = {
        userId: user?.uid,
        date: date.format(),
        locationId,
        userName: profile?.name || "",
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: true,
        isOnline,
      };

      editOperationMultiAction(operationId, operation)
        .then(() => navigate(routes.statistic))
        .finally(() => setIsSubmitting(false));
    }
  }

  const loadingTitle = operationLoading ? "Загрузка" : "Операции не существует";

  return (
    <BaseLayout
      title="Изменить операцию"
      backPath={routes.statistic}
      userDocLoading={userDocLoading}
    >
      {initialValues ? (
        <ReportForm
          currentUser={currentUser}
          onFinish={onFinish}
          isSubmitting={isSubmitting}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          initialValues={initialValues}
        />
      ) : (
        <div>{loadingTitle}</div>
      )}
    </BaseLayout>
  );
};
