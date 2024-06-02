import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { useStore } from "effector-react";
import {
  Button,
  List,
  Input,
  InputRef,
  InputNumber,
  Form,
  Checkbox,
  Row,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  StarFilled,
  StarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import debounce from "lodash/debounce";

import { useUser } from "common/src/services/api/useUser";
import * as storage from "common/src/services/localStorage/reportBooks";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $books, $booksLoading, Book } from "common/src/services/books";
import moment from "moment";
import { calcBooksCountsFromValues, calcFormValuesFromBooks, ReportFormValues } from "./helpers";
import { SelectLocation } from "../../../features/select-location/SelectLocation";
import { DatePicker } from "../../DatePicker";
import { Helper } from "../../Helper";

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
  const [showOnliFirstBooks, setShowOnliFirstBooks] = useState(storage.getShowOnliFirstBooks());
  const searchRef = useRef<InputRef>(null);

  const onShowOnliFirstBooksChange = (flag: boolean) => {
    setShowOnliFirstBooks(flag);
    storage.setShowOnliFirstBooks(flag);
  };

  const books = useStore($books);
  const booksLoading = useStore($booksLoading);
  const booksStorageInitialValues = calcFormValuesFromBooks(storage.getReportBooks());

  const initialValues = useMemo(
    () => ({
      date: moment(),
      locationId: storage.getLocationId(),
      ...initialValuesProps,
    }),
    [initialValuesProps]
  );

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

  const { favoriteBooks, otherBooks, hiddenBooks } = useMemo(() => {
    const result = books.reduce(
      ({ favoriteBooks, otherBooks, hiddenBooks }, book) => {
        if (!book.name.toLowerCase().includes(searchString)) {
          hiddenBooks.push(book);
        } else {
          if (favorite.includes(book.id)) {
            favoriteBooks.push(book);
          } else {
            otherBooks.push(book);
          }
        }

        return { favoriteBooks, otherBooks, hiddenBooks };
      },
      { favoriteBooks: [] as Book[], otherBooks: [] as Book[], hiddenBooks: [] as Book[] }
    );

    if (showOnliFirstBooks) {
      result.favoriteBooks = result.favoriteBooks.slice(0, 3);
      result.otherBooks = result.otherBooks.slice(0, 3);
    }
    return result;
  }, [books, favorite, searchString, showOnliFirstBooks]);

  const debouncedSearch = useRef(
    debounce((e) => {
      setSearchString(e.target.value.toLowerCase());
    }, 200)
  ).current;

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const [form] = Form.useForm();

  const onValuesChange = useCallback(() => {
    const formValues: ReportFormValues = form.getFieldsValue();
    const { totalCount, operationBooks } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
    storage.setReportBooks(operationBooks);
    storage.setLocationId(formValues.locationId);
  }, [form]);

  const onBooksReset = () => {
    form.resetFields();
    const formValues: ReportFormValues = form.getFieldsValue();
    const { totalCount } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
    storage.setReportBooks([]);
  };

  const { Search } = Input;

  const onPlusClick = useCallback(
    (bookId: string) => {
      searchRef.current?.focus();
      const prevValue = form.getFieldValue(bookId) || 0;
      form.setFieldsValue({ [bookId]: prevValue + 1 });
      onValuesChange();
    },
    [form, onValuesChange]
  );

  const onMinusClick = useCallback(
    (bookId: string) => {
      searchRef.current?.focus();
      const prevValue = form.getFieldValue(bookId) || 0;
      if (prevValue !== 0) {
        form.setFieldsValue({ [bookId]: prevValue - 1 });
        onValuesChange();
      }
    },
    [form, onValuesChange]
  );

  const onFinishHandler = (formValues: ReportFormValues) => {
    if (totalBooksCount > 100 && !profile?.role?.includes("authorized")) {
      message.warning({
        content:
          "Спасибо, ваша операция добавлена, но еще не подтверждена. Мы свяжемся с вами в ближайшее время для подтверждения.",
        duration: 5,
        style: {
          marginTop: "10vh",
          fontSize: "medium",
        },
      });
    }
    onFinish(formValues);
    storage.setReportBooks([]);
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
        <SelectLocation name="locationId" />
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
          ref={searchRef}
          placeholder="поиск книги"
          allowClear
          onChange={debouncedSearch}
          style={{ flexGrow: 1, width: 200, marginRight: 16 }}
        />

        <Space size="middle">
          <Helper title="Включение режима опитимзации поиска. Для более быстрой работы показываются только первые 3 избранные и 3 не избранные книги" />
          <Switch
            checked={showOnliFirstBooks}
            onChange={onShowOnliFirstBooksChange}
            checkedChildren={<DashboardOutlined />}
          />
        </Space>
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
        renderItem={(book) => (
          <BookItem
            book={book}
            isFavorite={true}
            key={book.id}
            onPlusClick={onPlusClick}
            onMinusClick={onMinusClick}
            toggleFavorite={toggleFavorite}
          />
        )}
      />
      <List
        itemLayout="horizontal"
        dataSource={showOnliFirstBooks ? otherBooks.slice(0, 5) : otherBooks}
        loading={booksLoading || userDocLoading}
        locale={{ emptyText: "Не найдено книг" }}
        renderItem={(book) => (
          <BookItem
            book={book}
            isFavorite={false}
            key={book.id}
            onPlusClick={onPlusClick}
            onMinusClick={onMinusClick}
            toggleFavorite={toggleFavorite}
          />
        )}
      />
      {hiddenBooks.map((book) => (
        <Form.Item name={book.id} noStyle key={book.id}>
          <InputNumber style={{ display: "none" }} />
        </Form.Item>
      ))}
    </Form>
  );
};

const BookItem = memo((props: any) => {
  const {
    book,
    isFavorite,
    toggleFavorite,
    isSubmitting,
    userDocLoading,
    onMinusClick,
    onPlusClick,
  } = props;
  return (
    <List.Item key={book.id}>
      <Button
        onClick={() => toggleFavorite(book.id)}
        icon={isFavorite ? <StarFilled /> : <StarOutlined />}
        disabled={isSubmitting || userDocLoading}
        style={{ marginRight: 8 }}
      />
      <List.Item.Meta title={book.name} description={book.points ? `Баллы: ${book.points}` : ""} />
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
  );
});
