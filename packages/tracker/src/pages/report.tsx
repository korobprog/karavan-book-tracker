import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { addOperation, OperationDoc } from "common/src/services/api/operations";
import { useLocations } from "common/src/services/api/locations";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { addOperationToLocationStatistic } from "common/src/services/locations";
import { BaseLayout } from "common/src/components/BaseLayout";
import {
  calcBooksCountsFromValues,
  ReportForm,
  ReportFormValues,
} from "common/src/components/forms/report";

type Props = {
  currentUser: CurrentUser;
};

export const Report = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const { addStatistic } = useUser({ profile });
  const [isOnline, setIsOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { locations } = useLocations({});

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  function onFinish(formValues: ReportFormValues) {
    if (user && profile?.name) {
      setIsSubmitting(true);
      const { operationBooks, totalCount, totalPoints } =
        calcBooksCountsFromValues(formValues);
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

      Promise.all([
        addStatistic({ count: totalCount, points: totalPoints }),
        addOperation(operation),
        addOperationToLocationStatistic(operation, locations),
      ])
        .then(() => navigate(routes.statistic))
        .finally(() => setIsSubmitting(false));
    }
  }

  return (
    <BaseLayout
      title="ОТМЕТИТЬ КНИГИ"
      backPath={routes.root}
      userDocLoading={userDocLoading}
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
