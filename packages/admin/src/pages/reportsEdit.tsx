import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Form, Select } from "antd";
import moment from "moment";

import { routes } from "../shared/routes";
import { OperationDoc, useOperation } from "common/src/services/api/operations";
import { useDebouncedCallback } from "use-debounce";
import { UserSelect } from "common/src/components/UserSelect";
import { useUsers } from "common/src/services/api/useUsers";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import {
  calcBooksCountsFromValues,
  ReportForm,
  ReportFormValues,
} from "common/src/components/forms/report";
import { editOperationMultiAction } from "common/src/services/api/multiactions";
import { calcFormValuesFromBooks } from "common/src/components/forms/report/helpers";

type Props = {
  currentUser: CurrentUser;
};

export const ReportsEdit = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

  const [userSearchString, setUserSearchString] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const avatar = profile?.avatar;
  const { usersDocData } = useUsers({
    searchString: userSearchString,
  });

  const onUserChange = useDebouncedCallback((value: string) => {
    setUserSearchString(value);
  }, 1000);

  const { operationId } = useParams<{ operationId: string }>();
  const { operationDocData, loading: operationLoading } = useOperation(operationId);

  const initialValues: ReportFormValues | undefined = operationDocData
    ? {
        date: moment(operationDocData.date),
        locationId: operationDocData.locationId,
        userId: operationDocData.userId,
        ...calcFormValuesFromBooks(operationDocData.books),
      }
    : undefined;

  function onFinish(formValues: ReportFormValues) {
    if (user && profile?.name && formValues.userId && operationId) {
      setIsSubmitting(true);
      const { locationId, userId, date } = formValues;

      const { operationBooks, totalCount, totalPoints } = calcBooksCountsFromValues(formValues);

      if (totalCount === 0) {
        setIsSubmitting(false);
        return;
      }

      const operation: OperationDoc = {
        userId,
        date: date.format(),
        locationId,
        userName: usersDocData?.find((value) => value.id === userId)?.name || "",
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: totalCount <= 100 || profile?.role?.includes("authorized") ? true : false,
        isOnline,
      };

      editOperationMultiAction(operationId, operation)
        .then(() => navigate(routes.reports))
        .finally(() => setIsSubmitting(false));
    }
  }

  const usersOptions = usersDocData?.map((d) => (
    <Select.Option key={d.id}>
      {d.name} {d.nameSpiritual}
    </Select.Option>
  ));

  const loadingTitle = operationLoading ? "Загрузка" : "Операции не существует";

  return (
    <BaseLayout title="УЧЕТ КНИГ (АДМИН)" backPath={routes.reports} avatar={avatar}>
      {initialValues ? (
        <ReportForm
          currentUser={currentUser}
          onFinish={onFinish}
          isSubmitting={isSubmitting}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          initialValues={initialValues}
          userSelect={
            <>
              <Typography.Title className="site-page-title" level={4}>
                Редактирование операции
              </Typography.Title>
              <Form.Item name="userId" label="Пользователь" rules={[{ required: true }]}>
                <UserSelect
                  onSearch={onUserChange}
                  onAddNewUser={() => navigate(routes.usersNew)}
                  userSearchString={userSearchString}
                >
                  {usersOptions}
                </UserSelect>
              </Form.Item>
            </>
          }
        />
      ) : (
        <div>{loadingTitle}</div>
      )}
    </BaseLayout>
  );
};
