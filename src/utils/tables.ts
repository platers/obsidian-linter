// based on https://github.com/alanwsmith/markdown_table_formatter

import { getEAW } from 'meaw';

function computeWidth(str: string) {
  let width = 0;
  const normalized = str.normalize('NFC');

  for (const char of normalized) {

    switch (getEAW(char)) {
      case 'F':
      case 'W':
        width += 2;
        break;
      case 'A':
        width += 2;
        break;
      default:
        width += 1;
    }
  }
  return width;

}

export class MarkdownTableFormatter {
  private cells: string[][];
  private columnWidths: number[];
  private outputTable: string;
  static formatTable: string;


  constructor() {
    this.cells = [];
    this.columnWidths = [];
    this.outputTable = "";
  }

  private getColumnWidths() {
    this.columnWidths = [];
    for (let row_i = 0, row_l = this.cells.length; row_i < row_l; row_i++) {
      for (let col_i = 0, col_l = this.cells[row_i].length; col_i < col_l; col_i++) {
        const strLen = computeWidth(this.cells[row_i][col_i]);
        if (this.columnWidths[col_i] === undefined || this.columnWidths[col_i] < strLen) {
          this.columnWidths[col_i] = strLen;
        }
      }
    }
  }

  private importTable(table: string) {
    const tableRows = table.split("\n");

    // Remove leading empty lines
    while (tableRows[0].indexOf('|') === -1) {
      tableRows.shift();
    }

    for (let row_i = 0, row_l = tableRows.length; row_i < row_l; row_i++) {
      if (tableRows[row_i].indexOf('|') === -1) {
        continue;
      }

      this.cells[row_i] = [];

      const rowColumns = tableRows[row_i].split("\|");

      for (let col_i = 0, col_l = rowColumns.length; col_i < col_l; col_i++) {
        this.cells[row_i][col_i] = rowColumns[col_i].trim();

        // If it's the separator row, parse down the dashes
        if (row_i === 1) {
          this.cells[row_i][col_i] = this.cells[row_i][col_i].replace(/-+/g, "-");
        }
      }
    }


    // Remove leading and trailing rows if they are empty.
    this.getColumnWidths();

    if (this.columnWidths[0] === 0) {
      for (let row_i = 0, row_l = this.cells.length; row_i < row_l; row_i++) {
        this.cells[row_i].shift();
      }
    }

    this.getColumnWidths();

    // Check to see if the last item in column widths is empty
    if (this.columnWidths[this.columnWidths.length - 1] === 0) {
      for (let row_i = 0, row_l = this.cells.length; row_i < row_l; row_i++) {
        if (this.cells[row_i].length === this.columnWidths.length) {
          this.cells[row_i].pop();
        }
      }
    }

    this.getColumnWidths();
  }


  private addMissingCellColumns() {
    for (let row_i = 0, row_l = this.cells.length; row_i < row_l; row_i++) {
      for (let col_i = 0, col_l = this.columnWidths.length; col_i < col_l; col_i++) {
        if (typeof this.cells[row_i][col_i] === 'undefined') {
          this.cells[row_i][col_i] = '';
        }
      }
    }
  }

  private padCellsForOutput() {
    for (let row_i = 0, row_l = this.cells.length; row_i < row_l; row_i++) {
      const padChar = (row_i !== 1) ? ' ' : '-';
      for (let col_i = 0, col_l = this.cells[row_i].length; col_i < col_l; col_i++) {
        const strLen = computeWidth(this.cells[row_i][col_i]);
        if (strLen < this.columnWidths[col_i]) {
          this.cells[row_i][col_i] += padChar.repeat(this.columnWidths[col_i] - strLen);
        }
      }
    }
  }

  public formatTable(table: string) {
    this.importTable(table);
    this.getColumnWidths();
    this.addMissingCellColumns();
    this.padCellsForOutput();

    // Header
    this.outputTable = "| ";
    this.outputTable += this.cells[0].join(" | ");
    this.outputTable += " |\n";

    // Separator 
    this.outputTable += "|-";
    this.outputTable += this.cells[1].join("-|-");
    this.outputTable += "-|\n";

    for (let row_i = 2, row_l = this.cells.length; row_i < row_l; row_i++) {
      this.outputTable += "| ";
      this.outputTable += this.cells[row_i].join(" | ");
      this.outputTable += " |\n";
    }

    return this.outputTable;
  }
}
