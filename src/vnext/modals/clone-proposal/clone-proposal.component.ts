import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { IAssociatedQuotes, IProposalList, ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-clone-proposal',
  templateUrl: './clone-proposal.component.html',
  styleUrls: ['./clone-proposal.component.scss']
})
export class CloneProposalComponent {

  associatedQuotes: Array<IAssociatedQuotes>;
  displayAssociatedQuotes: Array<IAssociatedQuotes>;
  dealId: string;
  selectedQuote: IAssociatedQuotes;
  quoteSelection = true;
  proposalListData: any = [];
  displayProposalListData: any = [];
  selectedProposal: IProposalList;
  searchPlaceHolder = this.localizationService.getLocalizedString('common.SEARCH_QUOTE_ID');
  searchValue = ''
  constructor(public ngbActiveModal: NgbActiveModal,public elementIdConstantsService: ElementIdConstantsService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public projectStoreService: ProjectStoreService, private eaRestService: EaRestService, private messageService: MessageService, private vnextService: VnextService, private eaService: EaService, public constantsService: ConstantsService) { }

  ngOnInit(): void {
    this.displayAssociatedQuotes = [...this.associatedQuotes];
  }

  getProposalListData() {
    this.proposalListData = [];
    const url = 'proposal/list';
    let reqObj = {
      "data":
      {
        "projectObjId": this.projectStoreService.projectData.objId
      }
    }
    this.eaRestService.postApiCall(url, reqObj).subscribe((res: any) => {
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(res, true)) {
        if (res.data.proposals?.length) {
          this.proposalListData = res.data.proposals;
          if(this.proposalListData?.length){
            this.searchPlaceHolder = this.localizationService.getLocalizedString('common.SEARCH_PROPOSAL_ID');
            this.displayProposalListData = [...this.proposalListData]
          }
        }
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(res);
      }

    });
  }

  close() {
    this.ngbActiveModal.close({
      // selectedQuote : this.selectedQuote
    });
  }

  updateQuoteDetail(quoteDetails: IAssociatedQuotes) {
    this.selectedQuote = quoteDetails;
  }

  selectProposalForClone(proposal: IProposalList) {
    this.selectedProposal = proposal;
  }

  goToProposalList(proposalListTab?) {
    this.searchValue = '';
    this.quoteSelection = !proposalListTab;
    this.selectedProposal = undefined
    this.displayProposalListData = []
    this.displayAssociatedQuotes = [...this.associatedQuotes];
    if (!this.quoteSelection) {
      this.displayAssociatedQuotes = []
      this.getProposalListData();
    }
  }

  clone() {
    const url = 'proposal/' + this.selectedProposal.objId + '/clone?q=' + this.selectedQuote.quoteId;
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(res, true)) {
        if (res.data.proposal) {
          this.ngbActiveModal.close({
            proposal: res.data.proposal
          });
        }
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // route to proposal
  goToProposal(data) {
    let index;
    let routeUrl;
    index = window.location.href.lastIndexOf(this.constantsService.EA);
    routeUrl = window.location.href.substring(0, index)
    
    const url  = routeUrl
    this.eaService.updateDetailsForNewTab();
     window.open(url + 'ea/project/proposal/' + data.objId);
  }

  searchQuote(event) {//local search based on user input
    if (event && event.value) {
      this.searchValue = event.value
      if(this.quoteSelection){
        this.displayAssociatedQuotes = this.associatedQuotes.filter(item => item.quoteId === this.searchValue);
      } else {
        this.displayProposalListData = this.proposalListData.filter(item => item.id === +this.searchValue);
      }
    } else {
      if(this.quoteSelection){
        this.displayAssociatedQuotes = [...this.associatedQuotes];
      } else {
        this.displayProposalListData = [...this.proposalListData]
      }
    }
  }

}
