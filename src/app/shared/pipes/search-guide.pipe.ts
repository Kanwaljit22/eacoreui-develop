import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'searchGuideFilter'
})
export class SearchGuidePipe implements PipeTransform {
    transform(value: any, input: string) {
        if (input) {
            console.log(value);
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                console.log(el);
                return ((el.pageContext && el.pageContext.toLowerCase().indexOf(input) > -1) ||
                (el.pageHeader && el.pageHeader.toLowerCase().indexOf(input) > -1));
            });
        }
        return value;
    }
}
