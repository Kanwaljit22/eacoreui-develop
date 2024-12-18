import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RecommendedContentService } from './recommended-content.service';
import { Subscription } from 'rxjs';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-center-recommended-content',
  templateUrl: './document-center-recommended-content.component.html',
  styleUrls: ['./document-center-recommended-content.component.scss']
})
export class DocumentCenterRecommendedContentComponent
  implements OnInit, OnDestroy {
  showCopy = -1;
  showCopy_saleshub = -1;
  apiCallComplete = false;
  rcmdContent_Subscription: Subscription;
  rcmdContentData: any;

  constructor(
    private recommendedcontent_service: RecommendedContentService,
    public proposalDataService: ProposalDataService,
    public appdataService: AppDataService,
    private constantsService: ConstantsService,
    private router: Router
  ) { }

  getTagsByArchitecture(value) {
    if (value === this.constantsService.DC) {
      return ConstantsService.SALESCONNECT_DC;
    } else if (value === this.constantsService.DNA) {
      return ConstantsService.SALESCONNECT_DNA;
    } else if (value === this.constantsService.SECURITY) {
      return ConstantsService.SALESCONNECT_SECURITY;
    }
  }

  ngOnInit() {
    this.appdataService.pageContext =
      AppDataService.PAGE_CONTEXT.documentCenter;

    if (this.router.url.includes('/group')) {
      this.appdataService.isGroupSelected = true;
    } else {
      this.appdataService.isGroupSelected = false;
    }

    let userAccessLevel: any;
    userAccessLevel = ConstantsService.EMPLOYEE;

    if (this.appdataService.userInfo.accessLevel === 3) {
      userAccessLevel = ConstantsService.PARTNER;
    }
    if (this.appdataService.userInfo.accessLevel === 4) {
      userAccessLevel = ConstantsService.EMPLOYEE;
    }

    // console.log('userAccessLevel' ,this.appdataService.userInfo.accessLevel)
    let architecture: any[] = [];
    this.apiCallComplete = false;
    if (this.appdataService.isGroupSelected) {
      architecture = this.proposalDataService.proposalDataObject.proposalData.linkedProposalsList.map(
        item => {
          return this.getTagsByArchitecture(item.architecture_code);
        }
      );
    } else {
      architecture.push(
        this.getTagsByArchitecture(
          this.proposalDataService.proposalDataObject.proposalData.archName
        )
      );
    }
    architecture.push(ConstantsService.SALESCONNECT_GENERAL);
    // console.log('architecture' , architecture);

    const searchquery = {
      source: 'EAMP-Latest',
      data: {
        tags: architecture,
        accesslevel: [userAccessLevel]
      }
    };

    this.rcmdContent_Subscription = this.recommendedcontent_service
      .getRecommendedContentData(searchquery)
      .subscribe((response: any) => {
        this.apiCallComplete = true;
        this.rcmdContentData = response.data.recomendedContent;
      });
  }

  downloadDocuments(url) {
    window.open(url);
  }

  shareDocuments(path, index, doc) {
    if (doc === 'saleshub') {
      this.showCopy_saleshub = this.showCopy_saleshub === index ? -1 : index;
      this.showCopy = -1;
    } else {
      this.showCopy = this.showCopy === index ? -1 : index;
      this.showCopy_saleshub = -1;
    }
  }

  copy(event) {
    console.log('event.target.previousSibling ', event.target.previousSibling);
    event.target.previousElementSibling.focus();
    event.target.previousElementSibling.select();
    document.execCommand('copy');
    event.target.innerHTML = 'Copied';
    event.target.style.cursor = 'default';
    setTimeout(() => {
      this.showCopy = -1;
      this.showCopy_saleshub = -1;
      event.target.innerHTML = 'Copy';
      event.target.style.cursor = 'pointer';
      event.target.disabled = false;
    }, 2000);
  }

  showSaleshubDetail(url) {
    window.open(url);
  }

  ngOnDestroy() {
    this.appdataService.isGroupSelected = false;
    this.rcmdContent_Subscription.unsubscribe();
  }
}
