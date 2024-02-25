import React, { useState, useMemo } from "react";
import { useStore } from "effector-react";
import { Button, List, Input, InputNumber, Form, Row, Space, Typography } from "antd";
import moment from "moment";

import { DatePicker } from "common/src/components/DatePicker";
import * as storage from "common/src/services/localStorage/reportBooks";
import { $books, $booksLoading, Book } from "common/src/services/books";
import { roundPrice } from "common/src/utils/numbers";
import {
  DistributorTransferType,
  TransferTypeSelect,
} from "common/src/components/TransferTypeSelect";

import {
  DistributorTransferFormValues,
  StockFormValues,
  calcBooksCountsFromValues,
  calcTotalPrice,
} from "./helpers";
import { BookFormItem } from "./BookFormItem";
import { HolderBookPrices, HolderBooks, HolderType } from "../../../services/api/holders";
import { TransferFromDistributorTypes } from "../../../services/api/holderTransfer";

type Props = {
  onFinish: (formValues: StockFormValues, totalPrice: number) => void;
  isSubmitting?: boolean;
  initialValues?: StockFormValues;
  typeParam: DistributorTransferType;
  onTypeChange: (value: DistributorTransferType) => void;
  bookPrices: HolderBookPrices;
  priceMultiplier: number;
  availableBooks?: HolderBooks;
};

export const DistributorTransferForm = (props: Props) => {
  const {
    onFinish,
    isSubmitting,
    initialValues: initialValuesProps,
    typeParam,
    onTypeChange,
    availableBooks,
    bookPrices,
    priceMultiplier: initPriceMultiplier,
  } = props;
  const [searchString, setSearchString] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

  const books = useStore($books);

  const newBooks = useMemo(() => {
    return books.filter((book) => {
      return !selectedBooks.some((selected) => book.id === selected.id);
    });
  }, [books, selectedBooks]);

  const booksLoading = useStore($booksLoading);

  const initialValues: StockFormValues = {
    date: moment(),
    transferType: typeParam,
    ...initialValuesProps,
    priceMultiplier: initPriceMultiplier,
  };

  const [totalBooksCount, setTotalBooksCount] = useState(
    calcBooksCountsFromValues(initialValues).totalCount
  );

  const [form] = Form.useForm();
  const priceMultiplier = Form.useWatch("priceMultiplier", form);

  const [totalPrice, setTotalPrice] = useState(calcBooksCountsFromValues(initialValues).totalCount);

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  const onValuesChange = () => {
    const formValues: StockFormValues = form.getFieldsValue();
    const { totalCount, operationBooks } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
    setTotalPrice(calcTotalPrice(operationBooks, bookPrices, priceMultiplier));

    if (typeParam !== formValues.transferType) {
      onTypeChange(formValues.transferType as DistributorTransferType);
    }
  };

  const onBooksReset = () => {
    form.resetFields();
    const formValues: StockFormValues = form.getFieldsValue();
    const { totalCount, operationBooks } = calcBooksCountsFromValues(formValues);
    setTotalBooksCount(totalCount);
    setTotalPrice(calcTotalPrice(operationBooks, bookPrices, priceMultiplier));
  };

  const { Search } = Input;

  const onSelectClick = (bookId: string) => {
    const newBook = books.find((book) => book.id === bookId);
    if (newBook) {
      setSelectedBooks([...selectedBooks, newBook]);
      form.setFieldsValue({ [bookId]: 0 });
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

  const bookCountLabel = TransferFromDistributorTypes.includes(typeParam)
    ? "На руках"
    : "На складе";

  const onFinishHandler = (formValues: DistributorTransferFormValues) => {
    onFinish({ ...formValues }, totalPrice);
    storage.setReportBooks([]);
  };

  const renderBookItem = (book: Book, isSelected: boolean) => {
    const isBookFinded =
      book.name.toLowerCase().includes(searchString) ||
      book.short_name.toLowerCase().includes(searchString);

    const availableBookCount = availableBooks?.[book.id] || 0;

    const minCount = 0;
    const maxCount = (availableBooks && availableBookCount) || 10000;
    const bookCountText =
      availableBookCount > 0 ? `(${bookCountLabel}: ${availableBookCount})` : "";

    const bookCount = form.getFieldValue(book.id) || 0;
    const price = (bookPrices[book.id] || 0) * priceMultiplier || 0;
    const roundedPrice = roundPrice(price);
    const bookTotalPrice = roundedPrice * bookCount;

    return isBookFinded && (!availableBooks || (availableBookCount && availableBookCount > 0)) ? (
      <BookFormItem
        bookId={book.id}
        title={book.name}
        description={`${book.short_name} ${bookCountText}`}
        isSelected={isSelected}
        bottomSlot={
          <Typography.Text type="secondary">
            по {roundedPrice} р. на {bookTotalPrice} р.
          </Typography.Text>
        }
        {...{ minCount, maxCount, bookCount, onMinusClick, onPlusClick, onSelectClick }}
      />
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
        <TransferTypeSelect type={HolderType.distributor} />
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

      <Form.Item name="priceMultiplier" label="Ценовой коэффициент">
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          style={{ width: 70 }}
          type="number"
          inputMode="numeric"
          pattern="\d*"
        />
      </Form.Item>

      <Space>
        <Typography>
          Выбрано книг: <b>{totalBooksCount}</b> на {totalPrice} руб.
        </Typography>
        <Button
          type="default"
          disabled={isSubmitting || totalBooksCount === 0}
          onClick={onBooksReset}
        >
          Сбросить
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={totalBooksCount === 0}
        >
          {isSubmitting ? "Сохраняем..." : "Сохранить"}
        </Button>
      </Space>
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
        loading={booksLoading}
        locale={{ emptyText: "Не найдено книг" }}
        renderItem={(book) => renderBookItem(book, false)}
      />
    </Form>
  );
};
