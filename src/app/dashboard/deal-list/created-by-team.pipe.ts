import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'createdByTeam'
})
export class CreatedByTeamPipe implements PipeTransform {
  transform(myDeals: any[], createdByTeam: boolean, loggedInUser: string, isDashboard): any {
    if (createdByTeam && !isDashboard) {
      return myDeals.filter(item => item.dealCreator !== loggedInUser);
    }
    if (createdByTeam && isDashboard) {   
      const newArray = myDeals.filter(item => item.dealCreator !== loggedInUser);
      return newArray.slice(0, 5);
    }
    return myDeals;
  }
}
