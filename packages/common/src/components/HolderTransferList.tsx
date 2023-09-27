import React, { useMemo } from "react";
import { List, Tag } from "antd";
import moment from "moment";
import { useStore } from "effector-react";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import {
  $holderTransfers,
  HolderTransferDoc,
  HolderTransferMap,
  HolderTransferType,
} from "../services/api/holderTransfer";
import { $booksHashMap } from "common/src/services/books/index";

type Props = {
  currentUser: CurrentUser;
};

export const HolderTransferList = (props: Props) => {
  const holderTransfers = useStore($holderTransfers);

  const sortedHolderTransfers = useMemo(() => {
    return holderTransfers.sort((a, b) => (moment(a.date).isBefore(b.date) ? 1 : -1));
  }, [holderTransfers]);

  const renderHolderTransferItem = (holderTransfer: HolderTransferDoc) => {
    const bookHashMap = $booksHashMap.getState();
    const Icon = HolderTransferMap[holderTransfer.type].icon;

    return (
      <List.Item key={holderTransfer.id}>
        {Icon && <Icon size={50} style={{ fontSize: "24px", marginRight: 12 }} />}
        <List.Item.Meta
          title={HolderTransferMap[holderTransfer.type].title}
          description={moment(holderTransfer.date).calendar()}
        />
        <>
          {Object.entries(holderTransfer.books).map(([bookId, count], index) => {
            const isPositive =
              count >= 0 && holderTransfer.type !== HolderTransferType.installments;
            const color = isPositive ? "green" : "red";

            return (
              <Tag color={color} key={index}>
                {isPositive ? "+" : "-"} {Math.abs(count)} {bookHashMap[bookId]?.short_name}
              </Tag>
            );
          })}
        </>
      </List.Item>
    );
  };

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={sortedHolderTransfers}
        // loading={loading || userDocLoading}
        locale={{ emptyText: "Не найдено книг" }}
        renderItem={(book) => renderHolderTransferItem(book)}
      />
    </div>
  );
};
