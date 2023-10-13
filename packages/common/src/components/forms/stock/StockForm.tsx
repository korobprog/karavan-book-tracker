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
import { HolderBooks, HolderType } from "../../../services/api/holders";

type Props = {
  currentUser: CurrentUser;
  onFinish: (formValues: StockFormValues) => void;
  isSubmitting?: boolean;
  initialValues?: StockFormValues;
  availableBooks?: HolderBooks;
};

export const StockForm = (props: Props) => {
  const {
    currentUser,
    onFinish,
    isSubmitting,
    initialValues: initialValuesProps,
    availableBooks,
  } = props;
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

  const [allowNegative, setAllowNegative] = useState(false);

  const booksStorageInitialValues = calcFormValuesFromBooks(storage.getReportBooks());

  const initialValues = {
    date: moment(),
    transferType: HolderTransferType.bbtIncome,
    ...initialValuesProps,
  };

  const {
    date,
    transferType: _transferType,
    ...booksPropsInitialValues
  } = initialValuesProps || ({} as StockFormValues);

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

    const isAllowNegative = formValues.transferType === HolderTransferType.adjustment;
    if (isAllowNegative !== allowNegative) {
      setAllowNegative(isAllowNegative);
      if (!isAllowNegative) {
        const { date, transferType, ...currentBooks } = formValues;
        for (const book in currentBooks) {
          if (currentBooks[book] < 0) {
            currentBooks[book] = 0;
          }
        }
        form.setFieldsValue(currentBooks);
      }
    }

    const newformValues: StockFormValues = form.getFieldsValue();
    const { totalCount } = calcBooksCountsFromValues(newformValues);
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
      form.setFieldsValue({ [bookId]: 1 });
      setTimeout(() => {
        onValuesChange();
      });
    }
  };

  const onPlusClick = (bookId: string, maxCount: number) => {
    const prevValue = form.getFieldValue(bookId) || 0;
    if (prevValue !== maxCount) {
      form.setFieldsValue({ [bookId]: prevValue + 1 });
      onValuesChange();
    }
  };

  const onMinusClick = (bookId: string, minCount: number) => {
    const prevValue = form.getFieldValue(bookId) || 0;
    if (prevValue !== minCount) {
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
    const isBookFinded =
      book.name.toLowerCase().includes(searchString) ||
      book.short_name.toLowerCase().includes(searchString);

    const availableBookCount = availableBooks?.[book.id] || 0;

    const minCount = allowNegative ? -availableBookCount : 0;
    const maxCount = 10000;

    return isBookFinded ? (
      <List.Item>
        <StarIcon style={{ fontSize: "24px", marginRight: 12, color: "#bae0ff" }} />
        <List.Item.Meta title={book.name} description={book.short_name} />

        <Space>
          {availableBookCount > 0 && <Typography>На складе {availableBookCount}</Typography>}

          {isSelected ? (
            <Space>
              <Button onClick={() => onMinusClick(book.id, minCount)} icon={<MinusOutlined />} />
              <Form.Item name={book.id} noStyle>
                <InputNumber
                  min={minCount}
                  max={maxCount}
                  style={{ width: 70 }}
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                />
              </Form.Item>
              <Button onClick={() => onPlusClick(book.id, maxCount)} icon={<PlusOutlined />} />
            </Space>
          ) : (
            <Button onClick={() => onSelectClick(book.id)} icon={<SelectOutlined />}>
              Выбрать
            </Button>
          )}
        </Space>
      </List.Item>
    ) : (
      <Form.Item name={book.id} noStyle />
    );
  };

  const transferType = Form.useWatch("transferType", form);

  return (
    <Form
      name="basic"
      onFinish={onFinishHandler}
      onFieldsChange={onValuesChange}
      form={form}
      initialValues={initialValues}
    >
      <Form.Item name="transferType" label="Тип перемещения">
        <TransferTypeSelect type={HolderType.stock} />
      </Form.Item>
      {transferType === HolderTransferType.adjustment && (
        <Form.Item name="comment" label="Комментарий" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      )}
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
            {isSubmitting ? "Сохраняем..." : "Сохранить"}
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
