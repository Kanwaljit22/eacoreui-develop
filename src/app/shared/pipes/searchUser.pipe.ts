import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchUserFilter'
})
export class SearchUserPipe implements PipeTransform {
    transform(value: any, input: string) {
        if (input) {
            // console.log(value);
            input = input.toLowerCase();
            return value.filter(function (el: any) {
               // console.log(el);
                //return el.name.toLowerCase().indexOf(input) > -1;
                return ((el.userId && el.userId.toLowerCase().indexOf(input) > -1));
            });
        }
        return value;
    }
}