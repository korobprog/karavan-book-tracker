import React, { useState, useEffect } from "react";
import { useStore } from "effector-react";
import { Row, List, Input } from "antd";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $books, $booksLoading, Book } from "common/src/services/books";

type Props = {
  currentUser: CurrentUser;
};

export const StockList = (props: Props) => {
  const { currentUser } = props;
  const { userDocLoading } = currentUser;
  const [searchString, setSearchString] = useState("");

  const books = useStore($books);
  const booksLoading = useStore($booksLoading);

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  const { Search } = Input;

  const renderBookItem = (book: Book) => {
    const count = 0;
    return (
      <List.Item key={book.id}>
        <List.Item.Meta title={book.name} />
        {count}
      </List.Item>
    );
  };

  const filteredBooks = books.filter((book) => book.name.toLowerCase().includes(searchString));

  return (
    <div>
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
