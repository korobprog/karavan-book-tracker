import { useMemo, useState } from "react";
import { List, Tag, Typography, Popover, Button, Row } from "antd";
import moment from "moment";
import { useStore } from "effector-react";
import {
  RiseOutlined,
  MinusOutlined,
  PlusOutlined,
  HistoryOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";

import {
  $holderTransfers,
  HolderTransferDoc,
  HolderTransferMap,
  HolderTransferType,
  StatisticHolderTransferTypes,
} from "../services/api/holderTransfer";
import { $booksHashMap } from "common/src/services/books/index";
import { WithId } from "../services/api/refs";
import { getBookDeclensions, getTypeDeclensions } from "../utils/declension";
import { calcBooksCounts } from "./forms/stock/helpers";

const displayedTransersCount = 3;

type Props = {
  title?: string;
  transferFilter?: (value: WithId<HolderTransferDoc>) => boolean;
  isReverseColor?: boolean;
};

export const HolderTransferList = (props: Props) => {
  const { title, transferFilter, isReverseColor } = props;
  const holderTransfers = useStore($holderTransfers);
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedHolderTransfers = useMemo(() => {
    let result = holderTransfers;
    if (transferFilter) {
      result = result.filter(transferFilter);
    }
    return result.sort((a, b) => (moment(a.date).isBefore(b.date) ? 1 : -1));
  }, [holderTransfers, transferFilter]);

  const displayedHolderTransfers = useMemo(() => {
    return sortedHolderTransfers.slice(0, displayedTransersCount);
  }, [sortedHolderTransfers]);

  const renderHolderTransferItem = (holderTransfer: HolderTransferDoc) => {
    const bookHashMap = $booksHashMap.getState();
    const Icon = HolderTransferMap[holderTransfer.type].icon;
    const isDistributorReport = isReverseColor && holderTransfer.type === HolderTransferType.report;

    const getColor = (isPositive: boolean) =>
      StatisticHolderTransferTypes.includes(holderTransfer.type)
        ? "purple"
        : isPositive
        ? "green"
        : "red";

    const renderTags = ([bookId, count]: [string, number], index: number) => {
      let isPositive = count >= 0 && holderTransfer.type !== HolderTransferType.installments;

      if (isReverseColor) {
        isPositive = !isPositive;
      }

      if (StatisticHolderTransferTypes.includes(holderTransfer.type)) {
        return (
          <Tag key={index} color={getColor(isPositive)}>
            {isDistributorReport && <MinusOutlined />}
            <b>{Math.abs(count)}</b> {bookHashMap[bookId]?.short_name}
          </Tag>
        );
      }

      return (
        <Tag color={getColor(isPositive)} key={index}>
          <b>{Math.abs(count)}</b> {bookHashMap[bookId]?.short_name}
        </Tag>
      );
    };

    const { totalCount, length } = calcBooksCounts(Object.entries(holderTransfer.books));

    const popoverContent = () => {
      const transferBooks = Object.entries(holderTransfer.books);
      return transferBooks.map(renderTags);
    };
    const isPositive = totalCount > 0;
    const count = Math.abs(totalCount);

    const buttonIcon = StatisticHolderTransferTypes.includes(holderTransfer.type) ? (
      <RiseOutlined />
    ) : isPositive ? (
      <PlusOutlined />
    ) : (
      <MinusOutlined />
    );
    return (
      <List.Item key={holderTransfer.id}>
        {Icon && <Icon size={50} style={{ fontSize: "24px", marginRight: 12 }} />}
        <List.Item.Meta
          title={HolderTransferMap[holderTransfer.type].title}
          description={moment(holderTransfer.date).calendar()}
        />

        <Popover content={popoverContent} trigger="click">
          <Button type="text">
            <Tag color={getColor(isPositive)} icon={buttonIcon}>
              {count} {getBookDeclensions(count)} / {length} {getTypeDeclensions(length)}
            </Tag>
          </Button>
        </Popover>
      </List.Item>
    );
  };

  const dataSource = isExpanded ? sortedHolderTransfers : displayedHolderTransfers;

  return (
    <>
      {dataSource.length > 0 && (
        <div>
          <Row justify={"space-between"}>
            <Typography.Title level={3}>{title}</Typography.Title>
            {sortedHolderTransfers.length > displayedTransersCount && (
              <Button
                shape="circle"
                icon={isExpanded ? <UpCircleOutlined /> : <HistoryOutlined />}
                onClick={() => setIsExpanded((value) => !value)}
              />
            )}
          </Row>
          <List
            itemLayout="horizontal"
            dataSource={dataSource}
            locale={{ emptyText: "Операций не найдено" }}
            renderItem={(book) => renderHolderTransferItem(book)}
          />
        </div>
      )}
    </>
  );
};
