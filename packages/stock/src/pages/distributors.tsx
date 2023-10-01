import { useEffect } from "react";
import { generatePath, useNavigate, Link } from "react-router-dom";
import { Button, Divider, List } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { useStore } from "effector-react";
import { $distributors, $stock } from "common/src/services/api/holders";
import { calcBooksCounts } from "common/src/components/forms/stock/helpers";

type Props = {
  currentUser: CurrentUser;
};

export const Distributors = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const distributors = useStore($distributors);
  const stock = useStore($stock);

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  return (
    <BaseLayout
      title="Распространители"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Button type="primary" block size="large" onClick={() => navigate(routes.distributorNew)}>
        Добавить распространителя
      </Button>

      <Divider dashed />

      <List
        itemLayout="horizontal"
        dataSource={distributors}
        renderItem={(distributor) => {
          const stockDistributor = stock?.distributors?.[distributor.id];
          const booksCounts = stockDistributor ? calcBooksCounts(stockDistributor).totalCount : 0;

          return (
            <Link
              key={distributor.id}
              to={generatePath(routes.distributor, { distributorId: distributor.id })}
            >
              <List.Item className="list-item-clickable">
                <List.Item.Meta
                  title={distributor.name}
                  description={`Книг на руках: ${booksCounts}`}
                />
              </List.Item>
            </Link>
          );
        }}
      />
      <Divider dashed />
    </BaseLayout>
  );
};
