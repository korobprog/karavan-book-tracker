import React, { useState } from "react";
import { Space, Button, Typography } from "antd";
import { DatePicker } from "common/src/components/DatePicker";
import { DownloadOutlined } from "@ant-design/icons";
import { query, where } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { $booksHashMap } from "common/src/services/books/index";
import { apiRefs } from "common/src/services/api/refs";
// @ts-ignore
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import { useTranslation } from "react-i18next";

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const monthFormat = "YYYY-MM-DD";
const headersTranslation: any = {
  Имя: "Имя",
  "Количество книг": "Количество книг",
  maha_big: "МахаБиг",
  big: "Биг",
  medium: "Средние",
  small: "Маленькие",
  goswamibooks: "Книги Госвами",
  other: "Другие",
  "Количество очков": "Количество очков",
};

type Props = {
  currentUser: CurrentUser;
};

export const UserStatisticByBooks = ({ currentUser }: Props) => {
  const { t } = useTranslation();
  const [dateStringFrom, setDateStringFrom] = useState<string>();
  const [dateStringTo, setDateStringTo] = useState<string>();

  const downloadStatistic = async () => {
    // const [day, month, year] = dateString.split(".");

    let sortedHeader = ["Название", "Количество книг"];
    try {
      const operationsQuery = query(
        apiRefs.operations,
        where("userId", "==", currentUser.profile!.id),
        where("date", ">=", dateStringFrom),
        where("date", "<=", dateStringTo)
      );
      const operations = await getDocs(operationsQuery);
      console.log("🚀 ~ downloadStatistic ~ operations:", operations);

      const bookHashMap = $booksHashMap.getState();

      let periodBooks: any = {};
      operations.forEach((doc) => {
        const { books } = doc.data();
        if (books) {
          for (let i = 0; i < books.length; i++) {
            const { bookId, count } = books[i];
            periodBooks[bookId] = (periodBooks[bookId] ?? 0) + count;
          }
        }
      });
      console.log("🚀 ~ downloadStatistic ~ periodBooks:", periodBooks);
      const exportTable = Object.entries(periodBooks).map((value) => {
        value[0] = bookHashMap[value[0]].name;
        return value;
      });
      console.log("🚀 ~ downloadStatistic ~ exportTable:", exportTable);

      // creating excel file using exceljs library
      let ExcelJSWorkbook = new ExcelJS.Workbook();
      let worksheet = ExcelJSWorkbook.addWorksheet(dateStringFrom + " " + dateStringTo);
      worksheet.columns = sortedHeader.map((header) => {
        return { header, key: header, width: 20 };
      });
      worksheet.addRows(exportTable);
      // applying styles to table
      const rows = worksheet.getRows(2, exportTable.length + 1);
      rows?.forEach((row: any) => {
        for (const i of row._cells) {
          if (i) {
            worksheet.getCell(i._address.trim()).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
            worksheet.getCell(i._address.trim()).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
        }
      });
      //applying column widths
      let cols = worksheet.columns;
      cols?.forEach((cn) => {
        let colWidth = 30;
        if (cn.values) {
          for (const i of cn.values) {
            if (i) {
              colWidth = colWidth > String(i).length + 2 ? colWidth : String(i).length + 2;
            }
          }
        }
        cn.width = colWidth;
      });

      ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          dateStringFrom + " " + dateStringTo + ".xlsx"
        );
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isButtonDisabled = !dateStringFrom || !dateStringTo;

  return (
    <>
      <Typography.Title level={5}>
        {t("common.download_user_statistic_by_books.title")}
      </Typography.Title>
      <Space>
        <DatePicker
          onChange={(_, dateString) => setDateStringFrom(dateString)}
          format={monthFormat}
          picker="date"
          placeholder={t("common.download_user_statistic_by_books.date_from")}
        />
        <DatePicker
          onChange={(_, dateString) => setDateStringTo(dateString)}
          format={monthFormat}
          picker="date"
          placeholder={t("common.download_user_statistic_by_books.date_to")}
        />
        <Button
          disabled={isButtonDisabled}
          icon={<DownloadOutlined />}
          onClick={() => {
            downloadStatistic();
          }}
        >
          {t("common.download")}
        </Button>
      </Space>
    </>
  );
};
