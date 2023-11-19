import React, { useState } from "react";
import { useStore } from "effector-react";
import { Row, List, Input, Typography } from "antd";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $booksHashMap, $booksLoading, Book } from "common/src/services/books";
import { HolderBookPrices, HolderBooks } from "../services/api/holders";

type BookWithCount = Book & { count: number; price: number };

type Props = {
  currentUser: CurrentUser;
  holderBooks: HolderBooks;
  title?: string;
  prices?: HolderBookPrices;
};

export const StockList = (props: Props) => {
  const { currentUser, holderBooks, title, prices = {} } = props;
  const { userDocLoading } = currentUser;
  const [searchString, setSearchString] = useState("");

  const booksHashMap = useStore($booksHashMap);

  const books = Object.entries(holderBooks).map(
    ([id, count]) => ({ ...booksHashMap[id], count, price: prices[id] } as BookWithCount)
  );

  const booksLoading = useStore($booksLoading);

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  const { Search } = Input;

  const renderBookItem = (book: BookWithCount) => {
    const priceString = book.price ? `(${book.price} р.) ` : "";
    return book.count ? (
      <List.Item key={book.id}>
        <List.Item.Meta title={book.name} />
        <Typography.Text>
          <Typography.Text type="secondary">{priceString}</Typography.Text>

          <b>{book.count}</b>
        </Typography.Text>
      </List.Item>
    ) : null;
  };

  const filteredBooks = books.filter((book) => book.name?.toLowerCase().includes(searchString));

  return (
    <div>
      <Typography.Title level={3}>{title}</Typography.Title>
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
        dataSource={filteredBooks}
        loading={booksLoading || userDocLoading}
        locale={{ emptyText: "Не найдено книг" }}
        renderItem={(book) => renderBookItem(book)}
      />
    </div>
  );
};
