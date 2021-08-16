import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from "./images/warehouse_logo_pdf2.png";

const generateRecieptPDF = (data, startDate, endDate) => {
  let tableRows = [];
  let head = [];
  let y = 85;

  const doc = new jsPDF('p', 'mm');
  let pageHeight = doc.internal.pageSize.height;
  let startDateArray = startDate.split("-").reverse();
  let endDateArray = endDate.split("-").reverse();

  //Logo slika
  doc.addImage(logo, 15, 20, 41, 35);

  //PDF naslov
  doc.setFont('Comic Sans');
  doc.setFontSize(22);
  doc.text("PREUZIMANJA", 138.5, 22);

  //Naziv stranice
  doc.setFontSize(15);
  doc.text("Upravljanje skladištima", 140, 32);
  doc.setFontSize(13);
  doc.line(130, 36, 200, 36);

  //Url
  doc.text("www.upravljanjeskladistima.hr", 136, 42);

  //Period izvještaja
  doc.text("Izvještaj za period " + startDateArray.join(".") + "." + " do " + endDateArray.join(".") + ".", 115.1, 60);


  //Prijelom linija
  doc.setLineWidth(1.1);
  doc.setDrawColor(181, 181, 181);
  doc.line(0, 65, 220, 65);

  //Postavi font za tablicu
  doc.setFontSize(16);
  doc.setDrawColor(0, 0, 0);

  data.forEach((warehouse, i) => {
    head = [
      [
        { content: 'Naziv skladista: ' + warehouse.warehouse_name, colSpan: 2, styles: { halign: 'center', fillColor: [20, 151, 124] } },
        { content: 'Lokacija: ' + warehouse.location_name, colSpan: 2, styles: { halign: 'center', fillColor: [20, 151, 124] } },
        { content: 'Grad: ' + warehouse.city_name, colSpan: 1, styles: { halign: 'center', fillColor: [20, 151, 124] } }
      ],
      [
        { content: 'Proizvod', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kategorija', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Potkategorija', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Ambalaza', colSpan: 1, styles: { halign: 'center' } },
        { content: 'Kolicina', colSpan: 1, styles: { halign: 'center' } }
      ],
    ];
    tableRows = [];
    warehouse.data.forEach(item => {
      const itemData = [
        item.product_name,
        item.category_name,
        item.subcategory_name,
        item.packaging_name,
        item.quantity,
      ];
      tableRows.push(itemData);
    });
    if (i != 0 && doc.lastAutoTable.finalY && y >= pageHeight) {
      doc.addPage();
      y = 0
    }
    else if (i != 0) {
      y = doc.lastAutoTable.finalY + 15
    }
    let number = 2;
    doc.autoTable({
      startY: y,
      head: head,
      body: tableRows,
      theme: 'grid',
      tableWidth: 'auto',
      styles: {
        cellPadding: { top: number, right: number, bottom: number, left: number },
      },
      bodyStyles: { halign: 'center', valign: 'middle' },
      headStyles: { halign: 'center', valign: 'middle' },
      didParseCell: enhanceWordBreak
    });
  });
  let dateStr = startDateArray.join("_") + "_do_" + endDateArray.join("_");

  doc.save(`izvještaj_preuzimanja_${dateStr}.pdf`);
};

function enhanceWordBreak({ doc, cell, column }) {
  if (cell === undefined) {
    return;
  }

  const hasCustomWidth = (typeof cell.styles.cellWidth === 'number');

  if (hasCustomWidth || cell.raw == null || cell.colSpan > 1) {
    return
  }

  let text;

  if (cell.raw instanceof Node) {
    text = cell.raw.innerText;
  } else {
    if (typeof cell.raw == 'object') {
      return;
    } else {
      text = '' + cell.raw;
    }
  }

  const words = text.split(/\s+/);

  const maxWordUnitWidth = words.map(s => Math.floor(doc.getStringUnitWidth(s) * 100) / 100).reduce((a, b) => Math.max(a, b), 0);
  const maxWordWidth = maxWordUnitWidth * (cell.styles.fontSize / doc.internal.scaleFactor)

  const minWidth = cell.padding('horizontal') + maxWordWidth;

  if (minWidth > cell.minWidth) {
    cell.minWidth = minWidth;
  }

  if (cell.minWidth > cell.wrappedWidth) {
    cell.wrappedWidth = cell.minWidth;
  }

  if (cell.minWidth > column.minWidth) {
    column.minWidth = cell.minWidth;
  }

  if (column.minWidth > column.wrappedWidth) {
    column.wrappedWidth = column.minWidth;
  }
}

export default generateRecieptPDF;