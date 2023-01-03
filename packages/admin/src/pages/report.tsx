import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Form, Select } from "antd";

import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { addOperation, OperationDoc } from "common/src/services/api/operations";
import { useLocations } from "common/src/services/api/locations";
import { useDebouncedCallback } from "use-debounce";
import { UserSelect } from "common/src/components/UserSelect";
import { useUsers } from "common/src/services/api/useUsers";
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

const Report = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;
  const { addStatistic } = useUser({ profile });

  const [userSearchString, setUserSearchString] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { locations } = useLocations({});
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

      const { operationBooks, totalCount, totalPoints } =
        calcBooksCountsFromValues(formValues);

      if (totalCount === 0) {
        setIsSubmitting(false);
        return;
      }

      const operation: OperationDoc = {
        userId,
        date: date.format(),
        locationId,
        userName:
          usersDocData?.find((value) => value.id === userId)?.name || "",
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: true,
        isOnline,
      };

      Promise.all([
        addOperation(operation),
        // TODO: вынести в transactions
        operation.isAuthorized &&
          addStatistic({ count: totalCount, points: totalPoints }, userId),
        addOperationToLocationStatistic(operation, locations),
      ])
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
            <Form.Item
              name="userId"
              label="Пользователь"
              rules={[{ required: true }]}
            >
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
