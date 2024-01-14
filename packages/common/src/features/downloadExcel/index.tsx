import React from "react";
import { Space, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { DownloadOutlined } from "@ant-design/icons";
// @ts-ignore
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";

type BaseDataType = {
  key: string;
  name: string;
  children?: BaseDataType[];
};

type Props<DataType extends BaseDataType> = {
  columns: ColumnsType<DataType>;
  dataSource: DataType[];
  fileName: string;
  listTitle?: string;
  disabled?: boolean;
};

const downloadStatistic = <DataType extends BaseDataType>(props: Props<DataType>) => {
  const { columns, dataSource, fileName, listTitle = fileName } = props;
  try {
    const Workbook = new ExcelJS.Workbook();
    const worksheet = Workbook.addWorksheet(listTitle);
    worksheet.columns = columns.map(({ title, key }) => {
      return { header: String(title), key: String(key), width: 20 };
    });

    dataSource.forEach((data) => {
      const row = worksheet.addRow(data);
      if (data.key === "total") {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "e6f4ff" },
        };
      }
      if (data.children) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "fffbe6" },
        };
        worksheet.addRows(data.children);
      }
    });

    Workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName + ".xlsx");
    });
  } catch (e) {
    console.error(e);
  }
};

export const DownloadExcel = <DataType extends BaseDataType>(props: Props<DataType>) => {
  return (
    <>
      <Space>
        <Button
          disabled={props.disabled}
          icon={<DownloadOutlined />}
          onClick={() => {
            downloadStatistic(props);
          }}
        >
          Скачать
        </Button>
      </Space>
    </>
  );
};
