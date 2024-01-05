import { Row, Select, Space, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useStock } from "common/src/services/api/holders";
import { getFullStatistic, getStatisticPeriodOptions } from "common/src/services/api/statistic";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { routes } from "../shared/routes";
import { useParams } from "react-router-dom";
import Search from "antd/es/input/Search";

type Props = {
  currentUser: CurrentUser;
};

type DataType = {
  key: string;
  name: string;
  S: number;
  M: number;
  B: number;
  MB: number;
  CC: number;
  SB: number;
  totalCount: number;
  totalPoints: number;
  children?: DataType[];
};

const render = (value: number) => value || "-";

const columns: ColumnsType<DataType> = [
  {
    title: "Имя",
    dataIndex: "name",
    key: "name",
  },
  ...["S", "M", "B", "MB", "CC", "SB"].map((v) => ({ title: v, dataIndex: v, key: v, render })),
  {
    title: "Всего книг",
    dataIndex: "totalCount",
    key: "totalCount",
    render,
  },
  {
    title: "Всего очков",
    dataIndex: "totalPoints",
    key: "totalPoints",
    render,
  },
];

const initialPeriod = new Date().getFullYear().toString();

const options = getStatisticPeriodOptions();

export const StatisticStock = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;

  const { stockId } = useParams<{ stockId: string }>();
  const { stock, stockLoading } = useStock(stockId);

  const [period, setPeriod] = useState(initialPeriod);
  const [searchString, setSearchString] = useState("");
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  const displayedDistributors: DataType[] = useMemo(() => {
    const distributors = stock?.distributors
      ? Object.entries(stock.distributors).map(([key, value]) => ({ ...value, id: key }))
      : [];

    const filteredDistributors = distributors
      .filter((distributors) => (distributors.name || "").toLowerCase().includes(searchString))
      .map(({ id, name, books, statistic }) => {
        const distributorsStatistic = getFullStatistic(period, statistic);

        return {
          name: name || "Имя обновится после проведения любой операции с распространителем",
          id,
          key: id,
          ...distributorsStatistic,
        };
      });

    return filteredDistributors.sort((a, b) => (a.totalPoints < b.totalPoints ? 1 : -1));
  }, [stock, searchString, period]);

  return (
    <StockBaseLayout
      title={`Статистика: ${stock?.name}`}
      backPath={routes.statistic}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Space style={{ marginBottom: 8 }}>
        <Typography.Text>Выберите период </Typography.Text>
        <Select
          defaultValue={initialPeriod}
          style={{ width: 120 }}
          onChange={handlePeriodChange}
          options={options}
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
      <Table columns={columns} dataSource={displayedDistributors} pagination={{ pageSize: 100 }} />
    </StockBaseLayout>
  );
};
