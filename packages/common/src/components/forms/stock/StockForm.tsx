import React, { useState, useMemo } from "react";
import { useStore } from "effector-react";
import { Button, List, Input, InputNumber, Form, Row, Space, DatePicker, Typography } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  StarFilled,
  StarOutlined,
  SelectOutlined,
} from "@ant-design/icons";

import * as storage from "common/src/services/localStorage/reportBooks";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $books, $booksLoading, Book } from "common/src/services/books";
import { TransferTypeSelect } from "common/src/components/TransferTypeSelect";

import moment from "moment";
import { StockFormValues, calcBooksCountsFromValues, calcFormValuesFromBooks } from "./helpers";
import { HolderTransferType } from "../../../services/api/holderTransfer";

type Props = {
  currentUser: CurrentUser;
  onFinish: (formValues: StockFormValues) => void;
  isSubmitting?: boolean;
  initialValues?: StockFormValues;
};

export const StockForm = (props: Props) => {
  const { currentUser, onFinish, isSubmitting, initialValues: initialValuesProps } = props;
  const { userDocLoading } = currentUser;
  const [searchString, setSearchString] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

  const books = useStore($books);

  const newBooks = useMemo(() => {
    return books.filter((book) => {
      return !selectedBooks.some((selected) => book.id === selected.id);
    });
  }, [books, selectedBooks]);

  const booksLoading = useStore($booksLoading);

  const booksStorageInitialValues = calcFormValuesFromBooks(storage.getReportBooks());

  const initialValues = {
    date: moment(),
    transferType: HolderTransferType.bbtIncome,
    ...initialValuesProps,
  };

  const { date, transferType, ...booksPropsInitialValues } =
    initialValuesProps || ({} as StockFormValues);

  const getInitialBooks = (booksValues: Record<number, number>) => {
    return Object.values(booksValues).reduce((acc, value) => acc + value, 0);
  };

  const [totalBooksCount, setTotalBooksCount] = useState(
    getInitialBooks(booksPropsInitialValues) || getInitialBooks(booksStorageInitialValues)
  );

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  const onValuesChange = () => {
    const formValues: StockFormValues = form.getFieldsValue();
    const { totalCount } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
  };

  const onBooksReset = () => {
    form.resetFields();
    const formValues: StockFormValues = form.getFieldsValue();
    const { totalCount } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
  };

  const { Search } = Input;

  const [form] = Form.useForm();

  const onSelectClick = (bookId: string) => {
    const newBook = books.find((book) => book.id === bookId);
    if (newBook) {
      setSelectedBooks([...selectedBooks, newBook]);
    }
  };

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

  const onFinishHandler = (formValues: StockFormValues) => {
    onFinish(formValues);
    storage.setReportBooks([]);
  };

  const renderBookItem = (book: Book, isSelected: boolean) => {
    const StarIcon = isSelected ? StarFilled : StarOutlined;

    return book.name.toLowerCase().includes(searchString) ? (
      <List.Item>
        <StarIcon style={{ fontSize: "24px", marginRight: 12, color: "#bae0ff" }} />
        <List.Item.Meta title={book.name} />

        {isSelected ? (
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
        ) : (
          <Button onClick={() => onSelectClick(book.id)} icon={<SelectOutlined />}>
            Выбрать
          </Button>
        )}
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
      <Form.Item name="transferType" label="Тип перемещения">
        <TransferTypeSelect />
      </Form.Item>
      <Form.Item name="date" label="Дата">
        <DatePicker
          disabledDate={(current) => {
            let customDate = moment().add(1, "day").format("YYYY-MM-DD");
            return current && current > moment(customDate, "YYYY-MM-DD");
          }}
          format="DD.MM.YYYY"
        />
      </Form.Item>

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
      <List
        itemLayout="horizontal"
        dataSource={selectedBooks}
        loadMore={booksLoading}
        locale={{
          emptyText: "Пока нет выбранных книг, ищите их ниже и они появятся здесь",
        }}
        renderItem={(book) => renderBookItem(book, true)}
      />

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
        dataSource={newBooks}
        loading={booksLoading || userDocLoading}
        locale={{ emptyText: "Не найдено книг" }}
        renderItem={(book) => renderBookItem(book, false)}
      />
    </Form>
  );
};
