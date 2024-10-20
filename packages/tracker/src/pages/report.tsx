import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";

import { routes } from "../shared/routes";
import { OperationDoc } from "common/src/services/api/operations";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import {
  calcBooksCountsFromValues,
  ReportForm,
  ReportFormValues,
} from "common/src/components/forms/report";
import { addOperationMultiAction } from "common/src/services/api/multiactions";

type Props = {
  currentUser: CurrentUser;
};

export const Report = ({ currentUser }: Props) => {
  const { t } = useTranslation();
  const { profile, user, loading, userDocLoading } = currentUser;
  const [isOnline, setIsOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  function onFinish(formValues: ReportFormValues) {
    if (user && profile?.name) {
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
        yatraLocationId: profile?.yatraLocationId,
        locationId,
        userName: profile?.name || "",
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: totalCount <= 100 || profile?.role?.includes("authorized") ? true : false,
        isOnline,
      };

      addOperationMultiAction(operation)
        .then(() => navigate(routes.statistic))
        .finally(() => setIsSubmitting(false));
    }
  }

  return (
    <BaseLayout
      title={t("home.report")}
      backPath={routes.root}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <ReportForm
        currentUser={currentUser}
        onFinish={onFinish}
        isSubmitting={isSubmitting}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
      />
    </BaseLayout>
  );
};
