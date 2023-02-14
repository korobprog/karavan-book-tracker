import React, { Fragment } from "react";
import { Button, DatePicker } from "antd";
import { AppleOutlined } from "@ant-design/icons";
import { db } from "common/src/services/api/clientApp";
import { collection, getDocs } from "firebase/firestore";
import { $booksHashMap } from "common/src/services/books/index";
// @ts-ignore
import { saveAs } from "file-saver";
// @ts-ignore
import * as ExcelJS from "exceljs";

export const UsersStatistic = () => {
  const months = [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ];
  const monthFormat = "MM.YYYY";
  let hdr = [ "Имя", "Количество книг", "maha_big", "big", "medium", "small", "goswamibooks", "other", "Количество очков" ];
  let dropYear: any;
  let dropMonth: any;
  let operationsHeaders = new Set<string>(["Имя", "Количество книг", "Количество очков"]);

  const fetchPost = async () => {
    const operations = await getDocs(collection(db, "operations"));
    let result: any = {};
    let exportTable: any = [];
    operations.forEach((doc) => {
      const year = new Date(doc.data().date).getFullYear() === undefined ? "Unknown" : new Date(doc.data().date).getFullYear();
      const month = months[new Date(doc.data().date).getMonth()] === undefined ? "Unknown" : months[new Date(doc.data().date).getMonth()];
      const userName = doc.data().userName === undefined ? "Unknown" : doc.data().userName;
      const totalCount: any = doc.data().totalCount === undefined ? 0 : doc.data().totalCount;
      const totalPoints: any = doc.data().totalPoints === undefined ? 0 : doc.data().totalPoints;
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
      if (doc.data().books !== undefined) {
        for (let i = 0; i < doc.data().books.length; i++) {
          const id = doc.data().books[i].bookId;
          const cnt = doc.data().books[i].count;
          const category = bookHashMap[id].category.trim();
          operationsHeaders.add(category);
          if (result[year][month][userName][category] === undefined) {
            result[year][month][userName][category] = cnt;
          } else {
            result[year][month][userName][category] = result[year][month][userName][category] + cnt;
          }
        }
      }
    });

    let pickedYear: any = dropYear;
    let pickedMonth: any = months[dropMonth - 1];

    const k = Object.keys(result[pickedYear][pickedMonth]);
    for (const i of k) {
      let tempWrapper: any = {};
      tempWrapper = Object.assign({}, { Имя: i }, result[pickedYear][pickedMonth][i]);
      exportTable.push(tempWrapper);
    }
    hdr = hdr.filter((word) => Array.from(operationsHeaders.values()).includes(word));

    // creating excel file using exceljs library
    let ExcelJSWorkbook = new ExcelJS.Workbook();
    let worksheet = ExcelJSWorkbook.addWorksheet(dropMonth + "." + dropYear);
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
        dropMonth + "." + dropYear + ".xlsx"
      );
    });
  };

  const onChange = (date: any, dateString: any) => {
    dropMonth = dateString.split(".")[0];
    dropYear = dateString.split(".")[1];
  };

  return (
    <>
      <Button
        target="_blank"
        block
        size="large"
        icon={<AppleOutlined />}
        onClick={() => {
          fetchPost();
        }}
      >
        Загрузить статистику распространенных книг за месяц
      </Button>
      <DatePicker onChange={onChange} format={monthFormat} picker="month" />
    </>
  );
};
