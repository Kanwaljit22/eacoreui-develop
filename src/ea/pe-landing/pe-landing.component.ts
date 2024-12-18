import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-pe-landing',
  templateUrl: './pe-landing.component.html',
  styleUrls: ['./pe-landing.component.scss']
})
export class PeLandingComponent implements OnInit {
  paramsId: any;
  billToId;
  cxOptOut;


  constructor(public eaRestService: EaRestService, private router: Router, public eaStoreService: EaStoreService, private activatedRoute: ActivatedRoute, private eaService: EaService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => { 
     this.paramsId = params.proposalId;
    })
    this.billToId = this.activatedRoute.snapshot.queryParamMap.get('billtoid'); 
    this.cxOptOut = this.activatedRoute.snapshot.queryParamMap.get('optOut');
    if(this.paramsId) {
      const encryptProposalID =  btoa(this.paramsId);
      const url = 'external/landing/proposal/?sepid=' + encryptProposalID +'=&reqSys=CCWR';
      this.eaRestService.getApiCall(url).subscribe((response: any) => {
        if (response && response.data) {
          if (response.data.hasEa2Entity) {
            if(this.billToId){
              this.router.navigate(['/qualifications/proposal/' + response.data.proposalId + '/priceestimate/' + this.billToId])
            } else {
              this.router.navigate(['/qualifications/proposal/' + response.data.proposalId + '/priceestimate'])
            }
          } else {
            this.eaStoreService.pePunchInLanding = true;
            if (this.cxOptOut) { // if cx is opt out call delink API then redirect to PE page.
              const url = 'proposal/' + response.data.proposalId + '?a=CX-HW-DELINK';
              this.eaRestService.getApiCall(url).subscribe((res: any) => {
                if (res && !res.error) {
                  this.router.navigate(['/ea/project/proposal/' + response.data.proposalId])
                }
              });
            } else {
              this.router.navigate(['/ea/project/proposal/' + response.data.proposalId])
           }  
          }
        }
      });
    }
  }
}
