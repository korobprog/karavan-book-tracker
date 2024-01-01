import React, { useState } from "react";
import { useStore } from "effector-react";
import { Row, List, Input, Typography, Button, Space } from "antd";
import { WalletOutlined, PercentageOutlined } from "@ant-design/icons";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $booksHashMap, $booksLoading, Book } from "common/src/services/books";
import { HolderBookPrices, HolderBooks } from "../services/api/holders";
import { roundPrice } from "../utils/numbers";

type BookWithCount = Book & { count: number; price: number };

type Props = {
  currentUser: CurrentUser;
  holderBooks: HolderBooks;
  title?: string;
  prices?: HolderBookPrices;
  priceMultiplier?: number;
};

export const StockList = (props: Props) => {
  const { currentUser, holderBooks, title, prices = {}, priceMultiplier = 1 } = props;
  const { userDocLoading } = currentUser;
  const [searchString, setSearchString] = useState("");
  const [priceWithMultiplier, setPriceWithMultiplier] = useState(true);

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
    const displayedPrice = book.price * (priceWithMultiplier ? priceMultiplier : 1);
    const roundedPrice = roundPrice(displayedPrice);
    const priceString = book.price ? `(${roundedPrice} р.) ` : "";
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
  const priceTitle = `Цена ${priceWithMultiplier ? "с учетом" : "без учета"} коэффициента:`;

  return (
    <div>
      <Row justify={"space-between"} align="middle" className="sticky">
        <Typography.Title level={4}>{title}</Typography.Title>

        <Space align="center">
          <Typography.Text type="secondary">
            {priceTitle} <b>{priceMultiplier}</b>
          </Typography.Text>

          <Button
            shape="circle"
            icon={priceWithMultiplier ? <PercentageOutlined /> : <WalletOutlined />}
            onClick={() => setPriceWithMultiplier((value) => !value)}
          />
        </Space>
      </Row>
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
