import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'searchFilter'
})
export class SearchPipe implements PipeTransform {
    transform(value: any, input: string, searchFromFields: any) {
        if (input && value) {
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                return Object.keys(el).some(property => el[property] != null &&
                    el[property] !== undefined && searchFromFields &&
                    searchFromFields.includes(property) &&
                    el[property].toString().toLowerCase()
                        .includes(input));
            });
        }
        return value;
    }
}