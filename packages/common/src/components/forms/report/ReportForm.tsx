import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import {
  Button,
  List,
  Input,
  InputNumber,
  Form,
  Select,
  Checkbox,
  Row,
  Space,
  DatePicker,
  Typography,
  message,
} from "antd";
import { PlusOutlined, MinusOutlined, StarFilled, StarOutlined } from "@ant-design/icons";

import { useUser } from "common/src/services/api/useUser";
import * as storage from "common/src/services/localStorage/reportBooks";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { useDebouncedCallback } from "use-debounce";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $books, $booksLoading, Book } from "common/src/services/books";
import { LocationSelect } from "common/src/components/LocationSelect";
import moment from "moment";
import { calcBooksCountsFromValues, calcFormValuesFromBooks, ReportFormValues } from "./helpers";

type Props = {
  currentUser: CurrentUser;
  onFinish: (formValues: ReportFormValues) => void;
  isSubmitting?: boolean;
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
  userSelect?: React.ReactNode;
  initialValues?: ReportFormValues;
};

export const ReportForm = (props: Props) => {
  const {
    currentUser,
    onFinish,
    isSubmitting,
    isOnline,
    setIsOnline,
    userSelect,
    initialValues: initialValuesProps,
  } = props;
  const { profile, favorite, userDocLoading } = currentUser;
  const { toggleFavorite } = useUser({ profile });
  const [searchString, setSearchString] = useState("");
  const [locationSearchString, setLocationSearchString] = useState("");

  const books = useStore($books);
  const booksLoading = useStore($booksLoading);

  const { locations } = useLocations({
    searchString: locationSearchString,
  });

  const booksStorageInitialValues = calcFormValuesFromBooks(storage.getReportBooks());

  const initialValues = {
    date: moment(),
    locationId: storage.getLocationId(),
    ...initialValuesProps,
  };

  useEffect(() => {
    if (!initialValuesProps) {
      form.setFieldsValue(booksStorageInitialValues);
    }
  }, []);

  const { date, locationId, userId, ...booksPropsInitialValues } =
    initialValuesProps || ({} as ReportFormValues);

  const getInitialBooks = (booksValues: Record<number, number>) => {
    return Object.values(booksValues).reduce((acc, value) => acc + value, 0);
  };

  const [totalBooksCount, setTotalBooksCount] = useState(
    getInitialBooks(booksPropsInitialValues) || getInitialBooks(booksStorageInitialValues)
  );

  // TODO: make uncontrolled
  const onOnlineChange = () => {
    setIsOnline(!isOnline);
  };

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

  const { favoriteBooks, otherBooks } = books.reduce(
    ({ favoriteBooks, otherBooks }, book) => {
      if (favorite.includes(book.id)) {
        favoriteBooks.push(book);
      } else {
        otherBooks.push(book);
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

  const onValuesChange = () => {
    const formValues: ReportFormValues = form.getFieldsValue();
    const { totalCount, operationBooks } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
    storage.setReportBooks(operationBooks);
    storage.setLocationId(formValues.locationId);
  };

  const onBooksReset = () => {
    form.resetFields();
    const formValues: ReportFormValues = form.getFieldsValue();
    const { totalCount } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
    storage.setReportBooks([]);
  };

  const locationOptions = locations?.map((d) => <Select.Option key={d.id}>{d.name}</Select.Option>);

  const { Search } = Input;

  const [form] = Form.useForm();

  const onPlusClick = (bookId: string) => {
    const prevValue = form.getFieldValue(bookId) || 0;
    form.setFieldsValue({ [bookId]: prevValue + 1 });
    onValuesChange();
  };

  const onMinusClick = (bookId: string) => {
    const prevValue = form.getFieldValue(bookId) || 0;
    if (prevValue !== 0) {
      form.setFieldsValue({ [bookId]: prevValue - 1 });
      onValuesChange();
    }
  };

  const onFinishHandler = (formValues: ReportFormValues) => {
    if(totalBooksCount > 100 && !profile?.role?.includes('authorized')){
      message.warning({
        content: 'Спасибо, ваша операция добавлена, но еще не подтверждена. Мы свяжемся с вами в ближайшее время для подтверждения.',
        duration: 5,
        style: {
          marginTop: '10vh',
          fontSize: 'medium',
        },
      });
    }
    onFinish(formValues);
    storage.setReportBooks([]);
  }

  const renderBookItem = (book: Book, isFavorite: boolean) => {
    return book.name.toLowerCase().includes(searchString) ? (
      <List.Item>
            <Button
            onClick={() => toggleFavorite(book.id)}
            icon={isFavorite ? <StarFilled /> : <StarOutlined />}
            disabled={isSubmitting || userDocLoading}
            style={{ marginRight: 8 }}
          />
        <List.Item.Meta
          title={book.name}
          description={book.points ? `Баллы: ${book.points}` : ""}
        />
        <Space>
          <Button onClick={() => onMinusClick(book.id)} icon={<MinusOutlined />} />
          <Form.Item name={book.id} noStyle>
            <InputNumber
              min={0}
              max={10000}
              style={{ width: 70 }}
              type="number"
              inputMode="numeric"
              pattern="\d*"
            />
          </Form.Item>
        <Button onClick={() => onPlusClick(book.id)} icon={<PlusOutlined />} />
        </Space>
      </List.Item>
    ) : (
      <Form.Item name={book.id} noStyle />
      );
  };

  return (
    <Form
      name="basic"
      onFinish={onFinishHandler}
      onFieldsChange={onValuesChange}
      form={form}
      initialValues={initialValues}
    >
      {userSelect}
      <Form.Item
        name="locationId"
        label="Место"
        rules={[
          {
            required: true,
            message: "Выберите или создайте новое место",
          },
        ]}
      >
        <LocationSelect
          onSearch={onLocationChange}
          onAddNewLocation={onAddNewLocation}
          locationSearchString={locationSearchString}
        >
          {locationOptions}
        </LocationSelect>
      </Form.Item>
      <Space style={{ flexGrow: 1, marginRight: 8 }}>
        <Form.Item name="date">
          <DatePicker
            disabledDate={(current) => {
              let customDate = moment().add(1, "day").format("YYYY-MM-DD");
              return current && current > moment(customDate, "YYYY-MM-DD");
            }}
            format="DD.MM.YYYY"
          />
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={onOnlineChange} checked={isOnline}>
            Онлайн-распространение
          </Checkbox>
        </Form.Item>
      </Space>

      <Form.Item>
        <Space>
          <Typography>
            Выбрано книг: <b>{totalBooksCount}</b>
          </Typography>
          <Button
            type="default"
            disabled={isSubmitting || userDocLoading || totalBooksCount === 0}
            onClick={onBooksReset}
          >
            Сбросить
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting || userDocLoading}
            disabled={totalBooksCount === 0}
          >
            {isSubmitting ? "Отправляем..." : "Отправить"}
          </Button>
        </Space>
      </Form.Item>

      <Row>
        <Search
          placeholder="поиск книги"
          allowClear
          onChange={onSearchChange}
          value={searchString}
          style={{ flexGrow: 1, width: 200, marginRight: 8 }}
        />
      </Row>
      
      <List
        itemLayout="horizontal"
        dataSource={favoriteBooks}
        loadMore={booksLoading}
        locale={{
          emptyText: searchString
            ? "Не найдено избранного"
            : "Нажмите на ⭐, чтобы добавить в избранное",
        }}
        renderItem={(book) => renderBookItem(book, true)}
      />
      <List
        itemLayout="horizontal"
        dataSource={otherBooks}
        loading={booksLoading || userDocLoading}
        locale={{ emptyText: "Не найдено книг" }}
        renderItem={(book) => renderBookItem(book, false)}
      />
    </Form>
  );
};
