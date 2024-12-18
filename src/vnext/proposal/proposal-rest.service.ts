import { HttpClient } from '@angular/common/http';
import { VnextResolversModule } from './../vnext-resolvers.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProposalRestService {

 

  constructor(private http: HttpClient) { }

  public getApiCall(url:string) {
    
    return this.http.get(url)
     
  }

  public postApiCall(url:string,requestObject:any) {
    return this.http.post(url,requestObject)
    
  }


  public putApiCall(url:string,requestObject:any) {
    return this.http.put(url,requestObject)
   
  }
  public deleteApiCall(url:string) {
    
    return this.http.delete(url)
     
  }

  // api download any document
  public downloadDocApiCall(url: string) {
    return this.http.get(url, { observe: 'response', responseType: 'blob' as 'json' })
  }

}
