import { Select, Space, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";

import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { HolderType, useAllHolders } from "common/src/services/api/holders";
import { getFullStatistic, getStatisticPeriodOptions } from "common/src/services/api/statistic";
import { bbtRegions } from "common/src/services/regions";
import { StockBaseLayout } from "../shared/StockBaseLayout";
import { routes } from "../shared/routes";
import { calcObjectFields, getObjectFieldsCount } from "common/src/utils/objects";
import { generatePath } from "react-router-dom";
import { DownloadExcel } from "common/src/features/downloadExcel";

type Props = {
  currentUser: CurrentUser;
};

type DataType = {
  key: string;
  id: string | null;
  name: string;
  S: number;
  M: number;
  B: number;
  MB: number;
  CC: number;
  SB: number;
  totalCount: number;
  totalPoints: number;
  distributorsCount: number;
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
  {
    title: "Распространителей",
    dataIndex: "distributorsCount",
    key: "distributorsCount",
    render,
  },
];

const initialPeriod = new Date().getFullYear().toString();

const options = getStatisticPeriodOptions();

export const Statistic = ({ currentUser }: Props) => {
  const { profile, userDocLoading } = currentUser;
  const avatar = profile?.avatar;
  const navigate = useTransitionNavigate();
  const { holders } = useAllHolders();

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
          const distributorsCount = getObjectFieldsCount(stock.distributors || {});

          const { name, id } = stock;
          const stockStatistic = getFullStatistic(period, stock.statistic);

          const stockData = {
            name,
            id,
            key: id,
            region,
            ...stockStatistic,
            distributorsCount,
          };

          if (accRegion) {
            if (!accRegion.children) {
              accRegion.children = [];
            }
            calcObjectFields(accRegion, "+", stockStatistic);
            accRegion.distributorsCount += distributorsCount;

            accRegion.children.push(stockData);
          } else {
            const name = bbtRegions.find(({ value }) => value === region)?.label || "Без региона";
            acc.push({
              ...stockData,
              name: name,
              key: region,
              id: null,
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
      <Space style={{ marginBottom: 8 }}>
        <Typography.Text>Период</Typography.Text>
        <Select
          defaultValue={initialPeriod}
          style={{ width: 100 }}
          onChange={handlePeriodChange}
          options={options}
        />
        <DownloadExcel
          columns={columns}
          dataSource={regionStocks}
          fileName={`Отчет за ${period}`}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={regionStocks}
        pagination={{ pageSize: 100 }}
        rowClassName={(record) => (record.children ? "table-background" : "")}
        expandable={{ expandRowByClick: true }}
        onRow={(data) => ({
          onClick: () => {
            if (data.id) {
              navigate(generatePath(routes.statisticStock, { stockId: data.id }));
            }
          },
        })}
        style={{ cursor: "pointer" }}
        scroll={{ x: "max-content" }}
      />
    </StockBaseLayout>
  );
};
