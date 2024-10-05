import { useState } from "react";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";

import { routes } from "../shared/routes";
import { addBook, BookDoc } from "common/src/services/api/books";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { BookForm, BookFormValues } from "common/src/components/forms/book";
import { useTranslation } from "react-i18next";

type Props = {
  currentUser: CurrentUser;
};

const BooksNew = ({ currentUser }: Props) => {
  const { t } = useTranslation();
  const { profile, user } = currentUser;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();

  function onFinish(formValues: BookFormValues) {
    if (user && profile?.name) {
      setIsSubmitting(true);
      const { name, short_name, category, lang } = formValues;
      const book: BookDoc = { name, short_name, category, lang };

      addBook(book)
        .then(() => navigate(routes.books))
        .finally(() => setIsSubmitting(false));
    }
  }

  return (
    <BaseLayout title={t("books.add_book")} isAdmin backPath={routes.root} avatar={avatar}>
      <BookForm currentUser={currentUser} onFinish={onFinish} isSubmitting={isSubmitting} />
    </BaseLayout>
  );
};

export default BooksNew;
