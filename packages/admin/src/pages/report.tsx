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
import { addOperationTransaction } from "common/src/services/api/transactions";

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
  console.log(useUsers)

  const onUserChange = useDebouncedCallback((value: string) => {
    setUserSearchString(value);
    
  }, 1000);
<<<<<<< HEAD
  const { favoriteBooks, otherBooks } = books.reduce(
    ({ favoriteBooks, otherBooks }, book) => {
      if (book.name.toLowerCase().includes(searchString)) {
        if (favorite.includes(book.id)) {
          favoriteBooks.push(book);
        } else {
          otherBooks.push(book);
        }
      }

      return { favoriteBooks, otherBooks };
    },
    { favoriteBooks: [] as Book[], otherBooks: [] as Book[] }
  );

  const onAddNewLocation = () => {
    addLocation({
      name: locationSearchString,
    });
    setLocationSearchString("");
  };

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  function onFinish(formValues: FormValues) {
    if (user && profile?.name) {
=======

  function onFinish(formValues: ReportFormValues) {
    if (user && profile?.name && formValues.userId) {
>>>>>>> ae6861e89d8309f3f9b00b45701ad3af5fba60b5
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
<<<<<<< HEAD
        userName:
          usersDocData?.find((value) => value.id === userId)?.name && usersDocData?.find((value) => value.id === userId)?.nameSpiritual  || "",
=======
        userName: usersDocData?.find((value) => value.id === userId)?.name || "",
>>>>>>> ae6861e89d8309f3f9b00b45701ad3af5fba60b5
        books: operationBooks,
        totalCount,
        totalPoints,
        isAuthorized: true,
        isOnline,
      };

      addOperationTransaction(operation)
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
