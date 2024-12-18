
import { Injectable } from '@angular/core';
import { EaService } from 'ea/ea.service';
import { ProjectResolversModule } from 'vnext/project/project-resolvers.module';




@Injectable({
  providedIn: ProjectResolversModule
})
export class CiscoTeamService {

  constructor(private eaService: EaService) { }

  isAllWebExSelected(ciscoTeamArray) {
    return ciscoTeamArray.every((member) => {
      return member.webexNotification ? true : false;
    });
  }

  isAllWlecomeKitSelected(ciscoTeamArray) {
    return ciscoTeamArray.every((member) => {
      return member.notifyByWelcomeKit ? true : false;
    });
  }

  updateAllTeamMember(teamArray, isSeletced,notificationType){
    const request = []
    teamArray.forEach(member => {
      member[notificationType] = isSeletced;
      request.push({[notificationType]: member[notificationType], userId: member.userId})
    });
    return {data: request};
  }

  updateTeamMember(member,notificationType){
    const requestObj = {
      userId: member.userId
    }
    requestObj[notificationType] =  member[notificationType]

    return {data: [requestObj]};
  }
  addMember(selectedMembers,webexAddCheck,welcomeAddCheck){
    const requestObj = []
    selectedMembers.forEach(member => {
      const memberObj = {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        userId: member.ccoId,
        notification: true,
        webexNotification: webexAddCheck,
        notifyByWelcomeKit: welcomeAddCheck,
        role:member.jobTitle
      }
      if(member?.ccoIdSystem && this.eaService.features?.PARAMETER_ENCRYPTION){
        memberObj['userIdSystem'] = member.ccoIdSystem;
      }
      requestObj.push(memberObj)
    });

    return {data: requestObj};
  }
}
