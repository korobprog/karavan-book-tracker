import React from "react";
import { List, Tag } from "antd";
import moment from "moment";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import {
  HolderTransferDoc,
  HolderTransferMap,
  useHolderTransfers,
} from "../services/api/holderTransfer";
import { $booksHashMap } from "common/src/services/books/index";

type Props = {
  currentUser: CurrentUser;
};

export const HolderTransferList = (props: Props) => {
  const { currentUser } = props;
  const { profile, userDocLoading } = currentUser;

  const { holderTransfers, loading } = useHolderTransfers(profile && { userId: profile.id });

  const renderHolderTransferItem = (holderTransfer: HolderTransferDoc) => {
    const bookHashMap = $booksHashMap.getState();
    const Icon = HolderTransferMap[holderTransfer.type].icon;

    return (
      <List.Item key={holderTransfer.id}>
        {Icon && <Icon size={50} style={{ fontSize: "24px", marginRight: 12 }} />}
        <List.Item.Meta
          title={HolderTransferMap[holderTransfer.type].name}
          description={moment(holderTransfer.date).calendar()}
        />
        <>
          {Object.entries(holderTransfer.books).map(([bookId, count], index) => {
            const color = count > 0 ? "green" : "red";

            return (
              <Tag color={color} key={index}>
                {count > 0 ? "+" : "-"} {count} {bookHashMap[bookId]?.short_name}
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
        dataSource={holderTransfers}
        loading={loading || userDocLoading}
        locale={{ emptyText: "Не найдено книг" }}
        renderItem={(book) => renderHolderTransferItem(book)}
      />
    </div>
  );
};
