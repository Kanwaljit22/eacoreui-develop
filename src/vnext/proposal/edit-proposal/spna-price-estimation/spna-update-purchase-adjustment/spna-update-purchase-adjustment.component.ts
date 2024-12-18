
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
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';
const URL = 'https:// evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-spna-update-purchase-adjustment',
  templateUrl: './spna-update-purchase-adjustment.component.html',
  styleUrls: ['./spna-update-purchase-adjustment.component.scss'],
  providers:[MessageService]
})
export class SpnaUpdatePurchaseAdjustmentComponent implements OnInit {
 
  constructor(private priceEstimateService: PriceEstimateService, private vnextService: VnextService, public proposalStoreService: ProposalStoreService, private eaService: EaService, public constantService: ConstantsService,
     private messageService: MessageService, public utilitiesService: UtilitiesService,private eaRestService: EaRestService, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }
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
 

  ngOnInit(): void {
    this.isUpgradeFlow = false;
    if(this.proposalStoreService.proposalData.dealInfo?.subscriptionUpgradeDeal){
      this.isUpgradeFlow = true;
    }
    this.getPidData();
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
        this.poolArray = response.data.enrollments[0].pools;
        this.selectedPool = this.utilitiesService.cloneObj(this.poolArray[0]);
        this.checkForLines =  response.data.enrollments[0].primary && !this.eaService.isSpnaFlow
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
    this.selectedPool.suites.forEach(suite => {
      if(suite.inclusion){
        this.suiteInclusionCount++
        if(this.selectedEnrollemnt.id === 6 && suite.type === this.constantService.SUITE_TYPE_COLLAB){
          this.isHybridCollabSelected = true;
        }
      }
      if(this.checkForLines || (suite.pids && suite.lines && suite.type === this.constantService.SUITE_TYPE_HYBRID)){
        if(suite.pids && suite.pids.length){
          suite.pids.forEach(pid => {
            if (pid.dtls) {
              pid.dtls.forEach(element => {
                const line = suite.lines.find(line => line.id === element.mappedLineId);
                 if (line) { 
                   this.preparePidData(pid);
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
          suite.pids.forEach(pid => {
            this.preparePidData(pid);
          });
        }
      }
      
    });
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
    }
    pid['reason'] = ''
    pid['updated'] = false;
  }

  onChange(event,pid,key,suite){
    if(!pid.updated && !pid.reason){
      this.reasonCount++;
    }
    pid.updated = true;
    pid.credit[key] = event;
    const pidsArray = this.updatedAtoPidsMap.get(suite.ato)
    if(pidsArray){
      if(this.checkForLines || (suite.pids && suite.lines && suite.type === this.constantService.SUITE_TYPE_HYBRID)){
        let pidToUpdate = pidsArray.find(p => p.type === pid.type && p.name === pid.name);
      if(pidToUpdate){
        pidToUpdate.credit[key] = event;
      } else {
        pidsArray.push({'type': pid.type, 'name': pid.name, 'dtls': pid.dtls,'reason': '', 'supportPid': pid.supportPid, 'credit': {[key] : event}})
      }
      } else {
        let pidToUpdate = pidsArray.find(p => p.name === pid.name);
      if(pidToUpdate){
        pidToUpdate.credit[key] = event;
      } else {
        pidsArray.push({'type': pid.type, 'name': pid.name, 'dtls': pid.dtls,'reason': '', 'supportPid': pid.supportPid, 'credit': {[key] : event}})
      }
      }
    } else {
      const credit = {[key]: event}
      const updatedPid = [{'type': pid.type, 'name': pid.name, 'dtls': pid.dtls,'reason': '' , 'supportPid': pid.supportPid, 'credit': credit}];
      
      this.updatedAtoPidsMap.set(suite.ato, updatedPid)
    }
  }

  resetUpdatedValues(suiteIndex,lineIndex,pidIndex,pid,suite){
    if(!pid.reason){
      this.reasonCount--;
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
