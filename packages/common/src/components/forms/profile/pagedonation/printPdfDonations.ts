import jsPDF from "jspdf";

const printPdfDonations = () => {
  let url;
  const canvas = document.getElementById("myqrcode")?.querySelector<HTMLCanvasElement>("canvas");
  if (canvas) {
    url = canvas.toDataURL();
    const aref = document.createElement("a");
    aref.href = url;
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });
    //vertical lines
    doc.line(335, 1, 335, 800);
    doc.line(225, 1, 225, 800);
    doc.line(115, 1, 115, 800);
    //Horizontal lines
    doc.line(500, 135, 1, 135);
    doc.line(500, 270, 1, 270);
    doc.line(500, 410, 1, 410);
    //1 first line
    doc.addImage(canvas, "JPEG", 10, 25, 100, 100);
    doc.text("Donate to books", 10, 20);
    doc.addImage(canvas, "JPEG", 120, 25, 100, 100);
    doc.text("Donate to books", 120, 20);
    doc.addImage(canvas, "JPEG", 230, 25, 100, 100);
    doc.text("Donate to books", 230, 20);
    doc.addImage(canvas, "JPEG", 340, 25, 100, 100);
    doc.text("Donate to books", 340, 20);
    //2 first line
    doc.addImage(canvas, "JPEG", 10, 160, 100, 100);
    doc.text("Donate to books", 10, 150);
    doc.addImage(canvas, "JPEG", 120, 160, 100, 100);
    doc.text("Donate to books", 120, 150);
    doc.addImage(canvas, "JPEG", 230, 160, 100, 100);
    doc.text("Donate to books", 230, 150);
    doc.addImage(canvas, "JPEG", 340, 160, 100, 100);
    doc.text("Donate to books", 340, 150);
    //3 first line
    doc.addImage(canvas, "JPEG", 10, 300, 100, 100);
    doc.text("Donate to books", 10, 290);
    doc.addImage(canvas, "JPEG", 120, 300, 100, 100);
    doc.text("Donate to books", 120, 290);
    doc.addImage(canvas, "JPEG", 230, 300, 100, 100);
    doc.text("Donate to books", 230, 290);
    doc.addImage(canvas, "JPEG", 340, 300, 100, 100);
    doc.text("Donate to books", 340, 290);
    //4 first line
    doc.addImage(canvas, "JPEG", 10, 435, 100, 100);
    doc.text("Donate to books", 10, 425);
    doc.addImage(canvas, "JPEG", 120, 435, 100, 100);
    doc.text("Donate to books", 120, 425);
    doc.addImage(canvas, "JPEG", 230, 435, 100, 100);
    doc.text("Donate to books", 230, 425);
    doc.addImage(canvas, "JPEG", 340, 435, 100, 100);
    doc.text("Donate to books", 340, 425);
    doc.save("print.pdf");
  }
};
export default printPdfDonations;
