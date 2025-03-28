import { useState } from "react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";

import { routes } from "../shared/routes";
import { BookDoc, updateBook, useBook } from "common/src/services/api/books";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { BookForm, BookFormValues } from "common/src/components/forms/book";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  currentUser: CurrentUser;
};

const BooksEdit = ({ currentUser }: Props) => {
  const { t } = useTranslation();
  const { profile, user } = currentUser;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const { bookDocData, loading } = useBook(bookId);

  function onFinish(formValues: BookFormValues) {
    if (user && profile?.name && bookId) {
      setIsSubmitting(true);
      const { name, short_name, category, lang } = formValues;
      const book: BookDoc = { name, short_name, category, lang };

      updateBook(bookId, book)
        .then(() => navigate(routes.books))
        .finally(() => setIsSubmitting(false));
    }
  }

  const loadingTitle = loading ? t("books.loading") : t("books.not_exists");

  return (
    <BaseLayout title={t("books.edit_book")} isAdmin backPath={routes.root} avatar={avatar}>
      {bookDocData ? (
        <BookForm
          currentUser={currentUser}
          onFinish={onFinish}
          isSubmitting={isSubmitting}
          initialValues={bookDocData}
        />
      ) : (
        <div>{loadingTitle}</div>
      )}
    </BaseLayout>
  );
};

export default BooksEdit;
