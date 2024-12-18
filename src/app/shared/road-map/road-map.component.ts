import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { IRoadMap, RoadMapGrid } from './road-map.model';
import { RoadMapConstants } from './road-map.constants';
import { DynamicDirective } from '../directives/dynamic.directive';
import { Subscription } from 'rxjs';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReOpenComponent } from '@app/modal/re-open/re-open.component';
import { ConstantsService } from '../services/constants.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProposalSummaryService } from '@app/proposal/edit-proposal/proposal-summary/proposal-summary.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';

@Component({
    moduleId: module.id,
    selector: 'app-road-map',
    templateUrl: 'road-map.component.html',
    styleUrls: ['road-map.component.scss']
})

export class RoadMapComponent implements OnInit, OnDestroy {

    @Input('componentNumToLoad') componentNumToLoad: number;
    @Input() roadMapGrid: RoadMapGrid;
    roadMaps: Array<IRoadMap>;
    roadMapConstants: any;
    currentStep: number;
    booleanCheck = true;
    percentageComplete: number;
    @ViewChild(DynamicDirective, { static: true }) dynamicDiretive: DynamicDirective;
    component: ComponentRef<any>;
    subscriptions: Array<Subscription>;
    message: boolean;
    constructor(private componentFactoryResolver: ComponentFactoryResolver, private utilitiesService: UtilitiesService, public messageService: MessageService,
        private proposalDataService: ProposalDataService, public constantsService: ConstantsService, public createProposalService: CreateProposalService, public tcoDataService: TcoDataService,
        private appDataService: AppDataService, public modalVar: NgbModal, public qualService: QualificationsService, public proposalSummaryService:ProposalSummaryService, private permissionService: PermissionService) {
        this.roadMapConstants = RoadMapConstants;
        this.subscriptions = [];
        this.percentageComplete = 0;
    }

    ngOnInit() {
        this.roadMaps = this.roadMapGrid.roadMaps;

        this.utilitiesService.currentMessage.subscribe(message => this.message = message);
        if (this.message === true) {
            if(this.appDataService.tcoFlow){
                this.tcoDataService.loadReviewFinalize = false;
                this.loadComponent(0);
            } else {
                this.tcoDataService.loadReviewFinalize = true;
                this.loadComponent(3);
            }
        } else {
            this.loadComponent(0);
        }
        this.subscriptions.push(this.roadMapGrid.roadMapSubject.subscribe((res) => {
            this.loadComponent(res);
        }));

        this.utilitiesService.getMessage().subscribe(message => {
            this.booleanCheck = message;
        });

        this.utilitiesService.moveTo().subscribe(val => {
            if (val) {
                this.loadComponent(1);
            }
        });
        const sessionObj: SessionData = this.appDataService.getSessionObject();
        if (sessionObj) {
            if (!sessionObj.isUserReadWriteAccess) {
                if(this.appDataService.tcoFlow){
                    this.tcoDataService.loadReviewFinalize = false;
                    this.loadComponent(0);
                } else {
                    this.tcoDataService.loadReviewFinalize = true;
                    this.loadComponent(3);
                }
                this.appDataService.isReadWriteAccess = false;
            } else {
                this.appDataService.isReadWriteAccess = true;
                sessionObj.isUserReadWriteAccess = true;
                this.appDataService.setSessionObject(sessionObj);
            }
        }

        if (this.componentNumToLoad > 0) {
            this.loadComponent(this.componentNumToLoad);
            return;
        }


    }

    loadComponent(index: number) {
        const roadMap: IRoadMap = this.roadMaps[index];

        if (!roadMap) {
            return;
        }
        if (this.component) {
            this.component.destroy();
        }
        this.setCurrentStep(index);
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(roadMap.component);
        let viewContainerRef = this.dynamicDiretive.viewContainerRef;
        viewContainerRef.clear();
        this.component = viewContainerRef.createComponent(componentFactory);
        (<any>this.component).instance.roadMap = roadMap;
    }

    showRoadMap(index: number) {
        // commented out for further use , if proposalDisableRoadMap is there stop user to go throgh roadmap for the proposal
        if ((!this.appDataService.isReadWriteAccess && !this.appDataService.userInfo.roSuperUser && !this.appDataService.roSalesTeam) || this.appDataService.disableProposalRoadmap) {
            return false;
            // tslint:disable-next-line:max-line-length
        } else // if proposal flow and ro sales team with no edit acces, don't allow user to use roadmap
        if(this.utilitiesService.proposalFlow && this.appDataService.roSalesTeam && !this.permissionService.proposalEdit && !this.permissionService.proposalPermissions.has(PermissionEnum.ProposalViewOnly)){
            return false;
        }
        if (index < this.currentStep && this.appDataService.isReadWriteAccess && this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationSummaryStep && this.qualService.qualification.qualStatus === this.constantsService.QUALIFICATION_COMPLETE ) {
            this.appDataService.roadMapPath = true;
            this.loadComponent(index);
        } else if(index < this.currentStep && this.appDataService.isReadWriteAccess && this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSummaryStep && (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE || this.appDataService.isProposalPending || this.appDataService.isPendingAdjustmentStatus)){
            this.appDataService.roadMapPath = true;
            this.loadComponent(index);
        } else if( (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.tcoModeling || this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.tcoReview || this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.tcoOutcomes)){
            // if ro super user and has no access to the proposal, don't allow tco roadmap usage
            if((this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess && !this.appDataService.roSalesTeam)|| index > this.currentStep) {
                return false;
            } else {
                this.loadComponent(index);
            }
        } else if (index < this.currentStep) {
            this.loadComponent(index);
        } else if(this.qualService.qualification.qualStatus === this.constantsService.QUALIFICATION_COMPLETE && this.appDataService.enableQualFlag ){
            this.appDataService.roadMapPath = true;
            this.loadComponent(index);
        } else if((this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE || this.appDataService.isProposalPending || this.appDataService.isPendingAdjustmentStatus) && this.qualService.qualification.qualStatus === this.constantsService.QUALIFICATION_COMPLETE && !this.appDataService.enableQualFlag ) {
            this.appDataService.roadMapPath = true;
            this.loadComponent(index);
        }
        //  else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSummaryStep && this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE && index < 2 && this.appDataService.isReadWriteAccess) {
        //     const modalRef = this.modalVar.open(ReOpenComponent, { windowClass: 're-open' });
        //     modalRef.result.then((result) => {
        //         if (result.continue === true) {
        //             this.proposalSummaryService.updateProposalStatusOnReopen(this.constantsService.IN_PROGRESS_STATUS).subscribe((res: any) => {
        //                 if (res && !res.error && res.data) {
        //                     this.appDataService.subHeaderData.subHeaderVal[4] = res.data.status;
        //                     this.proposalDataService.proposalDataObject.proposalData.status = res.data.status;
        //                     if (this.appDataService.subHeaderData.subHeaderVal[6]) {//halinkedProposals
        //                         this.appDataService.updateCrossArchitectureProposalStatusforHeader(res.data.status);
        //                     }
        //                     this.loadComponent(index);
        //                 } else {
        //                     this.messageService.displayMessagesFromResponse(res);
        //                 }
        //             });
        //         } else {
        //             return false;
        //         }
        //     });
        // } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationSummaryStep && this.qualService.qualification.qualStatus === this.constantsService.QUALIFICATION_COMPLETE && index < 3 && this.appDataService.isReadWriteAccess) {
        //     const modalRef = this.modalVar.open(ReOpenComponent, { windowClass: 're-open' });
        //     modalRef.result.then((result) => {
        //         if (result.continue === true) {
        //             const reqObj = this.qualService.getQualInfo();
        //             reqObj['qualStatus'] = QualificationsService.IN_PROGRESS_STATUS;
        //             this.qualService.updateQualStatus(reqObj).subscribe((response: any) => {
        //                 if (response) {
        //                     if (!response.error) {
        //                         this.qualService.qualification.qualStatus = response.qualStatus;
        //                         this.appDataService.subHeaderData.subHeaderVal[2] = QualificationsService.IN_PROGRESS_STATUS;
        //                         this.qualService.updateSessionQualData();
        //                         this.loadComponent(index);
        //                     }
        //                 } else {
        //                     this.messageService.displayMessagesFromResponse(response);
        //                 }
        //             });
        //         } else {
        //             return false;
        //         }
        //     });
        // } 
    }


    setCurrentStep(index: number) {
        this.currentStep = index;
        this.percentageComplete = this.currentStep * (100 / (this.roadMaps.length - 1));
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        delete this.subscriptions;
    }
}
