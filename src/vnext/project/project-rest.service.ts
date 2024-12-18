import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectStoreService } from "vnext/project/project-store.service";
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { VnextService } from 'vnext/vnext.service';
import { EaService } from 'ea/ea.service';


@Injectable({
  providedIn: VnextResolversModule
})
export class ProjectRestService {

  constructor(private http: HttpClient, private vNextService: VnextService,private projectStoreService: ProjectStoreService, private eaService: EaService) { }

  getProjectDetailsByDealId(dealId){
    const url =  this.vNextService.getAppDomainWithContext + 'external/landing/project?did=' + dealId;
    return this.http.get(url)
  }
  

  addTeamMember(requestJson,teamType){

    const url =  this.vNextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId  +'/team/contacts?type=' +teamType ;
    return this.http.post(url,requestJson);

  }


   updateTeamMember(requestJson,teamType){
 
    const url =  this.vNextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId  +'/team/contacts?type=' +teamType ;
    return this.http.put(url,requestJson);
      
  }


   deleteTeamMember(user,teamType){
    let url =  this.vNextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId  +'/team/contact?userId=';

    if(this.eaService.features?.PARAMETER_ENCRYPTION){// send encrypted userid -- userIdSystem in the api 
      url =  url + user.userIdSystem;
    } else {
      url = url + user.userId + '&type=' + teamType;
    }

    // const url =  this.vNextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId  +'/team/contact?userId=' +userId  + '&type=' +teamType;
    return this.http.delete(url);

  }

  updateProjectName(requestObj){
    const url =  this.vNextService.getAppDomainWithContext + 'project/'+this.projectStoreService.projectData.objId+'/name' ;
    return this.http.put(url,requestObj)
  }

  getProjectDetailsById(projectObjId){
    const url =  this.vNextService.getAppDomainWithContext + 'project/'+projectObjId;
    return this.http.get(url)
  }

  searchMember(searchValue){
    const url =  this.vNextService.getAppDomainWithContext + 'lookup/user?s=' + searchValue;
    return this.http.get(url)
  }

  updateProject(projectObjId, reqJSON){
    const url = this.vNextService.getAppDomainWithContext + 'project/' + projectObjId + '/status';
    return this.http.put(url,reqJSON);
  }
}
