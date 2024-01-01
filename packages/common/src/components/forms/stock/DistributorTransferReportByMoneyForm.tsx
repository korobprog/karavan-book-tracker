import { useMemo } from "react";
import { useStore } from "effector-react";
import { Button, List, InputNumber, Form, Space, DatePicker, Typography } from "antd";
import moment from "moment";

import * as storage from "common/src/services/localStorage/reportBooks";
import { $booksHashMap, $booksLoading } from "common/src/services/books";
import { roundPrice } from "common/src/utils/numbers";
import { HolderTransferType } from "common/src/components/TransferTypeSelect";

import {
  DistributorTransferFormValues,
  DistributorTransferReportByMoneyFormValues,
  findBooksForSum,
} from "./helpers";
import { HolderBookPrices, HolderBooks } from "../../../services/api/holders";

type Props = {
  onFinish: (
    formValues: DistributorTransferFormValues,
    totalPrice: number,
    changedAccount: number
  ) => void;
  isSubmitting?: boolean;
  bookPrices: HolderBookPrices;
  priceMultiplier: number;
  account: number;
  availableBooks?: HolderBooks;
};

export const DistributorTransferReportByMoneyForm = (props: Props) => {
  const {
    onFinish,
    isSubmitting,
    availableBooks,
    bookPrices,
    account,
    priceMultiplier: initPriceMultiplier,
  } = props;

  const booksHashMap = useStore($booksHashMap);
  const booksLoading = useStore($booksLoading);

  const initialValues: DistributorTransferReportByMoneyFormValues = {
    date: moment(),
    priceMultiplier: initPriceMultiplier,
  };

  const [form] = Form.useForm();
  const priceMultiplier = Form.useWatch("priceMultiplier", form);
  const reportSum = Form.useWatch("reportSum", form) || 0;

  const { remainingSum, selectedBooks } = useMemo(
    () => findBooksForSum(availableBooks || {}, bookPrices, reportSum + account, priceMultiplier),
    [availableBooks, bookPrices, reportSum, account, priceMultiplier]
  );

  const totalBooksCount = Object.values(selectedBooks).reduce((acc, val) => acc + val, 0);
  const totalPrice = reportSum + account - remainingSum || 0;

  const onFinishHandler = (formValues: DistributorTransferReportByMoneyFormValues) => {
    console.log("🚀 ~ onFinishHandler ~ formValues:", formValues);
    onFinish(
      { ...formValues, transferType: HolderTransferType.reportByMoney, ...selectedBooks },
      totalPrice,
      remainingSum
    );
    storage.setReportBooks([]);
  };

  const renderBookItem = (bookId: string, isSelected: boolean) => {
    const { name, short_name } = booksHashMap[bookId];
    const bookCount = selectedBooks[bookId];
    const price = (bookPrices[bookId] || 0) * priceMultiplier || 0;
    const roundedPrice = roundPrice(price);
    const bookTotalPrice = roundedPrice * bookCount;

    return (
      <List.Item>
        <List.Item.Meta title={name} description={short_name} />
        <Space>
          <b>{bookTotalPrice} руб.</b> ({bookCount} шт. по {price} руб.)
        </Space>
      </List.Item>
    );
  };

  return (
    <Form name="basic" onFinish={onFinishHandler} form={form} initialValues={initialValues}>
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

      <Form.Item label="Вносимая сумма">
        <Space>
          <Form.Item name="reportSum">
            <InputNumber
              min={0}
              max={9999999}
              style={{ width: 70 }}
              type="number"
              inputMode="numeric"
              pattern="\d*"
            />
          </Form.Item>
          <Form.Item label={`+ ${account} руб. (текущий счет)`}></Form.Item>
        </Space>
      </Form.Item>

      <Space>
        <Typography>
          <b>
            Выбрано книг: {totalBooksCount} на {totalPrice} руб.
          </b>
        </Typography>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={totalBooksCount === 0}
        >
          {isSubmitting ? "Сохраняем..." : "Сохранить"}
        </Button>
      </Space>
      <Typography>
        <b>Оставшаяся сумма: {remainingSum} руб. (сохранится на счету санкиртанщика)</b>
      </Typography>

      <Typography.Title level={4}>Книги, которые спишутся:</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={Object.keys(selectedBooks)}
        loadMore={booksLoading}
        locale={{
          emptyText: "Текущей суммы не хватает ни на одну из книг, введите сумму больше",
        }}
        renderItem={(book) => renderBookItem(book, true)}
      />
    </Form>
  );
};
