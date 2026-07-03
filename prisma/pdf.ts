function wrap(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function esc(s: string) {
  return s.replace(/([()\\])/g, "\\$1");
}

export function generateSamplePdf(title: string, author: string, blurb: string): Buffer {
  const objects: string[] = [];
  objects[1] = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  objects[2] = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  objects[3] =
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> ` +
    `/MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n`;
  objects[4] = `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  const lines = [
    `BT /F1 22 Tf 72 700 Td (${esc(title)}) Tj ET`,
    `BT /F1 13 Tf 72 665 Td (by ${esc(author)}) Tj ET`,
    ...wrap(blurb, 85).map((line, i) => `BT /F1 11 Tf 72 ${624 - i * 16} Td (${esc(line)}) Tj ET`),
    `BT /F1 9 Tf 72 90 Td (Sample preview page generated for the OpenShelf demo library.) Tj ET`,
  ];
  const streamContent = lines.join("\n");
  objects[5] = `5 0 obj\n<< /Length ${Buffer.byteLength(streamContent)} >>\nstream\n${streamContent}\nendstream\nendobj\n`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (let i = 1; i <= 5; i++) {
    offsets[i] = Buffer.byteLength(pdf);
    pdf += objects[i];
  }
  const xrefStart = Buffer.byteLength(pdf);
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}
