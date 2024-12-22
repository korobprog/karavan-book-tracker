import { useState } from "react";
import { Space, Button, Typography } from "antd";
import { DatePicker } from "common/src/components/DatePicker";
import { DownloadOutlined } from "@ant-design/icons";
import { getFirestore, query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { $booksHashMap } from "common/src/services/books/index";
// @ts-ignore
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import { useTranslation } from "react-i18next";

const db = getFirestore();

const monthFormat = "MM.YYYY";

type Props = {
  teamMembers: string[];
};

export const UsersStatistic = (props: Props) => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { Title } = Typography;

  const headersTranslation: Record<string, string> = {
    name: t("common.name"),
    books_count: t("common.books_count"),
    maha_big: t("common.book_category.mahabig"),
    big: t("common.book_category.big"),
    medium: t("common.book_category.medium"),
    small: t("common.book_category.small"),
    goswamibooks: t("common.book_category.goswamibooks"),
    other: t("common.book_category.other"),
    points: t("common.points"),
  };

  const months = [
    t("common.month.january"),
    t("common.month.february"),
    t("common.month.march"),
    t("common.month.april"),
    t("common.month.may"),
    t("common.month.june"),
    t("common.month.july"),
    t("common.month.august"),
    t("common.month.september"),
    t("common.month.october"),
    t("common.month.november"),
    t("common.month.december"),
  ];

  const downloadStatistic = async () => {
    let sortedHeader = [
      "name",
      "books_count",
      "maha_big",
      "big",
      "medium",
      "small",
      "goswamibooks",
      "other",
      "points",
    ];
    let operationsHeaders = new Set<string>(["name", "books_count", "points"]);
    try {
      const operationsQuery = query(
        collection(db, "operations"),
        where("userId", "in", props.teamMembers)
      );
      const operations = await getDocs(operationsQuery);
      let monthlyBooks: any = {};
      let exportTable: any = [];
      const pickedMonth = months[Number(selectedMonth)];
      operations.forEach((doc) => {
        const { date, books, userName = "Unknown", totalCount = 0, totalPoints = 0 } = doc.data();
        const year = new Date(date).getFullYear() ?? "Unknown";
        const month = new Date(date).getMonth() ?? "Unknown";
        const bookHashMap = $booksHashMap.getState();
        if (year === selectedYear && month === Number(selectedMonth) - 1) {
          monthlyBooks[userName] = monthlyBooks?.[userName] ?? {};
          monthlyBooks[userName].books_count =
            (monthlyBooks?.[userName]?.books_count || 0) + totalCount;
          monthlyBooks[userName].points = (monthlyBooks?.[userName]?.points || 0) + totalPoints;
          monthlyBooks[userName].name = monthlyBooks?.[userName]?.name ?? userName;
          if (books !== undefined) {
            for (let i = 0; i < books.length; i++) {
              const { bookId, count } = books[i];
              const category = bookHashMap[bookId].category;
              operationsHeaders.add(category);
              monthlyBooks[userName][category] =
                (monthlyBooks?.[userName]?.[category] ?? 0) + count;
            }
          }
        }
      });
      exportTable = Object.values(monthlyBooks);
      exportTable.sort((a: any, b: any) => b.points - a.points);
      sortedHeader = sortedHeader.filter((word) =>
        Array.from(operationsHeaders.values()).includes(word)
      );

      // creating excel file using exceljs library
      let ExcelJSWorkbook = new ExcelJS.Workbook();
      let worksheet = ExcelJSWorkbook.addWorksheet(selectedMonth + "." + selectedYear);
      worksheet.columns = sortedHeader.map((value) => {
        return { header: headersTranslation[value], key: value, width: 20 };
      });
      worksheet.addRows(exportTable);
      // inserting row with month and year
      const insertedRow = worksheet.insertRow(1, [pickedMonth + " " + selectedYear]);
      worksheet.mergeCells(1, 1, 1, sortedHeader.length);
      worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
      worksheet.getCell("A1").font = { size: 12, bold: true };
      insertedRow.height = 27.5;
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
        let colWidth = 10;
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
          selectedMonth + "." + selectedYear + ".xlsx"
        );
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onChange = (date: any, dateString: any) => {
    const [month, year] = dateString.split(".");
    setSelectedMonth(month);
    setSelectedYear(Number(year));
    setButtonDisabled(false);
  };

  return (
    <>
      <Title level={5}>{t("common.download_user_statistic.title")}</Title>
      <Space>
        <DatePicker onChange={onChange} format={monthFormat} picker="month" />
        <Button
          disabled={buttonDisabled}
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
