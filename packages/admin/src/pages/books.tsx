import { generatePath } from "react-router-dom";
import useGoogleSheets from "use-google-sheets";
import { Button, Table, Divider, Space, TableColumnsType, Popconfirm, Select, Form } from "antd";
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import * as storage from "common/src/services/localStorage/bookLang";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import {
  BooksCategories,
  deleteBook,
  setBook,
  useBookLanguages,
  useBooks,
} from "common/src/services/api/books";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getBooks } from "common/src/services/books";

type Props = {
  currentUser: CurrentUser;
};

export const Books = ({ currentUser }: Props) => {
  const { t } = useTranslation();
  const { loading, profile } = currentUser;
  const navigate = useTransitionNavigate();
  const { loading: booksLoading, data: books } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });

  const [selectedLang, setSelectedLang] = useState<string>();

  const onMigrateBooks = () => {
    if (books) {
      getBooks(books).forEach((book) => {
        const { name, short_name, category, id } = book;
        // const book: BookDoc = { name, short_name, category, lang };
        console.log("migrate book", id, name);
        setBook(id, { name, short_name, category: category as BooksCategories, lang: "ru" });
      });
    }
  };

  const avatar = profile?.avatar;

  const { booksDocData, loading: bookLoading } = useBooks(selectedLang);

  const onAddBook = () => {
    navigate(routes.booksNew);
  };

  const onEditBook = (bookId: string) => {
    navigate(generatePath(routes.booksEdit, { bookId }));
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const onRemoveBook = async (bookId: string) => {
    setDeleteLoading(true);
    deleteBook(bookId);
    setDeleteLoading(false);
  };

  const data =
    booksDocData?.map((book) => ({
      key: book.id,
      id: book.id,
      name: book.name,
      short_name: book.short_name,
      lang: book.lang,
      category: book.category,
    })) || [];

  const bookLanguages = useBookLanguages();

  const columns: TableColumnsType<(typeof data)[0]> = [
    { title: t("books.name"), dataIndex: "name", key: "name" },
    { title: t("books.short_name"), dataIndex: "short_name", key: "short_name" },
    {
      title: t("books.lang"),
      dataIndex: "lang",
      key: "lang",
      render: (text) => bookLanguages.find(({ value }) => value === text)?.label || text,
    },
    { title: t("books.category"), dataIndex: "category", key: "category" },
    {
      title: t("books.action"),
      key: "action",
      render: (text: string, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEditBook(record.id)} />
          <Popconfirm
            title={t("books.delete_confirm")}
            onConfirm={() => onRemoveBook(String(record.key))}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleteLoading} disabled />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <BaseLayout title={t("books.title")} isAdmin backPath={routes.root} avatar={avatar}>
      <Button block size="large" type="primary" icon={<PlusCircleOutlined />} onClick={onAddBook}>
        {t("books.add_book")}
      </Button>

      <Divider dashed />
      <Space align="start">
        <Form.Item label={t("books.lang_label")}>
          <Select
            placeholder={t("books.lang_placeholder")}
            options={[{ value: "none", label: t("books.filter_none") }, ...bookLanguages]}
            defaultValue={storage.getDefaultBookLang()}
            onChange={(value) => {
              const lang = value === "none" ? undefined : value;
              storage.setDefaultBookLang(lang);
              setSelectedLang(lang);
            }}
            style={{ width: "200px" }}
          />
        </Form.Item>

        <Button type="default" onClick={onMigrateBooks}>
          Migrate books from doc
        </Button>
      </Space>
      <Divider dashed />
      <Table
        columns={columns}
        dataSource={data}
        loading={booksLoading || loading || bookLoading}
        scroll={{ x: true }}
        pagination={{ pageSize: 100 }}
      />
    </BaseLayout>
  );
};
