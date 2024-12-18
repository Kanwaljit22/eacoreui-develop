import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EaStoreService } from './ea-store.service';



@Injectable()

export class EaRestService {
  constructor(private http: HttpClient, private eaStoreService: EaStoreService) {
  }

   

    public getAppDomainWithContext(){
      if(this.eaStoreService.isValidationUI){
        return '../../vuingapi/';
      } else {
        return '../../ngapi/';
      }
    }


    get getTwoDotZeroAppDomain() {
      // return this.appDomain + this.appPath;
      return '../../api/';
      // return '/';
    }

    public getEampApiCall(url: string) {
      return this.http.get(this.getTwoDotZeroAppDomain+url);
  }


    public getApiCall(url: string) {
      return this.http.get(this.getAppDomainWithContext()+url);
  }


    public getApiCallJson(url:string) {
    
      return this.http.get(url)
       
    }
  
    public postApiCall(url:string,requestObject:any) {
      return this.http.post(this.getAppDomainWithContext()+url,requestObject)
      
    }
  
  
    public putApiCall(url:string,requestObject:any) {
      return this.http.put(this.getAppDomainWithContext()+url,requestObject)
     
    }
    
    public deleteApiCall(url:string) {
      return this.http.delete(this.getAppDomainWithContext()+url)       
    }

  // api download any document
  public downloadDocApiCall(url: string) {
    return this.http.get(this.getAppDomainWithContext() + url, { observe: 'response', responseType: 'blob' as 'json' })
  }

  public downloadPostApiCall(url:string,requestObject:any) {
    return this.http.post(this.getAppDomainWithContext()+url,requestObject, { observe: 'response', responseType: 'blob' as 'json' })
  }
}