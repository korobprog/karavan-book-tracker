import React, { Fragment, useState } from "react";
import { Button, DatePicker, Typography } from "antd";
import { AppleOutlined } from "@ant-design/icons";
import { getFirestore } from "firebase/firestore";
// import { db } from "common/src/services/api/clientApp";
import { collection, getDocs } from "firebase/firestore";
import { $booksHashMap } from "common/src/services/books/index";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import * as ExcelJS from "exceljs";

export const db = getFirestore();
const months = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
const monthFormat = "MM.YYYY";
let buttonDisabled = true;

export const UsersStatistic = () => {
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const { Title } = Typography;
  
  const downloadStatistic = async () => {
    let hdr = [ "Имя", "Количество книг", "maha_big", "big", "medium", "small", "goswamibooks", "other", "Количество очков" ];
    let operationsHeaders = new Set<string>(["Имя", "Количество книг", "Количество очков"]);
    try{
      const operations = await getDocs(collection(db, "operations"));
      let result: any = {};
      let exportTable: any = [];
      operations.forEach((doc) => {
        const {
          date,
          books,
          userName = 'Unknown',
          totalCount = 0,
          totalPoints = 0,
          } = doc.data();
        const year = new Date(date).getFullYear() === undefined ? "Unknown" : new Date(date).getFullYear();
        const month = months[new Date(date).getMonth()] === undefined ? "Unknown" : months[new Date(date).getMonth()];
        const bookHashMap = $booksHashMap.getState();
        if (result[year] === undefined) {
          result[year] = {};
        }
        if (result[year][month] === undefined) {
          result[year][month] = {};
        }
        if (result[year][month][userName] === undefined) {
          result[year][month][userName] = {};
        }
        if (result[year][month][userName]["Количество книг"] === undefined) {
          result[year][month][userName]["Количество книг"] = totalCount;
        } else {
          result[year][month][userName]["Количество книг"] =
            result[year][month][userName]["Количество книг"] + totalCount;
        }
        if (result[year][month][userName]["Количество очков"] === undefined) {
          result[year][month][userName]["Количество очков"] = totalPoints;
        } else {
          result[year][month][userName]["Количество очков"] =
            result[year][month][userName]["Количество очков"] + totalPoints;
        }
        if (books !== undefined) {
          for (let i = 0; i < books.length; i++) {
            const { bookId, count } = books[i];
            const category = bookHashMap[bookId].category.trim();
            operationsHeaders.add(category);
            if (result[year][month][userName][category] === undefined) {
              result[year][month][userName][category] = count;
            } else {
              result[year][month][userName][category] = result[year][month][userName][category] + count;
            }
          }
        }
      });
  
      const pickedYear = selectedYear;
      const pickedMonth = months[selectedMonth - 1];
  
      const k = Object.keys(result[pickedYear][pickedMonth]);
      for (const i of k) {
        let tempWrapper: any = {};
        tempWrapper = Object.assign({}, { Имя: i }, result[pickedYear][pickedMonth][i]);
        exportTable.push(tempWrapper);
      }
      hdr = hdr.filter((word) => Array.from(operationsHeaders.values()).includes(word));
  
      // creating excel file using exceljs library
      let ExcelJSWorkbook = new ExcelJS.Workbook();
      let worksheet = ExcelJSWorkbook.addWorksheet(selectedMonth + "." + selectedYear);
      worksheet.columns = hdr.map((value) => {
        return { header: value, key: value, width: 20 };
      });
      worksheet.addRows(exportTable);
      // inserting row with month and year
      const insertedRow = worksheet.insertRow(1, [pickedMonth + " " + pickedYear]);
      worksheet.mergeCells(1, 1, 1, hdr.length);
      worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
      worksheet.getCell("A1").font = { size: 12, bold: true };
      insertedRow.height = 27.5;
      // applying styles to table
      let rows = worksheet.getRows(2, exportTable.length + 1);
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
    buttonDisabled = false;
  };

  return (
    <>
      <Title level={5}>
        Статистика за месяц
      </Title>
      <DatePicker onChange={onChange} format={monthFormat} picker="month" />
      <Button
        target="_blank"
        disabled = {buttonDisabled}
        icon={<AppleOutlined />}
        onClick={() => {
          downloadStatistic();
        }}
      >
        Скачать
      </Button>
    </>
  );
};
