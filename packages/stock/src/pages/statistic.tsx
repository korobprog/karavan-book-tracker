import { Select, Space, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { HolderType, useAllHolders } from "common/src/services/api/holders";
import { getStatisticPeriodOptions } from "common/src/services/api/statistic";
import { bbtRegions } from "common/src/services/regions";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { routes } from "../shared/routes";

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
  children?: DataType[];
};

const render = (value: number) => value || "-";

const columns: ColumnsType<DataType> = [
  {
    title: "Название региона/склада",
    dataIndex: "name",
    key: "name",
  },
  ...["S", "M", "B", "MB", "CC", "SB"].map((v) => ({ title: v, dataIndex: v, key: v, render })),
];

const initialPeriod = new Date().getFullYear().toString();

const options = getStatisticPeriodOptions();

export const Statistic = ({ currentUser }: Props) => {
  const { profile, user, loading, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const { holders, holdersLoading } = useAllHolders();

  const [period, setPeriod] = useState(initialPeriod);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  const regionStocks = useMemo(
    () =>
      holders?.reduce((acc, stock) => {
        if (stock.type === HolderType.stock) {
          const region = stock.region || "empty";
          const accRegion = acc.find(({ key }) => key === region);

          const { name, id } = stock;
          const { S = 0, M = 0, B = 0, MB = 0, CC = 0, SB = 0 } = stock.statistic?.[period] || {};

          const stockData = { name, id, key: id, region, S, M, B, MB, CC, SB };

          if (accRegion) {
            if (!accRegion.children) {
              accRegion.children = [];
            }
            accRegion.S += S;
            accRegion.M += M;
            accRegion.B += B;
            accRegion.MB += MB;
            accRegion.CC += CC;
            accRegion.SB += SB;

            accRegion.children.push(stockData);
          } else {
            const name = bbtRegions.find(({ value }) => value === region)?.label || "Без региона";
            acc.push({
              ...stockData,
              name: name,
              key: region,
            });
            acc[acc.length - 1].children = [stockData];
          }
        }
        return acc;
      }, [] as DataType[]) || [],
    [holders, period]
  );

  return (
    <StockBaseLayout
      title="Статистика по регионам"
      backPath={routes.root}
      userDocLoading={userDocLoading}
      avatar={avatar}
    >
      <Typography.Title className="site-page-title" level={2}>
        Склады
      </Typography.Title>
      <Space style={{ marginBottom: 8 }}>
        <Typography.Text>Выберите период </Typography.Text>
        <Select
          defaultValue={initialPeriod}
          style={{ width: 120 }}
          onChange={handlePeriodChange}
          options={options}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={regionStocks}
        pagination={{ pageSize: 100 }}
        rowClassName={(record) => (record.children ? "table-background" : "")}
        onRow={(data) => ({
          onClick: (event) => {
            // navigate to another page
            console.log("row", data);
          },
        })}
      />
    </StockBaseLayout>
  );
};
