import { Component, OnInit, OnDestroy } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-validate-doc-objid',
  templateUrl: './validate-doc-objid.component.html',
  styleUrls: ['./validate-doc-objid.component.scss']
})
export class ValidateDocObjidComponent implements OnInit, OnDestroy {

  constructor(private eaStoreService: EaStoreService, private router: Router, private eaRestService: EaRestService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {//http://localhost:8080/ngapi/proposal/610924a66ffcbb71e08b03b7/proposalobjectid --> get 
    //this.eaStoreService.displayProgressBar = true;
  
      this.getData()
  
  }

  ngOnDestroy() {
    this.eaStoreService.displayProgressBar = false;
  }

  getData(){
    const docObjid = this.activatedRoute.snapshot.params["docObjid"];
    const url = 'proposal/'+ docObjid + '/proposalobjectid'
    this.eaStoreService.displayProgressBar = true;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.eaStoreService.displayProgressBar = false;
      if(response.data){
        this.eaStoreService.docObjData = response.data
      }
      window.open('http://localhost:4200/#/ea/project/proposal/' + response.data.proposalObjectId + '/documents','_self');
    });
  }

}
