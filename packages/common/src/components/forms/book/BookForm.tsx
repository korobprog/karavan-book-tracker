import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Select } from "antd";

import * as storage from "common/src/services/localStorage/bookLang";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

import { BookFormValues } from "./helpers";
import { BooksCategories, categoryOptions, useBookLanguages } from "../../../services/api/books";

type Props = {
  currentUser: CurrentUser;
  onFinish: (formValues: BookFormValues) => void;
  isSubmitting?: boolean;
  initialValues?: BookFormValues;
};

export const BookForm = (props: Props) => {
  const { currentUser, onFinish, isSubmitting, initialValues: initialValuesProps } = props;
  const { t } = useTranslation();
  const { userDocLoading } = currentUser;

  const initialValues = useMemo(
    () => ({
      lang: storage.getDefaultBookLang(),
      category: BooksCategories.other,
      ...initialValuesProps,
    }),
    [initialValuesProps]
  );

  const [form] = Form.useForm();

  const onFinishHandler = (formValues: BookFormValues) => {
    onFinish(formValues);
    storage.setDefaultBookLang(formValues.lang);
  };

  const bookLanguages = useBookLanguages();

  return (
    <Form name="basic" onFinish={onFinishHandler} form={form} initialValues={initialValues}>
      <Form.Item name="name" label={t("common.book.form.name_label")} rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="short_name" label={t("common.book.form.short_name_label")}>
        <Input />
      </Form.Item>

      <Form.Item name="lang" label={t("common.book.form.lang_label")} rules={[{ required: true }]}>
        <Select placeholder={t("common.book.form.lang_placeholder")} options={bookLanguages} />
      </Form.Item>

      <Form.Item
        name="category"
        label={t("common.book.form.category_label")}
        rules={[{ required: true }]}
      >
        <Select
          placeholder={t("common.book.form.category_placeholder")}
          options={categoryOptions}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting || userDocLoading}>
          {isSubmitting ? t("common.book.form.submitting") : t("common.book.form.submit")}
        </Button>
      </Form.Item>
    </Form>
  );
};
