import { PriceEstimateService } from './../price-estimate.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService, IEnrollmentsInfo, IPoolInfo } from 'vnext/proposal/proposal-store.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { FileUploader } from 'ng2-file-upload';
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddReasonOtdComponent } from 'vnext/modals/add-reason-otd/add-reason-otd.component';
const URL = 'https:// evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-update-purchase-adjustment',
  templateUrl: './update-purchase-adjustment.component.html',
  styleUrls: ['./update-purchase-adjustment.component.scss'],
  providers:[MessageService]
})
export class UpdatePurchaseAdjustmentComponent implements OnInit {
 
  constructor(private priceEstimateService: PriceEstimateService, private vnextService: VnextService, public proposalStoreService: ProposalStoreService, public eaService: EaService, public constantService: ConstantsService, private modalVar: NgbModal,
     private messageService: MessageService, public utilitiesService: UtilitiesService,private eaRestService: EaRestService, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }
  showPoolDropdown = false;
  poolArray: any = [];
  selectedPool: IPoolInfo = {}
  clonedSelectedPoolData: IPoolInfo = {};
  @Input() selectedEnrollemnt: IEnrollmentsInfo = {};
  reasonCount = 0;
  updatedAtoPidsMap = new Map<string , Array<any>>();
  comment = '';
  uploadedFileName = ''
  fileFormatError = false;
  hasBaseDropZoneOver = false;
  fileDetail: any = {};
  fileName = '';
  suiteInclusionCount = 0;
  checkForLines = false;
  isHybridCollabSelected = false;
  
  file: any;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['xlsx'] });
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  pidPropertyArray = ['perpetual', 'swss', 'subscription', 'competitive', 'other', 'ramp']
  openMultiWarning = false;
  messageArr: any;
  messageObj: any;
  isUpgradeFlow = false;
  residualErrorCount = 0

  ngOnInit(): void {
    if(this.eaService.features.STO_REL){
      this.pidPropertyArray.push('strategicOffer')
    }
    this.isUpgradeFlow = false;
    if(this.proposalStoreService.proposalData.dealInfo?.subscriptionUpgradeDeal){
      this.isUpgradeFlow = true;
    }
    this.getPidData();
  }

  // method to open reason modal
  addReasonForPid(pid, suite) {
    const modalRef = this.modalVar.open(AddReasonOtdComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modalRef.componentInstance.pidReason = pid?.reason ? pid.reason : '';
    modalRef.result.then((result) => {
      //  check result and case number present and call api to save
      if (result && result.pidReason) {
        // add reason to pid
        this.addReason(result.pidReason,pid,suite);
      }
   });
  }

  close(){
    this.priceEstimateService.showUpdatePA = false;
  }

  changePool(pool){
    if(pool.desc !== this.selectedPool.desc){
      this.selectedPool = this.utilitiesService.cloneObj(pool);
      this.mapValues();
    }
    this.showPoolDropdown = false;
  }

  getPidData() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+this.proposalStoreService.proposalData.objId+'/enrollment?e=' + this.selectedEnrollemnt.id  + '&a=FETCH-MANUAL-PA-PIDS'; //a=FETCH-MANUAL-PA-PIDS --> use for OPPM-12019
    
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.utilitiesService.sortArrayByDisplaySeq(response.data.enrollments[0].pools);
        this.poolArray = response.data.enrollments[0].pools;
        this.selectedPool = this.utilitiesService.cloneObj(this.poolArray[0]);
        this.checkForLines =  response.data.enrollments[0].primary
        if (response.data.proposal?.message) {
          this.messageArr = response.data.proposal?.message.messages;
        } 
        this.mapValues();
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  mapValues(){
    this.isHybridCollabSelected = false;
    this.reasonCount = 0;
    this.suiteInclusionCount = 0;
    this.utilitiesService.sortArrayByDisplaySeq(this.selectedPool.suites);
    this.selectedPool.suites.forEach(suite => {
      if(suite.inclusion){
        this.suiteInclusionCount++
        if(this.selectedEnrollemnt.id === 6 && suite.type === this.constantService.SUITE_TYPE_COLLAB){
          this.isHybridCollabSelected = true;
        }
      }
      if(suite.lines && suite.lines.length){
        this.utilitiesService.sortArrayByDisplaySeq(suite.lines);
      }
      if(this.checkForLines || (suite.pids && suite.lines && suite.type === this.constantService.SUITE_TYPE_HYBRID)){
        if(suite.pids && suite.pids.length){
          this.utilitiesService.sortArrayByDisplaySeq(suite.pids);
          suite.pids.forEach(pid => {
            if (pid.dtls) {
              pid.dtls.forEach(element => {
                const line = suite.lines.find(line => line.id === element.mappedLineId);
                 if (line) { 
                   this.preparePidData(pid);
                   if(!line?.credit || !Object.values(line?.credit).length){
                    line['isLineNotAdded'] = true; // set if line has no value or wasn't configured in proposal
                   }
                   if(line['childs']){
                    line['childs'].push(pid)
                   } else {
                    line['childs'] = [pid]
                   }
                }
              });
            }
          });
        }
      } else {
        if (suite.pids && suite.pids.length) {
          this.utilitiesService.sortArrayByDisplaySeq(suite.pids);
          suite.pids.forEach(pid => {
            this.preparePidData(pid);
          });
        }
      }
      
    });
    // to check and set grouping for pid/lines and sort order
    this.setGroupingForLinesAndPids();
    this.clonedSelectedPoolData = this.utilitiesService.cloneObj(this.selectedPool);
    if(this.messageArr){
      this.messageObj = this.messageArr.filter((message) => {
        return this.selectedPool.suites.some(function(suite){
          return (message.identifier === suite.ato && message.severity === 'WARN');
        }); 
      })
      this.messageObj = this.messageObj.filter((element, index, array) =>
       index === array.findIndex((arrElement) =>
       arrElement.identifier === element.identifier
        )
      );
    }
    console.log(this.selectedPool)
  }

  // method to check and set grouping for pid/lines and sort order
  setGroupingForLinesAndPids(){
    this.selectedPool.suites.forEach(suite => {
      if(suite['displayGroup'] && suite['groups']){
        this.utilitiesService.sortArrayByDisplaySeq(suite['groups']);
        const groupLineMap = new Map<number,Array<any>>();
        for(const group of suite['groups']){
            groupLineMap.set(group.id,[]);
        } 

        if(suite?.lines){
          for(const line of suite.lines){  
            if(groupLineMap.has(line['groupId'])){
              groupLineMap.get(line['groupId']).push(line);
            }                  
            
          }
        } else if(suite?.pids){
          for(const pid of suite.pids){  
            if(groupLineMap.has(pid['groupId'])){
              groupLineMap.get(pid['groupId']).push(pid);
            }                  
            
          }
        }
        const suiteForGrid = this.utilitiesService.cloneObj(suite);
        suiteForGrid.childs = new Array<any>();
        for(const group of suite['groups']){
          const groupLineArray =  groupLineMap.get(group.id)
          if(groupLineArray?.length > 0){
            suiteForGrid.childs = suiteForGrid.childs.concat(groupLineMap.get(group.id));
          }
        }
        if(suiteForGrid.childs.length){
          suite.lines = suiteForGrid.childs
        }
      }
    })
  }

  preparePidData(pid){
    if(pid.credit){
      this.pidPropertyArray.forEach(property => {
        pid.credit[property] = pid.credit[property] ? pid.credit[property] : 0;
      });
    } else {
      pid['credit'] =  {
        'perpetual': 0,
        'swss': 0,
        'subscription': 0,
        'competitive': 0,
        'other': 0,
        'ramp': 0
      }
      pid['isPidNotAdded'] = true; // set if pid has no value or wasn't configured in proposal
      if(this.eaService.features.STO_REL){
        pid['credit']['strategicOffer'] = 0
      }
    }
    if(this.eaService.features?.CLO_OTD_NOV_REL){
      pid['reason'] =  pid?.creditReason ? pid.creditReason : '';
    } else {
      pid['reason'] = '';
    }
    pid['updated'] = false;
  }

  onChange(event,pid,key,suite,line?){
    let sysTotal = 0
    if(pid?.credit && this.eaService.features.ENABLE_MANUAL_RESIDUAL_CREDIT_UPDATE){
      sysTotal = ((pid.credit.sysSwss) ? pid.credit.sysSwss : 0 ) + ((pid.credit.sysPerpetual) ? pid.credit.sysPerpetual : 0 ) + ((pid.credit.sysSubscription) ? pid.credit.sysSubscription : 0 );
    }
    if(!pid.updated && !pid.reason){
      this.reasonCount++;
    }
    pid.updated = true;
    pid.credit[key] = event;
    const pidsArray = this.updatedAtoPidsMap.get(suite.ato)
    if (this.eaService.features.ENABLE_MANUAL_RESIDUAL_CREDIT_UPDATE) {
      const pidResidualTotal = ((pid.credit.swss) ? pid.credit.swss : 0) + ((pid.credit.perpetual) ? pid.credit.perpetual : 0) + ((pid.credit.subscription) ? pid.credit.subscription : 0);
      if (this.proposalStoreService.proposalData?.status === 'IN_PROGRESS' && this.proposalStoreService.isSellerAllowUpdateOTA) {
        if (pidResidualTotal > sysTotal) {
          if (!pid['residualError']) {
            this.residualErrorCount++
          }
          pid['residualError'] = true;
        } else {
          if (pid['residualError']) {
            this.residualErrorCount--
          }
          pid['residualError'] = false;
        }
      }
    }
    if(pidsArray){
      if(this.checkForLines || (suite.pids && suite.lines && suite.type === this.constantService.SUITE_TYPE_HYBRID)){
        let pidToUpdate = pidsArray.find(p => p.type === pid.type && p.name === pid.name);
      if(pidToUpdate){
        pidToUpdate.credit[key] = event;
      } else {
        pidsArray.push({'type': pid.type, 'name': pid.name, 'dtls': pid.dtls,'reason': pid?.reason ? pid.reason : '', 'supportPid': pid.supportPid, 'credit': {[key] : event}})
      }
      } else {
        let pidToUpdate = pidsArray.find(p => p.name === pid.name);
      if(pidToUpdate){
        pidToUpdate.credit[key] = event;
      } else {
        pidsArray.push({'type': pid.type, 'name': pid.name, 'dtls': pid.dtls,'reason': pid?.reason ? pid.reason : '', 'supportPid': pid.supportPid, 'credit': {[key] : event}})
      }
      }
    } else {
      const credit = {[key]: event}
      const updatedPid = [{'type': pid.type, 'name': pid.name, 'dtls': pid.dtls,'reason': pid?.reason ? pid.reason : '' , 'supportPid': pid.supportPid, 'credit': credit}];
      
      this.updatedAtoPidsMap.set(suite.ato, updatedPid)
    }
  }

  resetUpdatedValues(suiteIndex,lineIndex,pidIndex,pid,suite){
    if(!pid.reason){
      this.reasonCount--;
    }
    if(pid.residualError && this.eaService.features.ENABLE_MANUAL_RESIDUAL_CREDIT_UPDATE){
      this.residualErrorCount--;
      pid['residualError'] = false;
    }
    if (this.checkForLines || (suite.pids && suite.lines && suite.type === this.constantService.SUITE_TYPE_HYBRID)) {
      const oldValue = this.clonedSelectedPoolData.suites[suiteIndex].lines[lineIndex]['childs'][pidIndex]
      this.selectedPool.suites[suiteIndex].lines[lineIndex]['childs'][pidIndex] = JSON.parse(JSON.stringify(oldValue));
      let pids = this.updatedAtoPidsMap.get(suite.ato);
      if (pids) {
        if(this.checkForLines || (suite.pids && suite.lines && suite.type === this.constantService.SUITE_TYPE_HYBRID)){
          pids = pids.filter(p => p.type !== pid.type || p.name !== pid.name);
        } else {
          pids = pids.filter(p => p.type !== pid.type || p.name !== pid.name);
        }

        if (!pids.length) {
          this.updatedAtoPidsMap.delete(suite.ato);
        } else {
          this.updatedAtoPidsMap.set(suite.ato, pids)
        }
      }
    } else {
      const oldValue = this.clonedSelectedPoolData.suites[suiteIndex].pids[pidIndex]
      this.selectedPool.suites[suiteIndex].pids[pidIndex] = JSON.parse(JSON.stringify(oldValue));
      let pids = this.updatedAtoPidsMap.get(suite.ato);
      if (pids) {
        if(this.checkForLines){
          pids = pids.filter(p => p.type !== pid.type || p.name !== pid.name);
        } else {
          pids = pids.filter(p => p.type !== pid.type || p.name !== pid.name);
        }

        if (!pids.length) {
          this.updatedAtoPidsMap.delete(suite.ato);
        } else {
          this.updatedAtoPidsMap.set(suite.ato, pids)
        }
      }
    }
  }

  addReason(reason,pid,suite){
    
    if(reason.trim()){
      if(!pid.reason && pid.updated){
        this.reasonCount--;
      }
      pid.reason = reason;
    } else {
      if(pid.updated){
        this.reasonCount++;
        pid.reason = '';
      }
    }



    const pidsArray = this.updatedAtoPidsMap.get(suite.ato)
    if(pidsArray){
      let pidToUpdate;
      if(this.checkForLines || (suite.pids && suite.lines && suite.type === this.constantService.SUITE_TYPE_HYBRID)){
        pidToUpdate = pidsArray.find(p => p.type === pid.type && p.name === pid.name);
      } else {
        pidToUpdate = pidsArray.find(p => p.name === pid.name);
      }
      if(pidToUpdate){
        pidToUpdate.reason = pid.reason;
      } else {
        pidToUpdate.push({'type': pid.type, 'name': pid.name, 'dtls': pid.dtls, 'supportPid': pid.supportPid, 'reason': pid.reason, 'credit': {}})
      }
    } else {
      const updatedPid = [{'type': pid.type, 'name': pid.name, 'dtls': pid.dtls, 'supportPid': pid.supportPid, 'reason': pid.reason, 'credit': {}}];
      
      this.updatedAtoPidsMap.set(suite.ato, updatedPid)
    }
  }
    
  save(){
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '/purchase-adjustment';
    const atos = [];
    this.updatedAtoPidsMap.forEach((value: any, key: string) => {
      atos.push({name: key, pids: value})
    });
    const request = {
      data: {
        enrollment: {
          enrollmentId : this.selectedEnrollemnt.id,
          atos: atos
        } ,
        paComment: this.comment
      }
    }

    this.eaRestService.postApiCall(url,request).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.priceEstimateService.refreshPeGridData.next(true);
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  processFile(file) {
    const fileName = file.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (['xlsx'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
    } else {
      
      const formdata: FormData = new FormData();
      formdata.append('file', file);
      const url = this.vnextService.getAppDomainWithContext +  'proposal/'+ this.proposalStoreService.proposalData.objId +'/purchase-adjustment-attachment'
      this.eaRestService.postApiCall(url, formdata).subscribe((response: any) => {
        this.messageService.clear();
        if (this.vnextService.isValidResponseWithoutData(response, true)){
          
            this.uploadedFileName = fileName;
           
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    }
  }

  removeFile() {
    const url = this.vnextService.getAppDomainWithContext +  'proposal/'+ this.proposalStoreService.proposalData.objId +'/purchase-adjustment-attachment'
      this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
        this.messageService.clear();
        if (this.vnextService.isValidResponseWithoutData(response, true)){
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  dropped(evt: any) {
    this.processFile(evt[0]);
    console.log(evt);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.processFile(target.files[0]);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  downloadTemplate() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/purchase-adjustment/template/download'
    
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  

}
