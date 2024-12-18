import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { FileUploader } from 'ng2-file-upload';
import { MessageService } from 'vnext/commons/message/message.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
const URL = 'https:// evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-advance-party-search',
  templateUrl: './advance-party-search.component.html',
  styleUrls: ['./advance-party-search.component.scss']
})
export class AdvancePartySearchComponent {
  cavId = 0;
  buId = 0;
  documentId = 0;
  hasBaseDropZoneOver = false;
  searchWithExcel = false;
  searchIds = '';
  invalidSerchIds = [];
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  fileDetail: any = {};
  fileName = '';
  file: any;
  uploadedFileName = ''
  searchLimitError = false;
  isEditEaidFlow = false;
  message = '';
  showInvalidIds = false;
  fileFormatError = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;

  constructor(public utilitiesService: UtilitiesService, public eaIdStoreService: EaidStoreService ,public activeModal: NgbActiveModal, public vNextStoreService: VnextStoreService, public eaService: EaService, public localizationService:LocalizationService,
    public projectStoreService: ProjectStoreService, public eaRestService: EaRestService, public vnextService: VnextService, private messageService: MessageService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.messageService.disaplyModalMsg = true;
  }

  ngOnDestroy() {
    this.messageService.modalMessageClear()
    this.messageService.disaplyModalMsg = false;
  }

  close() {
    this.activeModal.close({
      continue : false
    });
  }

  reset(){
    this.searchIds = '';
    this.invalidSerchIds = [];
    this.uploadedFileName = ''
    this.searchLimitError = false
    this.documentId = 0
    this.message = ''
    this.messageService.modalMessageClear()
    this.fileFormatError = false;
  }

  displayExcelSearch(){
    this.reset();
    this.searchWithExcel = true;
  }

  search() {
    this.invalidSerchIds = []
    this.searchLimitError = false;
    const partyIdArray = this.searchIds.split("\n")
    console.log(partyIdArray)
    //const searchIds = partyIdArray.filter(id => id.trim() != '');
    let searchIds = []
    for (let value of partyIdArray) {
      const id = value.trim()
      if(id != ''){
        const number = Number(id);
      if (!number || !Number.isInteger(number) || number < 1) {
        this.invalidSerchIds.push(value)
      }
        searchIds.push(id)
      }  
    }
    // for (let value of searchIds) {
    //   const number = Number(value);
    //   if (!number || !Number.isInteger(number) || number < 1) {
    //     this.invalidSerchIds.push(value)
    //   }
    // }
    if (!this.invalidSerchIds.length) {
      if(searchIds.length > 10){
        this.searchLimitError = true;
      } else {
        this.activeModal.close({
          searchIds : searchIds
        });
      }  
    }
  }

  keyDown($event){
    if(!this.utilitiesService.numberKeyForSearch($event)){
      $event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    // const clipboardData = event.clipboardData;
    // const pastedText = clipboardData.getData('text');
    // const value = pastedText.replace(/(\r\n|\n|\r)/gm, "");
    // const number = Number(value);

    // if(number && Number.isInteger(number) && number > 0){
    //   //allow to paste
    // } else {
    //   event.preventDefault();
    // }
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

  processFile(file) {
    this.reset()
    const fileName = file.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (['xlsx'].indexOf(extFile) === -1 && ['xls'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
      this.fileFormatError = true
    } else {
      this.fileDetail = file;
      this.uploadedFileName = fileName;
      this.fileFormatError = false
    }
  }

  searchIdWithExcel(){
    // response{ 
    //   data: {
    //     invalidPartyIds : true,
    //     documentId: 123321
    //   }
    const formdata: FormData = new FormData();
    if (this.fileDetail && this.fileDetail.name && this.fileDetail.name.length > 0) {
      formdata.append('file', this.fileDetail);
    }
    let url = 'project/' + this.projectStoreService.projectData.objId + '/cav/' + this.cavId + '/bu/' + this.buId + '/import-excel/parties'
    if(this.isEditEaidFlow){
      url = 'project/cav/' + this.cavId + '/bu/' + this.buId + '/import-excel/parties?eaid=' + this.eaIdStoreService.encryptedEaId;
    }
    this.eaRestService.postApiCall(url, formdata).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        if(response.data.message){
          this.message = response.data.message?.text
        }
        else if(response.data.invalidPartyIds){
          this.documentId = response.data.documentId
        } else {
          this.activeModal.close({
            excelSearchResponse : response
          });
        }
      }else {
        this.messageService.displayMessagesFromResponse(response);
      }
    })

  //  this.documentId =  123321
  }

  downloadErrorFile(){
    let url ='project/cav/bu/import-excel/parties/' + this.documentId 
    if(this.isEditEaidFlow){
      url = url + '?eaid=' + this.eaIdStoreService.encryptedEaId;
    }
    //ngapi/project/cav/bu/import-excel/parties/{documentId}
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

}

