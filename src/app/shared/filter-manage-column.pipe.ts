import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterManageColumn'
})
export class FilterManageColumnPipe implements PipeTransform {

  transform(columnList: any[], searchColumn: string) {
    if (!searchColumn) {
      return columnList;
    }
    const filteredColumns = columnList.filter(item => item.colName.toLowerCase().indexOf(searchColumn.toLowerCase()) > -1);
    return filteredColumns;

  }

}
