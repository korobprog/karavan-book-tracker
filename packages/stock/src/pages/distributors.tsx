import { useEffect, useMemo, useState } from "react";
import { generatePath } from "react-router-dom";
import { useStore } from "effector-react";
import { Button, Divider, List, Radio, RadioChangeEvent, Row, Space, Statistic } from "antd";

import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { routes } from "../shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { $distributors, $stock } from "common/src/services/api/holders";
import { calcBooksCounts, calcTotalBooksAndSum } from "common/src/components/forms/stock/helpers";
import Search from "antd/es/input/Search";
import {
  StatisticDateKeys,
  calcStaticticPointsSum,
  getStatisticDateKeys,
} from "common/src/services/api/statistic";

const periodOptions = [
  { label: "Месяц", value: StatisticDateKeys.month },
  { label: "Квартал", value: StatisticDateKeys.quarter },
  { label: "Год", value: StatisticDateKeys.year },
];

const LOCAL_STORAGE_KEY_DISTRIBUTORS_SORT = "stock_distributors_sort";

type Props = {
  currentUser: CurrentUser;
};

export const Distributors = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const distributors = useStore($distributors);
  const stock = useStore($stock);

  const [searchString, setSearchString] = useState("");
  const [period, setPeriod] = useState(
    (localStorage.getItem(LOCAL_STORAGE_KEY_DISTRIBUTORS_SORT) ||
      periodOptions[0].value) as StatisticDateKeys
  );

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  const onPeriodChange = (e: RadioChangeEvent) => {
    const period = e.target.value as StatisticDateKeys;
    setPeriod(period);
    localStorage.setItem(LOCAL_STORAGE_KEY_DISTRIBUTORS_SORT, period);
  };

  const currentPeriod = getStatisticDateKeys()[period];

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const displayedDistributors = useMemo(() => {
    const filteredDistributors = distributors
      .filter((distributors) => distributors.name?.toLowerCase().includes(searchString))
      .map(({ id, name }) => {
        const stockDistributor = stock?.distributors?.[id];
        const booksCounts = stockDistributor
          ? calcBooksCounts(Object.entries(stockDistributor.books)).totalCount
          : 0;
        const points = calcStaticticPointsSum(stockDistributor?.statistic?.[currentPeriod]);
        return { booksCounts, points, id, name };
      });

    return filteredDistributors.sort((a, b) => (a.points < b.points ? 1 : -1));
  }, [distributors, searchString, stock, currentPeriod]);

  if (!stock) {
    return (
      <StockBaseLayout title="Распространители" headerActions={[]}>
        loading...
      </StockBaseLayout>
    );
  }

  return (
    <StockBaseLayout
      title="Распространители"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Button type="primary" block size="large" onClick={() => navigate(routes.distributorNew)}>
        Добавить распространителя
      </Button>

      <Divider />
      {distributors.length > 0 && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Radio.Group
            options={periodOptions}
            onChange={onPeriodChange}
            value={period}
            optionType="button"
          />

          <Row>
            <Search
              placeholder="поиск по имени"
              allowClear
              onChange={onSearchChange}
              value={searchString}
              style={{ flexGrow: 1, width: 200, marginRight: 8 }}
            />
          </Row>
        </Space>
      )}

      <List
        itemLayout="horizontal"
        dataSource={displayedDistributors}
        renderItem={(distributor) => {
          const { totalCount, totalPrice } = calcTotalBooksAndSum(stock, distributor.id);
          const onUserClick = () => {
            navigate(generatePath(routes.distributor, { distributorId: distributor.id }));
          };

          return (
            <List.Item key={distributor.id} className="list-item-clickable" onClick={onUserClick}>
              <List.Item.Meta
                title={distributor.name}
                description={`Книг на руках: ${totalCount} шт. на ${totalPrice} руб.`}
              />
              <Statistic title="Очки" value={distributor.points} style={{ textAlign: "right" }} />
            </List.Item>
          );
        }}
      />
      <Divider dashed />
    </StockBaseLayout>
  );
};
