import { ConstantsService } from '@app/shared/services/constants.service';
import { Injectable, EventEmitter } from '@angular/core';
import { AppDataService, SessionData } from '../../shared/services/app.data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { QualificationsService } from '../../qualifications/qualifications.service';
import { SubHeaderComponent } from '../../shared/sub-header/sub-header.component';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { CreateProposalService } from '../create-proposal/create-proposal.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ListProposalService {

    proposalId: any;
    reqJSON: any;
    navigateToSummary = false;
    toggleProposalShared = false;
    emitQualStatus = new EventEmitter<any>();
    selectedDropdown: any = {};
    arrDropDown = [{ id: 'created-by-me', displayValue: 'Created by Me' }, { id: 'shared-with-me', displayValue: 'Shared with Me' }, { id: 'pending-my-approval', displayValue: 'Pending My Approvals' }, { id: 'pending-my-team-approval', displayValue: 'Pending My Team\'s Approvals' }, { id: 'my-team-approval', displayValue: 'Where I am a Reviewer' }];
    displayGridView = false;
    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private appDataService: AppDataService,
        private permissionService: PermissionService, private createProposalService: CreateProposalService,
        public qualService: QualificationsService, public proposalDataService: ProposalDataService, public constantsService: ConstantsService) { }

    getProposalList() {

        if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW) {
            return this.http.get(this.appDataService.getAppDomain + 'api/proposal/users/' + this.selectedDropdown.id);
        } else {
            if (!this.proposalDataService.listProposalData) {
                this.proposalDataService.listProposalData = { data: [] };
            }

            this.proposalDataService.listProposalData.isCreatedByMe = false;
            this.proposalDataService.listProposalData.isProposalOnDashboard = false;
            return this.http.get(this.appDataService.getAppDomain + 'api/proposal/list?q=' + this.qualService.qualification.qualID)
                .pipe(map(res => res));
        }
    }


    deleteProposal(proposalId) {
        return this.http.delete(this.appDataService.getAppDomain + 'api/proposal/delete?p=' + proposalId)
            .pipe(map(res => res));
    }

    copyProposal(proposalId) {
        return this.http.post(this.appDataService.getAppDomain + 'api/proposal/copy?p=' + proposalId, {})
            .pipe(map(res => res));
    }

    proposalsSharedWithMe() {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/users/shared-with-me'
        ).pipe(map(res => res));
    }

    prepareSubHeaderObject(screenName, isListProposal: boolean) {
        {
            this.appDataService.isGroupSelected = false;
            this.appDataService.subHeaderData.favFlag = false;
            this.appDataService.subHeaderData.moduleName = screenName;
            if (isListProposal) {
                this.appDataService.subHeaderData.custName = this.qualService.qualification.name;
                const subHeaderAry = new Array<any>();
                subHeaderAry.push(this.qualService.qualification.dealId)
                subHeaderAry.push(this.qualService.qualification.accountManagerName)
                subHeaderAry.push(this.qualService.qualification.qualStatus);
                this.appDataService.subHeaderData.subHeaderVal = subHeaderAry;
            } else {
                this.appDataService.subHeaderData.subHeaderVal = null;
            }
            if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
                // && (!this.qualService.qualification.accountManagerName || !this.qualService.qualification.qualStatus)){
                this.qualService.getQualHeader().subscribe((res: any) => {
                    // console.log(res);
                    this.appDataService.subHeaderData.custName = res.data.qualName;
                    const subHeaderAry = new Array<any>();
                    subHeaderAry.push(res.data.dealId);
                    if (res.data.am) {
                        subHeaderAry.push(res.data.am);
                        this.qualService.qualification.accountManagerName = res.data.am;
                    } else {
                        subHeaderAry.push("");
                        this.qualService.qualification.accountManagerName = "";
                    }

                    subHeaderAry.push(res.data.status);
                    this.qualService.qualification.name = res.data.qualName;
                    this.qualService.qualification.dealId = res.data.dealId;
                    if (res.data.dealStatusDesc) {
                        this.qualService.qualification.dealInfoObj['dealStatusDesc'] = res.data.dealStatusDesc;
                    }
                    this.qualService.qualification.qualStatus = res.data.status;
                    if (res.data.permissions && res.data.permissions.featureAccess && res.data.permissions.featureAccess.length > 0) {
                        this.qualService.qualification.permissions = res.data.permissions;
                        this.permissionService.qualPermissions = new Map(res.data.permissions.featureAccess.map(i => [i.name, i]));
                    } else {
                        this.permissionService.qualPermissions.clear();
                    }
                    const is2tPartner = this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti); // set 2tpartner flag to hide distributor team 
                    this.qualService.twoTUserUsingDistiDeal = this.appDataService.isTwoTUserUsingDistiDeal(is2tPartner , res.data.distiDeal)
                    this.qualService.isDistiWithTC = this.appDataService.isDistiWithTransfferedControl(res.data.buyMethodDisti,res.data.distiInitiated);
                    this.qualService.setQualPermissions();

                    if (res.data.salesTeamList) {
                        this.qualService.qualification.salesTeamList = res.data.salesTeamList;
                    }
                    if (res.data.partnerDeal) {
                        this.createProposalService.isPartnerDeal = res.data.partnerDeal;
                    } else {
                        this.createProposalService.isPartnerDeal = false;
                    }
                    this.emitQualStatus.emit({ 'salesTeamList': res.data.salesTeamList, 'qualStatus': res.data.status, 'userAccessType': res.data.userAccessType, 'rwAccess': this.permissionService.qualPermissions.has(PermissionEnum.QualEditName), 'createAccess': this.permissionService.qualPermissions.has(PermissionEnum.ProposalCreate), 'partnerDeal': this.createProposalService.isPartnerDeal });
                    this.appDataService.subHeaderData.subHeaderVal = subHeaderAry;
                    const sessionObject: SessionData = this.appDataService.getSessionObject();
                    sessionObject.qualificationData = this.qualService.qualification;
                    // set createaccess and isuserReadWriteaccess from qual permissions
                    sessionObject.isUserReadWriteAccess = this.permissionService.qualPermissions.has(PermissionEnum.QualEditName);
                    sessionObject.createAccess = this.permissionService.qualPermissions.has(PermissionEnum.ProposalCreate);
                    sessionObject.partnerDeal = this.createProposalService.isPartnerDeal;
                    this.appDataService.setSessionObject(sessionObject);
                });
            }

        }
    }

    splitProposal(proposalId) {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/split'
        ).pipe(map(res => res));
    }

    // Update proposal data to manage proposal grouping
    manageCrossProposalGrouping(proposalList) {
        // crossProposal will be true if it has group id.
        // lastProposalInGroup will be true if that proposal has group Id and it is last in the group;
        const listSize = proposalList.length;
        for (let i = 0; i < listSize; i++) {
            const groupId = proposalList[i].groupId || proposalList[i].parentGroupId;
            if (groupId) {
                proposalList[i].crossProposal = true;
                if (i > 0 && i < listSize - 1) {
                    const nextGroupId = proposalList[i + 1].groupId || proposalList[i + 1].parentGroupId;
                    if (nextGroupId && groupId === nextGroupId) {
                        proposalList[i].lastProposalInGroup = false;
                    } else {
                        proposalList[i].lastProposalInGroup = true;
                    }
                }
                else if (i === listSize - 1) {
                    //for last proposal in the list;
                    proposalList[i].lastProposalInGroup = true;
                } else {
                    //if i === 0; first proposal in the list;
                    proposalList[i].lastProposalInGroup = false;
                }
                proposalList[i].hasLinkedProposal = true;
            } else if (proposalList[i].linkId && !proposalList[i].nonTransactionalRelatedSoftwareProposal && !proposalList[i].nonTransactionalProposal) {
                proposalList[i].crossProposal = true;
                proposalList[i].hasLinkedProposal = true;
                if (i > 0 && i < listSize - 1) {
                    if (proposalList[i + 1].linkId && proposalList[i].linkId === proposalList[i + 1].linkId) {
                        proposalList[i].lastProposalInGroup = false;

                    }
                    else {
                        proposalList[i].lastProposalInGroup = true;
                    }
                } else if (i === listSize - 1) {
                    //for last proposal in the list;
                    proposalList[i].lastProposalInGroup = true;
                } else {
                    //if i === 0; first proposal in the list;
                    proposalList[i].lastProposalInGroup = false;
                }
            }

            else {
                proposalList[i].crossProposal = false;
                proposalList[i].lastProposalInGroup = false;
            }
        }
    }


    getColumnsData() {
        return this.http.get('assets/data/proposal-list-columns.json');
    }

    getData() {
        return this.http.get('assets/data/propasal-list-data.json');
    }

    getProposalListbyCustomer() {
        const reqObj = {
            data: {
                prospectKey: this.appDataService.customerID
            }
        };

        return this.http.post(this.appDataService.getAppDomain + 'api/proposal/list', reqObj)
            .pipe(map(res => res));

    }


    filterProposalList(filterID) {
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/users/' + filterID
        )
    }

}