import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Form, Select } from "antd";

import { routes } from "../shared/routes";
import { OperationDoc } from "common/src/services/api/operations";
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
import { addOperationMultiAction } from "common/src/services/api/multiactions";

type Props = {
  currentUser: CurrentUser;
};

const Report = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

  const [userSearchString, setUserSearchString] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { usersDocData } = useUsers({
    searchString: userSearchString,
  });

  const onUserChange = useDebouncedCallback((value: string) => {
    setUserSearchString(value);
  }, 1000);

  function onFinish(formValues: ReportFormValues) {
    if (user && profile?.name && formValues.userId) {
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
        isAuthorized: totalCount <= 100 || profile?.role?.includes('authorized') ? true : false,
        isOnline,
        yatraLocationId: profile?.yatraLocationId || "",
      };

      addOperationMultiAction(operation)
        .then(() => navigate(routes.reports))
        .finally(() => setIsSubmitting(false));
    }
  }

  const usersOptions = usersDocData?.map((d) => (
    <Select.Option key={d.id}>
      {d.name} {d.nameSpiritual}
    </Select.Option>
  ));

  const { Title } = Typography;

  return (
    <BaseLayout title="УЧЕТ КНИГ (АДМИН)" backPath={routes.root}>
      <ReportForm
        currentUser={currentUser}
        onFinish={onFinish}
        isSubmitting={isSubmitting}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        userSelect={
          <>
            <Title className="site-page-title" level={4}>
              Отметить распространненные книги
            </Title>
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
    </BaseLayout>
  );
};

export default Report;
