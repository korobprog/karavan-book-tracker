import jsPDF from "jspdf";

const printPdfDonations88 = () => {
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
    doc.line(388, 1, 388, 800);
    doc.line(334, 1, 334, 800);
    doc.line(280, 1, 280, 800);
    doc.line(226, 1, 226, 800);
    doc.line(171, 1, 171, 800);
    doc.line(116, 1, 116, 800);
    doc.line(61, 1, 61, 800);
    //Horizontal lines
    doc.line(500, 8, 1, 8);
    doc.line(500, 63, 1, 63);
    doc.line(500, 117, 1, 117);
    doc.line(500, 172, 1, 172);
    doc.line(500, 227, 1, 227);
    doc.line(500, 282, 1, 282);
    doc.line(500, 337, 1, 337);
    doc.line(500, 392, 1, 392);
    doc.line(500, 447, 1, 447);
    doc.line(500, 502, 1, 502);
    doc.line(500, 557, 1, 557);
    doc.line(500, 612, 1, 612);
    //1 first line
    doc.addImage(canvas, "JPEG", 8, 10, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 10, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 10, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 10, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 10, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 10, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 10, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 10, 50, 50);
    //2 first line
    doc.addImage(canvas, "JPEG", 8, 65, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 65, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 65, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 65, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 65, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 65, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 65, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 65, 50, 50);
    //3 first line
    doc.addImage(canvas, "JPEG", 8, 120, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 120, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 120, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 120, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 120, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 120, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 120, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 120, 50, 50);
    //4 first line
    doc.addImage(canvas, "JPEG", 8, 175, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 175, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 175, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 175, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 175, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 175, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 175, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 175, 50, 50);
    //5 first line
    doc.addImage(canvas, "JPEG", 8, 230, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 230, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 230, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 230, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 230, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 230, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 230, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 230, 50, 50);
    //6 first line
    doc.addImage(canvas, "JPEG", 8, 285, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 285, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 285, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 285, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 285, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 285, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 285, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 285, 50, 50);
    //7 first line
    doc.addImage(canvas, "JPEG", 8, 340, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 340, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 340, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 340, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 340, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 340, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 340, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 340, 50, 50);
    //8 first line
    doc.addImage(canvas, "JPEG", 8, 395, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 395, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 395, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 395, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 395, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 395, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 395, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 395, 50, 50);
    //9 first line
    doc.addImage(canvas, "JPEG", 8, 450, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 450, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 450, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 450, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 450, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 450, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 450, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 450, 50, 50);
    //10 first line
    doc.addImage(canvas, "JPEG", 8, 505, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 505, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 505, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 505, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 505, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 505, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 505, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 505, 50, 50);
    //11 first line
    doc.addImage(canvas, "JPEG", 8, 560, 50, 50);
    doc.addImage(canvas, "JPEG", 63, 560, 50, 50);
    doc.addImage(canvas, "JPEG", 118, 560, 50, 50);
    doc.addImage(canvas, "JPEG", 174, 560, 50, 50);
    doc.addImage(canvas, "JPEG", 228, 560, 50, 50);
    doc.addImage(canvas, "JPEG", 282, 560, 50, 50);
    doc.addImage(canvas, "JPEG", 336, 560, 50, 50);
    doc.addImage(canvas, "JPEG", 390, 560, 50, 50);

    doc.save("print88.pdf");
  }
};
export default printPdfDonations88;
