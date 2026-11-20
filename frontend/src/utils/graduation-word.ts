import JSZip from 'jszip';

export interface WordParagraph {
  text: string;
  style?: 'title' | 'subtitle' | 'heading' | 'body';
  align?: 'left' | 'center' | 'right';
  pageBreakBefore?: boolean;
}

export interface WordCell {
  paragraphs: WordParagraph[];
  span?: number;
  merge?: 'restart' | 'continue';
  vertical?: boolean;
}

export interface WordTable {
  columns: number[];
  rows: WordCell[][];
}

export type WordBlock = WordParagraph | WordTable;

const styles = {
  title: { size: 36, bold: true, before: 0, after: 300 },
  subtitle: { size: 28, bold: true, before: 0, after: 220 },
  heading: { size: 22, bold: true, before: 110, after: 70 },
  body: { size: 21, bold: false, before: 0, after: 65 },
};

function xml(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function paragraph(value: WordParagraph): string {
  const style = styles[value.style ?? 'body'];
  const line = value.text.split(/\r?\n/).map(text => `<w:t xml:space="preserve">${xml(text)}</w:t>`).join('<w:br/>');
  return `<w:p><w:pPr>${value.style === 'title' || value.style === 'subtitle' || value.style === 'heading' ? '<w:keepNext/>' : ''}${value.pageBreakBefore ? '<w:pageBreakBefore/>' : ''}<w:spacing w:before="${style.before}" w:after="${style.after}" w:line="320" w:lineRule="auto"/><w:jc w:val="${value.align ?? 'left'}"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="宋体"/>${style.bold ? '<w:b/>' : ''}<w:sz w:val="${style.size}"/><w:szCs w:val="${style.size}"/></w:rPr>${line}</w:r></w:p>`;
}

function table(value: WordTable): string {
  const border = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
    .map(side => `<w:${side} w:val="single" w:sz="6" w:color="000000"/>`).join('');
  const grid = value.columns.map(width => `<w:gridCol w:w="${width}"/>`).join('');
  const rows = value.rows.map(row => {
    let column = 0;
    return `<w:tr>${row.map(cell => {
      const span = cell.span ?? 1;
      const width = value.columns.slice(column, column + span).reduce((sum, size) => sum + size, 0);
      column += span;
      return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ''}${cell.merge ? `<w:vMerge w:val="${cell.merge}"/>` : ''}${cell.vertical ? '<w:textDirection w:val="tbRlV"/>' : ''}<w:vAlign w:val="center"/></w:tcPr>${(cell.paragraphs.length ? cell.paragraphs : [{ text: '' }]).map(paragraph).join('')}</w:tc>`;
    }).join('')}</w:tr>`;
  }).join('');
  return `<w:tbl><w:tblPr><w:tblW w:w="${value.columns.reduce((sum, size) => sum + size, 0)}" w:type="dxa"/><w:tblBorders>${border}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="55" w:type="dxa"/><w:left w:w="110" w:type="dxa"/><w:bottom w:w="55" w:type="dxa"/><w:right w:w="110" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rows}</w:tbl>`;
}

const wordMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export async function createGraduationWordDocument(blocks: WordBlock[]): Promise<Blob> {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="${wordMime}.main+xml"/></Types>`);
  zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  const body = blocks.map(block => 'rows' in block ? table(block) : paragraph(block)).join('');
  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1248" w:bottom="1134" w:left="1248" w:header="600" w:footer="600" w:gutter="0"/></w:sectPr></w:body></w:document>`);
  return zip.generateAsync({ type: 'blob', mimeType: wordMime, compression: 'DEFLATE' });
}
