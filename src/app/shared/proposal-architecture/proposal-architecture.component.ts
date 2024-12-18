import { ConstantsService } from '@app/shared/services/constants.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { Component, OnInit, ViewChild, Input, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AppDataService } from '../services/app.data.service';
import { ProposalArchitectureService } from './proposal-architecture.service';
import { LocaleService } from '../services/locale.service';
import { UtilitiesService } from '../services/utilities.service';
import { PermissionService } from '@app/permission.service';


@Component({
  selector: 'app-proposal-architecture',
  templateUrl: './proposal-architecture.component.html',
  styleUrls: ['./proposal-architecture.component.scss']
})
export class ProposalArchitectureComponent implements OnInit, OnDestroy {

  @Input() architectureShow: boolean;
  @Input() isEditProposal: boolean;
  @Input() qualId;
  @Input() subRefId:string="";
  @ViewChild('myDropDataCenter', { static: false }) myDropDataCenter;
  @ViewChild('myDropArchitecture', { static: false }) myDropArchitecture;
  @ViewChild('myDropProductDiscount', { static: false }) myDropProductDiscount;
  @ViewChild('myDropServiceDiscount', { static: false }) myDropServiceDiscount;
  @Input() type: any;
  @Output() architectureName = new EventEmitter();
  @Output() nonMSPBillingError = new EventEmitter();
  @Output() selectedMSPAnswer = new EventEmitter();

  euifNumber = 61002002;
  dataCenter = [{ 'id': 1, 'value': '01' }, { 'id': 2, 'value': '02' }]
  selectedArchitecture = 'Cisco DNA';
  selectedProductDiscounts = '42';
  selectedServiceDiscounts = '20';
  existingEA: string;
  questionarie = [];
  questionarieNew = [];
  selectedEa = '01';

  mspQuestion = { question: 'Is this a DNA enrollment sold through an MSP?',
  answers: [{ 'selected': this.createProposalService.isMSPSelected, 'value': 'Yes' },
  { 'selected': !this.createProposalService.isMSPSelected, 'value': 'No' }] };
  oldMSPSelectedValue = false;

  isToShowQuestionnaire = false;
  errorMessage = this.localeService.getLocalizedMessage('proposal.create.inputerror'); // 'This field is required';
  radioErrorMessage = this.localeService.getLocalizedMessage('proposal.create.radioerror');
  checkBoxErrorMessage = this.localeService.getLocalizedMessage('proposal.create.checkboxerror');
  parentDropDownSelectedStr = '';
  childDropDownSelectedStr = '';
  myEventSubscription: any;
  isToMakeQuestionEditable = true;
  // isMinimumValueEntered = false;
  partnerLedFlow = false;
  showAuthMessage = false;
  disableSelection = false;
  @Input() isRenewalFlow = false;

  constructor(public appDataService: AppDataService, public renderer: Renderer2,
    public proposalArchitectureService: ProposalArchitectureService, public createProposalService: CreateProposalService,
    public localeService: LocaleService, public proposalDataService: ProposalDataService,
    public constantsService: ConstantsService, public utilitiesService: UtilitiesService, public permissionService: PermissionService) { }

  ngOnInit() {
    
    this.oldMSPSelectedValue = this.createProposalService.isMSPSelected;

    // check if not has proposal edit permission or roadmappath and show readonly mode
    if (!this.permissionService.proposalEdit || this.appDataService.roadMapPath) {
      this.disableSelection = true;
    }


    let disable = false;
    if (this.disableSelection && this.type === 'edit') {

      disable = true;
    }

    this.partnerLedFlow = this.createProposalService.isPartnerDeal;
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.isToMakeQuestionEditable = !this.appDataService.userInfo.roSuperUser;
    }
    // if renewal flow set security choice as arch name default
    if(!this.isRenewalFlow){
      this.proposalArchitectureService.questions = [];
    } else {
      this.selectedArchitecture = 'Cisco Security Choice';
    }
    this.proposalArchitectureService.showError = false;
    this.proposalArchitectureService.isToShowArchitectureEditError = false;
    if (this.proposalArchitectureService.createPageResetEmitter) {
      let _self = this;
      this.myEventSubscription = this.proposalArchitectureService.createPageResetEmitter.subscribe(() => {

        this.createProposalService.isMSPSelected = false;
        this.mspQuestion.answers[0].selected = false;
        this.mspQuestion.answers[1].selected = true;

        _self.resetQuestionnaire();
      });
    }
    if (this.architectureShow) {
      // When creating proposal
      this.getArchitectureList();

    } else if(!this.architectureShow) {
      // when editing proposal
      this.isToShowQuestionnaire = true;
      // if (this.appDataService.subHeaderData.subHeaderVal[7] !== this.constantsService.DNA) {
      this.proposalArchitectureService.getQuestionnaireForProposalId(
        this.proposalDataService.proposalDataObject.proposalId).subscribe((_response: any) => {
        if (!_response.error) {
          if (!_response['data']) {
            this.proposalArchitectureService.isToShowArchitectureEditError = true;
          } else {
            this.proposalArchitectureService.isToShowArchitectureEditError = false;
            this.proposalArchitectureService.makeFinalObjectForEditQuestionnaire(_response);
          }
        } else {
          this.proposalArchitectureService.questions = [];
          this.proposalArchitectureService.isToShowArchitectureEditError = true;
        }
      });
      // }
    }

  }

  getArchitectureList() {
    this.proposalArchitectureService.showError = false;
    this.proposalArchitectureService.getProposalArchitectures().subscribe((_archResponse) => {
      this.proposalArchitectureService.architectureListObject = _archResponse;
      this.proposalArchitectureService.architectureListObject.isParentQuestion = true;

      for (let ans of this.proposalArchitectureService.architectureListObject.answers) {
        ans.questionnaire = [];
      }
      // this.getDefaultSelectedArchitecture();
      if(this.isRenewalFlow){ // if renewal flow push the archListObj to defaultQnaObj and set the qna
        let selectedArch = {};
        // check and set sec arch selected and store it in selectedArch
        for (const arch of this.proposalArchitectureService.architectureListObject.answers){
          if(arch.name === 'SEC'){
            arch.selected = true;
            selectedArch = arch;
          }
        }
        this.proposalArchitectureService.questions.push(this.proposalArchitectureService.architectureListObject); // push the main archlistobj into defaultSelectedQna
        this.setQnaWithSelectedArch(this.proposalArchitectureService.questions,this.proposalArchitectureService.architectureListObject, selectedArch) // method to set default values for qna
      } else {
        this.selectedArchitecture = this.localeService.getLocalizedMessage('proposal.create.archplaceholder');
    }
    });
  }

  getDefaultSelectedArchitecture() {
    this.isToShowQuestionnaire = false;
    for (let _ans of this.proposalArchitectureService.architectureListObject.answers) {
      _ans.selected = false;
      if (_ans.defaultSelected === true) {
        if (_ans.name !== this.constantsService.DNA) {
          this.isToShowQuestionnaire = true;
        }
        _ans.selected = true;
        this.selectedArchitecture = _ans.description;
        break;
      }
    }
  }

  getArchData() {
    this.proposalArchitectureService.getArchitectureData().subscribe((response: any) => {
      this.questionarie = response;
    });
  }

  getArchDataNew() {
    this.proposalArchitectureService.getArchitectureDataNew().subscribe((response: any) => {
      this.questionarieNew = response;
    });
  }

  changeExistence(ques, ans) {

    if (ques.type === 'radio') {
      // reset all
      for (let _answer of ques.answers) {
        _answer.selected = false;
      }
      ans.selected = true;
      // ques.selectedAnswer = ans;

      // if user  tries to deselect parent then child must be removed to update the button;
      if (ques.answers) {
        for (let childQuestions of ques.answers) {
          if (childQuestions['questionnaire']) {
            for (let childQuestion of childQuestions['questionnaire']) {
              this.proposalArchitectureService.clearChildques(childQuestion);
            }
          }
        }

      }

      if (this.architectureShow === false) {
        this.proposalArchitectureService.isToEnableUpdateButton(ans, ques);
      }

      if (ans.parentId && ans.parentId.length > 0 && (!ans.questionnaire || ans.questionnaire.length === 0)) {
        this.getQuesAndAnsForSelecetdOption(ques, ans);
      }
    }
  }


  // selectMSP(answers,answer) {

  //  this.createProposalService.isMSPSelected = false;
  //  for (let _answer of answers) {
  //       _answer.selected = false;
  //     }
  //     answer.selected = true;
  //     if (answer.value === 'Yes') {
  //       this.createProposalService.isMSPSelected = true
  //       this.nonMSPBillingError.emit(true);
  //     }
  //     else {
  //       this.nonMSPBillingError.emit(false);
  //     }
  //     if (this.oldMSPSelectedValue !== this.createProposalService.isMSPSelected ) {
  //       this.proposalArchitectureService.isToEnableUpdateBtnForEditQuestionnaire = true;
  //     }else {
  //       this.proposalArchitectureService.isToEnableUpdateBtnForEditQuestionnaire = false;
  //     }
  // }

  selectMSP(answers, answer) {

    let newSelectedValue = false;

    if (!this.isEditProposal) {
      this.createProposalService.isMSPSelected = false;
    }
    for (let _answer of answers) {
      _answer.selected = false;
    }
    answer.selected = true;
    if (answer.value === 'Yes') {

      newSelectedValue = true;
      if (!this.isEditProposal) {
        this.createProposalService.isMSPSelected = true;
        this.selectedMSPAnswer.emit(newSelectedValue);
        this.createProposalService.proposalArchQnaEmitter.emit({'selectedMSPAnswer': true, 'selectedMSPAnswerValue': newSelectedValue});
      }
    } else {
      newSelectedValue = false;
      if (!this.isEditProposal) {
        this.nonMSPBillingError.emit();
        this.createProposalService.proposalArchQnaEmitter.emit({'nonMSPBillingError': true});
      }
    }

    this.selectedMSPAnswer.emit(newSelectedValue);
    this.createProposalService.proposalArchQnaEmitter.emit({'selectedMSPAnswer': true, 'selectedMSPAnswerValue': newSelectedValue});
    if (this.oldMSPSelectedValue !== newSelectedValue) {
      this.proposalArchitectureService.isMspSelectionChanged = true;
      this.proposalArchitectureService.isToEnableUpdateBtnForEditQuestionnaire = true;
    } else {
      this.proposalArchitectureService.isMspSelectionChanged = false;
      this.proposalArchitectureService.isToEnableUpdateBtnForEditQuestionnaire = false;
    }
  }



  // check selected arch with purchase options code and show warning message
  checkPurchaseAuthorization(name, data) {
    if (Object.keys(data).length > 0 && data.archs) {
      let validArch = data.archs.filter(arch => arch.code === name);
      if (validArch.length > 0) {
        this.showAuthMessage = false;
      } else {
        this.showAuthMessage = true;
      }
    } else {
      this.showAuthMessage = true;
    }
  }
  onArchitectureChange(dropdownArchs, selectedarch) {

    this.createProposalService.isMSPSelected = false;
    this.mspQuestion.answers[0].selected = false;
    this.mspQuestion.answers[1].selected = true;

    this.architectureName.emit(selectedarch.name);
    this.createProposalService.proposalArchQnaEmitter.emit({'archName': selectedarch.name, 'isArchNameSelected': true});
    this.isToShowQuestionnaire = false;
    this.proposalDataService.selectedArchForQna = selectedarch.name;
    this.createProposalService.mspPartner = this.createProposalService.eligibleArchs.includes(this.proposalDataService.selectedArchForQna);    


    this.createProposalService.selectedArchitecture = selectedarch.name;

    // if type is create and partnerled flow call the method to check purchse auth
    if (this.type === 'create' && this.partnerLedFlow) {
      this.checkPurchaseAuthorization(selectedarch.name, this.appDataService.purchaseOptiponsData)
    }
    this.proposalDataService.validateBillingModel();
    this.selectedArchitecture = selectedarch.description;
    this.proposalArchitectureService.showError = false;

    if(dropdownArchs.answers){
      for (let _answer of dropdownArchs.answers) {
        _answer.selected = false;
      }
    }

    selectedarch.selected = true;

    if (selectedarch.parentId && selectedarch.parentId.length > 0) {
      this.isToShowQuestionnaire = true;
      if (selectedarch.questionnaire.length === 0) {
        this.getQuesAndAnsForSelecetdOption(dropdownArchs, selectedarch);
      } else {
        this.proposalArchitectureService.questions = selectedarch.questionnaire;
      }
    } else {
      this.proposalArchitectureService.questions = [];
    }
    setTimeout(() => {
      this.myDropArchitecture.close();
    });
  }

  isShowMSPQuestion() {
    let showMSPQuestion = false;
    if (this.createProposalService.mspPartner && this.proposalDataService.selectedArchForQna === this.constantsService.DNA) {
      showMSPQuestion = true;
    } else {
      showMSPQuestion = false;
    }

    return showMSPQuestion;
  }


  getQuesAndAnsForSelecetdOption(_parentQues, ans) {
    this.proposalArchitectureService.getArchQuestionsforParentIds(ans.parentId, this.qualId, ans.name, this.subRefId).subscribe((_response) => {     
      this.setQnaWithSelectedArch(_response, _parentQues, ans); // method to set qna with selected arch and response of seleced answers
    });
  }


  getCreateFinalQuestionerObject(response, result){
      //Recursion break case
      if(response.length < 1){
        return
      }
      //create tree from flat stucture
      for(let i = 0 ; i < result.answers.length; i++){
      for(let v = 0; v < response.length; v++){
          if(result.answers[i].parentId && 
            result.answers[i].parentId.includes(response[v]['id'])){
            if(result.answers[i].questionnaire){
              result.answers[i].questionnaire.push(response[v]); 
            }else{
              result.answers[i].questionnaire = [];
              result.answers[i].questionnaire.push(response[v]); 
            }
            response.splice(v,1);
            //start over loop
            v = -1;
          }
        }  
        if(result.answers[i].questionnaire){
            this.getCreateFinalQuestionerObject(response,result.answers[i].questionnaire[0]);
         }
      }


  }

  onProductDiscountChange(val) {
    this.selectedProductDiscounts = val;
    setTimeout(() => {
      this.myDropProductDiscount.close();
    });
  }

  onServiceDiscountChange(val) {
    this.selectedServiceDiscounts = val.value;
    setTimeout(() => {
      this.myDropServiceDiscount.close();
    });
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  changeLevelOpt(val, a) {
    this.selectedEa = val.value;
  }

  textFinishedediting(ques, ans) {

    ans.isMinimumValueEntered = false;
    ans.selected = false;
    if (ans.description && ans.description.length > 0) { // && ans.description.length > 0
      ans.selected = true;

      if (ques && ques.minValue > 0) {
        if (ques.minValue > ans.description) {
          ans.selected = false;
          ans.isMinimumValueEntered = true;
        }
      }
    }

    // console.log(JSON.stringify(this.proposalArchitectureService.questions));

  }
  // to restrict splecial characters and black spaces and numbers
  restrictNumebrOrBlankSpces($event, ques, ans) {
    if (ques.key === 'sec_content_user_count' || ques.key === 'security_student_count') { // if security count allow only numbers
      this.utilitiesService.numberOnlyKey($event);
    } else {
      this.utilitiesService.restrictBlankSpces($event); // if subscription,free form and restrict balank spaces
    }
  }

  keyupAction(ques, ans) {
    if (this.architectureShow === false) {
      this.proposalArchitectureService.isToEnableUpdateButton(ans, ques);
    }
  }


  dropDownAction(ques, ans) {
    for (let _answer of ques.answers) {
      _answer.selected = false;
    }
    ans.selected = true;
    this.parentDropDownSelectedStr = ans.description;

    if (this.architectureShow === false) {
      this.proposalArchitectureService.isToEnableUpdateButton(ans, ques);
    }
    if (ans.parentId && ans.parentId.length > 0 && !ans.questionnaire) {
      this.getQuesAndAnsForSelecetdOption(ques, ans);
    }
  }

  childDropDownAction(ques, ans) {
    for (let _answer of ques.answers) {
      _answer.selected = false;
    }
    ans.selected = true;
    this.childDropDownSelectedStr = ans.description;

    if (this.architectureShow === false) {
      this.proposalArchitectureService.isToEnableUpdateButton(ans, ques);
    }
    if (ans.parentId && ans.parentId.length > 0 && !ans.questionnaire) {
      this.getQuesAndAnsForSelecetdOption(ques, ans);
    }
  }

  isMandatoryRadioButtonIsSelected(ansList) {
    let _isSelected = false;
    for (let ans of ansList) {
      if (ans.selected === true) {
        _isSelected = true;
        break;
      }
    }
    return _isSelected;
  }

  getSelectedDroDownValue(ques) {
    let str = '';
    for (let ans of ques.answers) {
      if (ans.selected === true) {
        str = ans.description;
        break;
      }
    }
    return str;
  }

  resetQuestionnaire() {
    this.proposalArchitectureService.questions = [];

    this.proposalArchitectureService.showError = false;
    this.proposalArchitectureService.architectureListObject.isParentQuestion = true;

    for (let ans of this.proposalArchitectureService.architectureListObject.answers) {
      ans.selected = false;
      ans.questionnaire = [];
    }
    // this.getDefaultSelectedArchitecture();
    this.selectedArchitecture = this.localeService.getLocalizedMessage('proposal.create.archplaceholder');

  }

  isAnyArchitecturSelected() {
    let isArchSelected = false;
    if (this.proposalArchitectureService.architectureListObject) {
      for (let ans of this.proposalArchitectureService.architectureListObject.answers) {
        if (ans.selected === true) {
          isArchSelected = true;
        }
      }
    }
    return isArchSelected;
  }

  checkBoxClick(ques, ans) {

    ans.selected = !ans.selected;

    if (this.architectureShow === false) {
      this.proposalArchitectureService.isToEnableUpdateButton(ans, ques);
    }

    if (ans.parentId && ans.parentId.length > 0 && (!ans.questionnaire || ans.questionnaire.length === 0)) {
      this.getQuesAndAnsForSelecetdOption(ques, ans);
    }
  }

  ngOnDestroy() {
    if (this.myEventSubscription) {
      this.myEventSubscription.unsubscribe();
    }
  }

  scrollBottom() {
    if (window.pageYOffset > 0) {
      setTimeout(() => {
        window.scrollTo(0, (window.pageYOffset + 100));
      }, 200);
    }
  }

  // method to set qna with selected arch and response of seleced answers
  setQnaWithSelectedArch(_response, _parentQues, ans){
    let tempQuestion:any;
      tempQuestion = _response;
      let questioneSelection = {};
      if (tempQuestion && tempQuestion.length > 0) {
        if (tempQuestion) {
          for (let ques of tempQuestion) {
            for (let childAns of ques.answers) {
              if(childAns.selected){
                childAns.description = childAns.selected;
                childAns.selected = true; 
                questioneSelection[ques['id']] = true;
                if(ques.type !=='checkbox'){ // break the condition if type other than checkbox
                  break;
                }
              }
            }
          }
        }
      }

      if (tempQuestion && tempQuestion.length > 0) {
        if (tempQuestion) {
          for (let ques of tempQuestion) {
            for (let childAns of ques.answers) {
              if (!questioneSelection[ques['id']] && childAns.defaultSelected === true) {
                    childAns.selected = true;
              }
            }
          }
        }
      }
      
      if (_parentQues.isParentQuestion) {
        this.proposalArchitectureService.questions = [];
        let counter = 0;
      //Take All question at First level   
      for(let q = 0; q < tempQuestion.length; q++){
          if(ans.parentId.includes(tempQuestion[q]['id'])){
            this.proposalArchitectureService.questions.push(tempQuestion[q]);
            tempQuestion.splice(q,1);
            //Do dfs and create tree of question and answer
            this.getCreateFinalQuestionerObject(tempQuestion, this.proposalArchitectureService.questions[counter]);
            counter++;
            //start over loop
            q = -1;
          }
        }
        ans.questionnaire =  this.proposalArchitectureService.questions;
      } else {
        ans.questionnaire = tempQuestion;
         //Setting default values      
    }
  }
}
