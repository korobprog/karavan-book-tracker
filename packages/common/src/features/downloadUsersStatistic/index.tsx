import React, { useState } from "react";
import { Space, Button, DatePicker, Typography } from "antd";
import { AppleOutlined } from "@ant-design/icons";
import { getFirestore, query, where } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { $booksHashMap } from "common/src/services/books/index";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import * as ExcelJS from "exceljs";

const db = getFirestore();
const months = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
const monthFormat = "MM.YYYY";
const headersTranslation: any = { "Имя": "Имя", "Количество книг": "Количество книг", "maha_big": "МахаБиг", "big": "Биг", "medium": "Средние", "small": "Маленькие", "goswamibooks": "Книги Госвами", "other": "Другие", "Количество очков": "Количество очков" };

type Props = {
  teamMembers: string[];
};

export const UsersStatistic = (props: Props) => {
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { Title } = Typography;
  
  const downloadStatistic = async () => {
    let sortedHeader = [ "Имя", "Количество книг", "maha_big", "big", "medium", "small", "goswamibooks", "other", "Количество очков" ];
    let operationsHeaders = new Set<string>(["Имя", "Количество книг", "Количество очков"]);
    try{
      const operationsQuery = query(collection(db, "operations"), where("userId", "in", props.teamMembers));
      const operations = await getDocs(operationsQuery);
      let monthlyBooks: any = {};
      let exportTable: any = [];
      const pickedMonth = months[selectedMonth - 1];
      operations.forEach((doc) => {
        const {
          date,
          books,
          userName = 'Unknown',
          totalCount = 0,
          totalPoints = 0,
          } = doc.data();
        const year = new Date(date).getFullYear() ?? "Unknown";
        const month = new Date(date).getMonth() ?? "Unknown";
        const bookHashMap = $booksHashMap.getState();
        if(year === selectedYear || month === (Number(selectedMonth) - 1)){
          monthlyBooks[userName] = monthlyBooks?.[userName] ?? {};
          monthlyBooks[userName]["Количество книг"] = (monthlyBooks?.[userName]?.["Количество книг"] || 0) + totalCount;
          monthlyBooks[userName]["Количество очков"] = (monthlyBooks?.[userName]?.["Количество очков"] || 0) + totalPoints;
          monthlyBooks[userName]["Имя"] = monthlyBooks?.[userName]?.["Имя"] ?? userName;
          if (books !== undefined) {
            for (let i = 0; i < books.length; i++) {
              const { bookId, count } = books[i];
              const category = bookHashMap[bookId].category;
              operationsHeaders.add(category);
              monthlyBooks[userName][category] = (monthlyBooks?.[userName]?.[category] ?? 0) + count;
            }
          }
        }
      });
      exportTable = Object.values(monthlyBooks);
      exportTable.sort((a: any, b: any) => b['Количество очков'] - a['Количество очков']);
      sortedHeader = sortedHeader.filter((word) => Array.from(operationsHeaders.values()).includes(word));
  
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
    } catch(e){
      console.error(e);
    }
  };

  const onChange = (date: any, dateString: any) => {
    const [month, year] = dateString.split(".");
    setSelectedMonth(month);
    setSelectedYear(year);
    setButtonDisabled(false);
  };

  return (
    <>
      <Title level={5}>
        Статистика за месяц
      </Title>
      <Space>
        <DatePicker onChange={onChange} format={monthFormat} picker="month" />
        <Button
          disabled = {buttonDisabled}
          icon={<AppleOutlined />}
          onClick={() => {
            downloadStatistic();
          }}
        >
          Скачать
        </Button>
      </Space>
    </>
  );
};
