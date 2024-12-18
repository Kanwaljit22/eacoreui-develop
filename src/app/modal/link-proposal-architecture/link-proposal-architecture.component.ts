import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { LinkProposalArchitectureService } from './link-proposal-architecture.service';
import { MessageType } from '@app/shared/services/message';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageService } from '@app/shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';

@Component({
  selector: 'app-link-proposal-architecture',
  templateUrl: './link-proposal-architecture.component.html',
  styleUrls: ['./link-proposal-architecture.component.scss']
})
export class LinkProposalArchitectureComponent implements OnInit {

  @Input() deLinkProposal;
  linkingForGroup = false;
  linkUnMatchProposalData = [];
  linkMatchProposalData = [];
  linkedProposalData = [];
  showMessage = false;
  matchingProposalsMsg = false;
  unmatchedProposalsMsg = false;
  matchingProposalMap: Map<string, MatchedProposal> = new Map<string, MatchedProposal>();
  unmatchingProposalMap: Map<string, MatchedProposal> = new Map<string, MatchedProposal>();
  showExpandAll = true;
  eligible = true;
  disableProposalMsg = false;
  showMSPError = false;
  linkableProposalData = [];

  constructor(public localeService: LocaleService, public utilitiesService: UtilitiesService, public activeModal: NgbActiveModal,
    public constantsService: ConstantsService, public messageService: MessageService, public proposalDataService: ProposalDataService,
    public linkProposalArchitectureService: LinkProposalArchitectureService,
    public blockUiService: BlockUiService, public appDataService: AppDataService) { }

  ngOnInit() {
    this.messageService.clear();
    // get the data to show in link and de-link modal depending on deLinkProposal
    if (this.deLinkProposal) {
      // get the linked data after linking proposals
      this.getLinkedProposalData();
    } else {

      if (this.proposalDataService.proposalDataObject.proposalData.groupId > -1) {
        this.linkingForGroup = true;
      }
      this.linkProposalArchitectureService.selectedProposals = [];
      // get the linkable data for linking proposals
      this.getLinkableProposalData();
    }
  }

  // get the linkable data from api to display on link modal
  getLinkableProposalData() {
    this.linkProposalArchitectureService.getLinkableProposalData().subscribe((response: any) => {
      if (response && !response.error) {
        this.blockUiService.spinnerConfig.unBlockUI();
        if (response.data) {
          if (response.data.matchingProposal.length > 1) {
            this.disableProposalMsg = true;
          }
          if (response.data.matchingProposal && response.data.matchingProposal.length > 0) {

            this.linkableProposalData = response.data.matchingProposal;
            // creating map of proposals on the basis of the archName
            const matchedProposals = response.data.matchingProposal;
            for (let i = 0; i < matchedProposals.length; i++) {
              let matchedProposal: MatchedProposal = { architecture: '', proposals: [], expand: false };
              if (matchedProposals[i].linkedProposal) {
                if (this.matchingProposalMap.has('Cross Architecture')) {
                  matchedProposal = this.matchingProposalMap.get('Cross Architecture');
                  matchedProposal.proposals.push({ 'name': matchedProposals[i].proposal_group_name,
                  'id': matchedProposals[i].proposal_group_id, 'architecture': 'Cross Architecture',
                  'linkedProposal': matchedProposals[i].linkedProposal });
                  this.matchingProposalMap.set('Cross Architecture', matchedProposal);
                } else {
                  matchedProposal.architecture = 'Cross Architecture';
                  matchedProposal.proposals.push({ 'name': matchedProposals[i].proposal_group_name,
                  'id': matchedProposals[i].proposal_group_id, 'architecture': 'Cross Architecture',
                  'linkedProposal': matchedProposals[i].linkedProposal });
                  this.matchingProposalMap.set('Cross Architecture', matchedProposal);
                }
              } else {
                // for adding proposal if archname is already added as key in the map.
                if (this.matchingProposalMap.has(matchedProposals[i].architecture)) {
                  // retrive all the added proposal for key(archName), add the new proposal and again set in the map.
                  matchedProposal = this.matchingProposalMap.get(matchedProposals[i].architecture);
                  matchedProposal.proposals.push(matchedProposals[i]);
                  this.matchingProposalMap.set(matchedProposals[i].architecture, matchedProposal);
                } else {
                  // if archname is not present in the key, set archname and array of proposal in the map.
                  matchedProposal.architecture = matchedProposals[i].architecture;
                  matchedProposal.proposals.push(matchedProposals[i]);
                  this.matchingProposalMap.set(matchedProposal.architecture, matchedProposal);
                }
              }
              matchedProposal.expand = true;
            }

            // converting to array bcoz using map in html was giving multiple errors on console;
            this.linkMatchProposalData = Array.from(this.matchingProposalMap.values());
          } else {
            // if no matching proposal then display info msg
            this.matchingProposalsMsg = true;
          }
          if (response.data.nonMatchingProposal && response.data.nonMatchingProposal.length > 0) {
            // assign the unmatching data for displaying in modal

            const unmatchedProposals = response.data.nonMatchingProposal;
            for (let i = 0; i < unmatchedProposals.length; i++) {
              let unmatchedProposal: MatchedProposal = { architecture: '', proposals: [], expand: false };
              if (unmatchedProposals[i].linkedProposal) {
                if (this.unmatchingProposalMap.has('Cross Architecture')) {
                  unmatchedProposal = this.unmatchingProposalMap.get('Cross Architecture');
                  unmatchedProposal.proposals.push({ 'name': unmatchedProposals[i].proposal_group_name,
                  'id': unmatchedProposals[i].proposal_group_id, 'architecture': 'Cross Architecture',
                  'linkedProposal': unmatchedProposals[i].linkedProposal });
                  this.unmatchingProposalMap.set('Cross Architecture', unmatchedProposal);
                } else {
                  unmatchedProposal.architecture = 'Cross Architecture';
                  unmatchedProposal.proposals.push({ 'name': unmatchedProposals[i].proposal_group_name,
                  'id': unmatchedProposals[i].proposal_group_id, 'architecture': 'Cross Architecture',
                  'linkedProposal': unmatchedProposals[i].linkedProposal });
                  this.unmatchingProposalMap.set('Cross Architecture', unmatchedProposal);
                }
              } else {
                // for adding proposal if archname is already added as key in the map.
                if (this.unmatchingProposalMap.has(unmatchedProposals[i].architecture)) {
                  // retrive all the added proposal for key(archName), add the new proposal and again set in the map.
                  unmatchedProposal = this.unmatchingProposalMap.get(unmatchedProposals[i].architecture);
                  unmatchedProposal.proposals.push(unmatchedProposals[i]);
                  this.unmatchingProposalMap.set(unmatchedProposals[i].architecture, unmatchedProposal);
                } else {
                  // if archname is not present in the key, set archname and array of proposal in the map.
                  unmatchedProposal.architecture = unmatchedProposals[i].architecture;
                  unmatchedProposal.proposals.push(unmatchedProposals[i]);
                  this.unmatchingProposalMap.set(unmatchedProposal.architecture, unmatchedProposal);
                }
              }
              unmatchedProposal.expand = true;
            }
            // converting to array bcoz using map in html was giving multiple errors on console;
            this.linkUnMatchProposalData = Array.from(this.unmatchingProposalMap.values());
          } else {
            // if no unmatched proposal then display info msg
            this.unmatchedProposalsMsg = true;
          }
          // for showing message in no matching and unmatching porposals there
          if (this.matchingProposalMap.size === 0 && this.linkUnMatchProposalData.length === 0) {
            this.showMessage = true;
          } else {
            this.showMessage = false;
          }
        } else {
          this.messageService.displayMessages(this.appDataService.setMessageObject(
            this.localeService.getLocalizedMessage('admin.NO_DATA_FOUND'), MessageType.Warning));
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // get the linked data after linking proposals from the api to display in the modal
  getLinkedProposalData() {
    this.linkProposalArchitectureService.getLinkedProposalData().subscribe((response: any) => {
      if (response && !response.error) {
        this.blockUiService.spinnerConfig.unBlockUI();
        if (response.data) {
          // assign the linked data for displaying in modal
          this.linkedProposalData = response.data.matching;
          for (let i = 0; i < this.linkedProposalData.length; i++) {
            this.linkedProposalData[i].expand = true;
            // to remove proposal from list for which we are delinking.
            if (this.linkedProposalData[i].id === this.proposalDataService.proposalDataObject.proposalId) {
              this.linkedProposalData.splice(i, 1);
              i--;
            }
          }
          // to check if whole group should be delinked or a single proposal should be removed from the group.
          if (this.linkedProposalData.length > 1) {
            this.linkProposalArchitectureService.deLinkGroup = false;
          } else {
            this.linkProposalArchitectureService.deLinkGroup = true;
          }
        } else {
          this.messageService.displayMessages(this.appDataService.setMessageObject(
            this.localeService.getLocalizedMessage('admin.NO_DATA_FOUND'), MessageType.Warning));
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  continue() {
    if (!this.linkingForGroup) {
      this.linkProposalArchitectureService.selectedProposals.push(this.proposalDataService.proposalDataObject.proposalId);
    }
    this.activeModal.close({
      continue: true
    });
  }

  close() {
    this.activeModal.close({
      continue: false
    });
  }

  expandAll(value) {
    this.showExpandAll = !this.showExpandAll;
    if (value === 'Eligible') {
      for (const key of Array.from(this.matchingProposalMap.values())) {
        key.expand = !key.expand;
      }
    } else if (value === 'Delink') {
      for (let i = 0; i < this.linkedProposalData.length; i++) {
        this.linkedProposalData[i].expand = !this.linkedProposalData[i].expand;
      }
    } else {
      for (let i = 0; i < this.linkUnMatchProposalData.length; i++) {
        this.linkUnMatchProposalData[i].expand = !this.linkUnMatchProposalData[i].expand;
      }
    }

  }

  expandRows(value, eligibilty) {
    value.expand = !value.expand;
    if (eligibilty === 'Eligible') {
      const arr = Array.from(this.matchingProposalMap.values());
      this.showExpandAll = arr.every(function (item: any) {
        return item.expand === true;
      });
    } else if (eligibilty === 'Delink') {
      this.showExpandAll = this.linkedProposalData.every(function (item: any) {
        return item.expand === true;
      });
    } else {
      this.showExpandAll = this.linkUnMatchProposalData.every(function (item: any) {
        return item.expand === true;
      });
    }
  }

  // to add/remove proposals id in request array acc to selection.
  selectProposal(selected, event, val) {
    if (!selected) {
      val['selected'] = false;
      if (val.linkedProposal) {
        // if cross arch is deselected then remove all proposal id present in that group
        for (let i = 0; i < val.linkedProposal.length; i++) {
          const index = this.linkProposalArchitectureService.selectedProposals.indexOf(val.linkedProposal[i].id);
          this.linkProposalArchitectureService.selectedProposals.splice(index, 1);
        }
      } else {
        // remove the propsal id 
        const index = this.linkProposalArchitectureService.selectedProposals.indexOf(val.id);
        this.linkProposalArchitectureService.selectedProposals.splice(index, 1);
      }
    } else {
      val['selected'] = true;
      if (val.linkedProposal) {
        // if linking single proposal to a group pass all the proposal id present in the group;
        for (let i = 0; i < val.linkedProposal.length; i++) {
          this.linkProposalArchitectureService.selectedProposals.push(val.linkedProposal[i].id);
        }
      } else {
        // add the proposal id.
        this.linkProposalArchitectureService.selectedProposals.push(val.id);
      }
    }

    // Linking msp to non msp or vice versa , we need to show partner warning message 
    let arraySelectedProposal = this.linkableProposalData.filter(proposal => this.linkProposalArchitectureService.selectedProposals.includes(proposal.id));
    let arrayLinkableProposal =    arraySelectedProposal.filter(proposal => proposal.mspPartner === !this.proposalDataService.proposalDataObject.proposalData.mspPartner); 

    if (arrayLinkableProposal && arrayLinkableProposal.length >0) {
         this.showMSPError = true;
    }else {
         this.showMSPError = false;
    }

    // to disale/enable checkbox after selection/de-selection.
    this.disableCheckbox(selected, val);
  }

  // to disale/enable checkbox after selection/de-selection.
  disableCheckbox(selected, val) {
    for (let key of Array.from(this.matchingProposalMap.values())) {
      // if cross arch. proposal is selected from the list
      if (val.linkedProposal) {
        for (let i = 0; i < key.proposals.length; i++) {
          if (val.architecture !== key.architecture && val.name.includes(key.architecture)) {
            key.proposals[i].disabled = selected;
          } else if (val.architecture === key.architecture && val.id !== key.proposals[i].id) {
            // this condition will break after a new arch is added;
            key.proposals[i].disabled = selected;
          }
        }
      } else {
        // to disable/enable all the proposal having have arch as the selected one;
        for (let i = 0; i < key.proposals.length; i++) {
          if (val.id !== key.proposals[i].id && val.architecture === key.architecture) {
            key.proposals[i].disabled = selected;
          } else if (key.architecture === 'Cross Architecture' && key.proposals[i].name.includes(val.architecture)) {
            key.proposals[i].disabled = selected;
          }
        }
      }
    }
  }

  showEligible() {
    this.eligible = !this.eligible;
    // this.linkProposalArchitectureService.selectedProposals = [];
    // for (let key of Array.from(this.matchingProposalMap.values())) {
    //   for (let i = 0; i < key.proposals.length; i++) {
    //     key.proposals[i].disabled = false;
    //   }
    // }
  }
}

export interface MatchedProposal {
  architecture: string;
  proposals: any[];
  expand: boolean;
}
