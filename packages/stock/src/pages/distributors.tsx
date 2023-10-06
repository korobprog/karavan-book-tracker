import { useEffect, useState } from "react";
import { generatePath, useNavigate, Link } from "react-router-dom";
import { Button, Divider, List, Row } from "antd";

import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { useStore } from "effector-react";
import { $distributors, $stock } from "common/src/services/api/holders";
import { calcBooksCounts } from "common/src/components/forms/stock/helpers";
import Search from "antd/es/input/Search";

type Props = {
  currentUser: CurrentUser;
};

export const Distributors = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useNavigate();
  const distributors = useStore($distributors);
  const stock = useStore($stock);

  const [searchString, setSearchString] = useState("");

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const filteredDistributors = distributors.filter((distributors) =>
    distributors.name?.toLowerCase().includes(searchString)
  );

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

      <Row>
        <Search
          placeholder="поиск по имени"
          allowClear
          onChange={onSearchChange}
          value={searchString}
          style={{ flexGrow: 1, width: 200, marginRight: 8 }}
        />
      </Row>

      <List
        itemLayout="horizontal"
        dataSource={filteredDistributors}
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
