import { useState } from "react";
import { Divider } from "antd";
import { useStore } from "effector-react";

import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { DistributorForm } from "common/src/components/forms/stock";
import { StockDistributorFormValues } from "common/src/components/forms/stock/helpers";
import {
  $stock,
  HolderType,
  StockDistiributors,
  addHolder,
  updateStockHolder,
} from "common/src/services/api/holders";

type Props = {
  currentUser: CurrentUser;
};

export const DistributorEdit = ({ currentUser }: Props) => {
  const { profile, user, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stock = useStore($stock);

  function onFinish(formValues: StockDistributorFormValues) {
    if (user && profile?.name && stock) {
      setIsSubmitting(true);
      const { name } = formValues;

      addHolder({
        type: HolderType.distributor,
        userId: null,
        creatorId: profile.id,
        name,
      }).then((holder) => {
        const distributors: StockDistiributors = { ...stock.distributors };
        distributors[holder.id] = { books: {}, statistic: {} };

        updateStockHolder(stock.id, { distributors })
          .then(() => navigate(routes.distributors))
          .finally(() => setIsSubmitting(false));
      });
    }
  }

  return (
    <BaseLayout
      title="Добавление распространителя"
      backPath={routes.distributors}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Divider dashed />
      <DistributorForm currentUser={currentUser} onFinish={onFinish} isSubmitting={isSubmitting} />
    </BaseLayout>
  );
};
