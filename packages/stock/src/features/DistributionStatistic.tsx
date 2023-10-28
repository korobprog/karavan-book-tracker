import { useMemo, useState } from "react";
import { Row, Space, Typography } from "antd";
import moment, { Moment } from "moment";

import { TotalStatistic } from "common/src/components/TotalStatistic";
import { DatePicker } from "common/src/components/DatePicker";
import {
  HolderTransferDoc,
  StatisticHolderTransferTypes,
} from "common/src/services/api/holderTransfer";
import { HolderBooks } from "common/src/services/api/holders";
import { $booksHashMap, BooksCategories } from "common/src/services/books";
import { WithId } from "common/src/services/api/refs";

type Props = {
  holderTransfers: WithId<HolderTransferDoc>[];
};

const calcBooksCountsByPoints = (books: HolderBooks) => {
  const booksHashMap = $booksHashMap.getState();
  return Object.entries(books).reduce((acc, [bookId, bookCount]) => {
    const bookPoints = booksHashMap[bookId].points || 0;
    const category = booksHashMap[bookId].category as BooksCategories;
    acc[category] = (acc[category] || 0) + bookCount || 0;
    acc.points = (acc.points || 0) + Number(bookPoints) * bookCount;

    return acc;
  }, {} as Record<BooksCategories | "points", number>);
};

export const getDataForTotalStatistic = (
  holderTransfers: WithId<HolderTransferDoc>[],
  dateFrom: Moment,
  dateTo: Moment
) =>
  holderTransfers.reduce(
    (acc, holderTransfer) => {
      if (StatisticHolderTransferTypes.includes(holderTransfer.type)) {
        if (moment(holderTransfer.date).isBetween(dateFrom, dateTo)) {
          const { points, ...restValues } = calcBooksCountsByPoints(holderTransfer.books);

          acc[0].value += restValues.maha_big || 0;
          acc[1].value += restValues.big || 0;
          acc[2].value += restValues.medium || 0;
          acc[3].value += restValues.small || 0;
          acc[4].value += points || 0;
        }
      }
      return acc;
    },
    [
      { title: "MB", value: 0 },
      { title: "B", value: 0 },
      { title: "M", value: 0 },
      { title: "S", value: 0 },
      { title: "Очки", value: 0 },
    ]
  );

export const DistributionStatistic = (props: Props) => {
  const { holderTransfers } = props;

  const [dateFrom, setDateFrom] = useState(moment().startOf("month"));
  const [dateTo, setDateTo] = useState(moment().endOf("month"));

  const data = useMemo(() => {
    return getDataForTotalStatistic(holderTransfers, dateFrom, dateTo);
  }, [holderTransfers, dateFrom, dateTo]);

  return (
    <>
      <Row justify="center" align="middle">
        <Space wrap style={{ justifyContent: "center" }}>
          <Typography.Text strong>Распространенные книги за период</Typography.Text>
          <DatePicker.RangePicker
            showTime
            value={[dateFrom, dateTo]}
            onChange={(value) => {
              if (value?.[0] && value[1]) {
                setDateFrom(value[0]);
                setDateTo(value[1]);
              }
            }}
            allowClear={false}
            format="DD.MM.YYYY"
          />
        </Space>
      </Row>
      <TotalStatistic data={data} style={{ padding: 14 }} />;
    </>
  );
};
