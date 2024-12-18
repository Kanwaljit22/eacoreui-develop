import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { IQuestion, PriceEstimateStoreService } from '../price-estimate-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { IAtoTier, IEnrollmentsInfo, ISuites, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { QuestionnaireStoreService } from '../questionnaire/questionnaire-store.service';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-strategic-offer',
  templateUrl: './strategic-offer.component.html',
  styleUrls: ['./strategic-offer.component.scss']
})
export class StrategicOfferComponent implements OnInit {
  displayQnaWindow = false;
  strategicOffers = [];
  allOffers = [];
  questionsArray:Array<IQuestion>;
  start = 0;
  start_max = 0;
  show = 2;
  selectedOffer = [];
  roadmapSteps = [];
  currentStep: number = 0;
  enrollmentData:any;
  showTierDrop= false;
  totalSuites = [];
  numberofSelectedSuite = 0;
  isSecuritySuiteAdded = false;
  @Output() onClose = new EventEmitter();
  allSuiteTier = [];
  isAllTierSelected = [];
  viewIndex = 0;
  enrollmentMap = new Map<string, any>();
  summrayView = []
  updatedTierCount = 0;

  constructor(private priceEstimateStoreService: PriceEstimateStoreService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, private vnextService: VnextService, 
    private proposalRestService: ProposalRestService, private proposalStoreService: ProposalStoreService, public questionnaireStoreService: QuestionnaireStoreService, private renderer: Renderer2, public el: ElementRef, 
    public questionnaireService: QuestionnaireService, private constantsService: ConstantsService, public eaService: EaService, private messageService: MessageService, private utilitiesService: UtilitiesService, public elementIdConstantsService: ElementIdConstantsService) {

  }

  ngOnInit(): void {
  this.roadmapSteps = [ {
    "id": "1",
    "name": "Offers",
    "active": false,
    "visible": true
  },
  {
    "id": "2",
    "name": "Security",
    "active": false,
    "visible": false
  },
  {
    "id": "1",
    "name": "Summary",
    "active": false,
    "visible": true
  }];
    this.getOffers();
    this.getQna();
  }

  getOffers() {
    
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId +'/?a=STO'
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.modalMessageClear(); 
      if(this.vnextService.isValidResponseWithData(response, true)) { 
        this.allOffers = response.data.strategicOffers;
        this.show = this.show < this.allOffers.length ? this.show : this.allOffers.length;
        this.strategicOffers = this.allOffers;
        // this.strategicOffers[1].qualificationName = 'E3-SEC-DUO-ADV AND E3-SEC-DUO-PRE AND E3-N-ENTWAN';
        // this.strategicOffers[1].atos[0].selected = true
        // this.strategicOffers[1].atos[1].selected = true
        if (this.allOffers.length < this.show || this.allOffers.length === this.show ) {
          this.start_max = 0;
        } else {
          const floor = Math.floor(this.allOffers.length / this.show);
          this.start_max = ((this.allOffers.length % this.show) === 0) ? floor - 1 : floor;
        }
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  close() {
    this.priceEstimateStoreService.showStrategicOffers = false;
    this.messageService.disaplyModalMsg = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  applyOffer() {
    let enrollmentMap = new Map();
    let request = {
      data: {
        enrollments: []
      }
    };
    this.selectedOffer.forEach((offer) => {
      offer.atos.forEach((ato) => {
        if(enrollmentMap.has(ato.enrollmentId)){
          let enrollment = enrollmentMap.get(ato.enrollmentId);
          if(enrollment && !enrollment.atos.find(atoData => atoData.name === ato.name )){
            enrollment.atos.push({name: ato.name, inclusion: true})
          }
        } else {
          enrollmentMap.set(ato.enrollmentId, {enrollmentId : ato.enrollmentId, atos: [{name: ato.name, inclusion: true}]})
        }
      })
    });

    request.data.enrollments = Array.from(enrollmentMap.values());
    const qnaArray = [];
      if (this.questionnaireService.selectedAnswerMap.size){
        this.questionnaireService.selectedAnswerMap.forEach((value: IQuestion, key: string) => {
          qnaArray.push(value);
      });
    }
    let secuirty = request.data.enrollments.find(enrollment => enrollment.enrollmentId === 3)
    if(qnaArray.length && secuirty){
      secuirty['qnas'] = qnaArray;
    }

    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId +'/?a=STO-SAVE'
    this.proposalRestService.postApiCall(url, request).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if(this.vnextService.isValidResponseWithData(response, true)) {
        this.closeModal();
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  saveOffers(){
    let request = {
      data: {
        enrollments: []
      }
    };
    this.summrayView.forEach((enrollment) =>{
      let enrollmentId;
      let atos = []
      enrollment.pools.forEach((pool) =>{
        pool.suites.forEach((suite) =>{
          enrollmentId = suite.enrollmentId;
          atos.push({name: (suite.selectedTier?.name) ? suite.selectedTier.name : suite.ato , inclusion: true})
        })
      })
      request.data.enrollments.push({enrollmentId:enrollmentId, atos: atos})
    })

    const qnaArray = [];
      if (this.questionnaireService.selectedAnswerMap.size){
        this.questionnaireService.selectedAnswerMap.forEach((value: IQuestion, key: string) => {
          qnaArray.push(value);
      });
    }
    let secuirty = request.data.enrollments.find(enrollment => enrollment.enrollmentId === 3)
    if(qnaArray.length && secuirty){
      secuirty['qnas'] = qnaArray;
    }
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId +'/?a=STO-SAVE'
    this.proposalRestService.postApiCall(url, request).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if(this.vnextService.isValidResponseWithData(response, true)) {
        this.closeModal();
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    })

    console.log(request)
  }

  closeModal(){
    this.priceEstimateStoreService.showStrategicOffers = false;
    this.messageService.disaplyModalMsg = false;
    this.onClose.emit();
    this.renderer.removeClass(document.body, 'position-fixed');
  }
  moveRight() {
    if (this.start === this.start_max) {
      return;
    }
    this.start++;
    this.viewIndex =  this.viewIndex + 2
    this.setPosition();
  }

  moveLeft() {
    if (this.start === 0) {
      return;
    }
    this.start--;
    this.viewIndex =  this.viewIndex - 2
    this.setPosition();
  }

  setPosition() {
   let showOffers = this.allOffers;
   showOffers = showOffers.slice(this.viewIndex, this.viewIndex+2);
   this.strategicOffers = showOffers;

    // const element = this.el.nativeElement.querySelector('.select-strategic-offer');
    // let value = (this.strategicOffers.length > 5) ? 22 : 40;
    // let translateValue = -(this.start * value);
    // this.renderer.setStyle(element, 'transform', 'translateX('+ translateValue +  '%)');
  }

  selectOffer(event, offer) {
    this.isSecuritySuiteAdded = false;
    if (event.target.checked) {
      offer.selected = true;
      this.selectedOffer.push(offer);
    } else {
      offer.selected = false;
      this.selectedOffer.forEach((arr, i)=> {
          if (offer.qualificationName === arr.qualificationName) {
            this.selectedOffer.splice(i,1)
          }
      })
    }

    if(this.selectedOffer.length) {
      this.selectedOffer.forEach(element => {
        element.atos.forEach(suites => {
          if (suites.enrollmentId === 3) {
            this.isSecuritySuiteAdded = true;
          }
        });
      });
    }
   
   
    this.roadmapSteps.forEach((step) => {
      if (step.name === 'Security') {
        if (this.isSecuritySuiteAdded) {
          step.visible = true;
        } else {
          step.visible = false;
        }
      }
    })
    
  }

  getQna() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollment?e=3&a=QNA';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.displayQnaWindow = true;
          this.questionsArray = this.setQnaQuestions(response.data);
          this.questionnaireStoreService.questionsArray = this.questionsArray;
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  setQnaQuestions(questions) { 
    let que;
    let fromIndex
    const toIndex = 0;
    const id = 'scuRange'
    questions.forEach(element => {
      if (element.id === 'scu_count') {
         fromIndex = questions.indexOf(element);
         element['parentId'] = id;
         element.mandatory = false;
      } 
      if (element.id === 'tier') {
        fromIndex = questions.indexOf(element);
        element['parentId'] = id
     }
    });
    que = questions.splice(fromIndex, 1)
    questions.splice(toIndex, 0, que[0])
    return questions;
  }

  next(current) {
    this.currentStep = this.isSecuritySuiteAdded ? current + 1 : current + 2;
    if (this.currentStep === 2) {
      const selectedOfferCopy = this.utilitiesService.cloneObj(this.selectedOffer); 
      selectedOfferCopy.forEach((offer) => {
        offer.suites.forEach((suite) => {

          suite.offerName = offer.offerName
          if (suite.tiers && suite.tiers.length) {
            suite.selectedTier = {};
          }
          const enrollment = this.enrollmentMap.get(suite.enrollmentName)
          if (enrollment) {
            enrollment.push(suite);
          } else {
            this.enrollmentMap.set(suite.enrollmentName, [suite]);
          }

        });
      })
      this.createSummrayView()
      
    }
    this.messageService.disaplyModalMsg = false;
    this.messageService.modalMessageClear();
  }

  createSummrayView() {
    const enrollment = []
    this.enrollmentMap.forEach((enValue: any, enKey: string) => {
      let poolMap = new Map<string, any>();
      enValue.forEach((suite) => {
        const pool = poolMap.get(suite.poolDesc)
        if (pool) {
          let addedSuite = pool.find(element => element.desc === suite.desc)
          if(!addedSuite) { // if suite is not added in pool add suite
            suite.offerList = [suite.offerName]
            if(suite.tiers?.length){
              this.updatedTierCount++
            }
            pool.push(suite);
          } else { // if suite is already added then check for tiers 
            
            if(suite.tiers?.length){
              if(addedSuite.tiers){
                suite.tiers.forEach((tier) =>{ // if tiers array already present then add tiers which are not persent in array
                  if(!addedSuite.tiers.find(element => element.name === tier.name)){
                    addedSuite.tiers.push(tier)
                  }
                })
              } else { // if suite does not have any tier, add all tiers 
                this.updatedTierCount++
                addedSuite.tiers = suite.tiers
              }
            }
            addedSuite.offerList.push(suite.offerName)//to display all offer name in tooltip 
          }
        } else {
          suite.offerList = [suite.offerName]
          if(suite.tiers?.length){
            this.updatedTierCount++
          }
          poolMap.set(suite.poolDesc, [suite]);
        }
      })
      const poolArray = []
      poolMap.forEach((poolValues, poolKey) => {
        this.utilitiesService.sortArrayByDisplaySeq(poolValues); //to sort suites 
        poolArray.push({ 'poolDesc': poolKey, displaySeq: poolValues[0].poolDisplaySeq, enrollmentDisplaySeq: poolValues[0].enrollmentDisplaySeq, 'suites': poolValues })
      });
      this.utilitiesService.sortArrayByDisplaySeq(poolArray); // to sort pools
      enrollment.push({ 'enrollemntName': enKey, displaySeq: poolArray[0].enrollmentDisplaySeq, 'pools': poolArray })
      this.utilitiesService.sortArrayByDisplaySeq(enrollment); // to sort enrollment
    });
    console.log(enrollment)
    this.summrayView = enrollment
  }
  
  goToStep(index) {
    if (index === this.currentStep || index > this.currentStep) {
      return;
    } else {
      this.messageService.disaplyModalMsg = false;
      this.messageService.modalMessageClear();
      this.currentStep = index;
      this.allSuiteTier = [];
      this.isAllTierSelected = [];
      this.summrayView = [];
      this.updatedTierCount = 0;
      this.enrollmentMap.clear()
      
   }
  }

  suiteAtoSelection(tierObj: IAtoTier, suite, offerName?) {
    suite.tiers.forEach(tier =>
      tier.selected = false
    );
    if(!suite['selectedTier']?.desc){
      this.updatedTierCount--;
    }
    suite['selectedTier'] = tierObj;
    tierObj.selected = true;
  }

  isSelectedTierValid(suite){
    if(suite.swSelectedTier && suite.swSelectedTier.hasOwnProperty("educationInstituteOnly")){
      let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
      if(qna){
          let answer = qna.answers[0];
          if(answer.id === "edu_institute_qna_n" && answer.selected && suite.swSelectedTier.educationInstituteOnly){
            let suiteTiers = suite.tiers;
            for(let i=0;i<suiteTiers.length;i++){
                if(suiteTiers[i] && !suiteTiers.hasOwnProperty("educationInstituteOnly")){
                  suite.swSelectedTier.selected = false;
                  suite.swSelectedTier = suiteTiers[i];
                  suiteTiers[i].selected = true;
                  break;
                }
            }
          } 
      } else if(this.questionnaireStoreService.questionsArray){
          for(let i=0;i<this.questionnaireStoreService.questionsArray.length;i++){
              if(this.questionnaireStoreService.questionsArray[i].id === this.constantsService.EDUCATION_INSTITUTE_QUESTION){
                  let answers = this.questionnaireStoreService.questionsArray[i].answers;
                  if(answers[0].id === "edu_institute_qna_n" && (answers[0].selected || answers[0].defaultSel)){
                    let suiteTiers = suite.tiers;
                    for(let i=0;i<suiteTiers.length;i++){
                        if(suiteTiers[i] && !suiteTiers.hasOwnProperty("educationInstituteOnly")){
                          suite.swSelectedTier.selected = false;
                          suite.swSelectedTier = suiteTiers[i];
                          suiteTiers[i].selected = true;
                          break;
                        }
                    }
                  }
                  break;
              }
          }
      }
    }
    return true;
  }

  isEducationInstitueSelected(tier: IAtoTier) {
    if (tier.hasOwnProperty("educationInstituteOnly")) {
      let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
      if (qna) {
        let answer = qna.answers[0];
        if (answer.value === 'true' && tier.educationInstituteOnly) {
          return true;
        } else {
          return false;
        }
      } else if (this.questionnaireStoreService.questionsArray) {
        if (!this.questionnaireStoreService.isEducationInstituteSelected) {
          for (let i = 0; i < this.questionnaireStoreService.questionsArray.length; i++) {
            if (this.questionnaireStoreService.questionsArray[i].id === this.constantsService.EDUCATION_INSTITUTE_QUESTION) {
              let answers = this.questionnaireStoreService.questionsArray[i].answers;
              if (answers[0].selected) {
                this.questionnaireStoreService.isEducationInstituteSelected = true;
                break;
              }

            }
          }
        }
        if (this.questionnaireStoreService.isEducationInstituteSelected && tier.educationInstituteOnly) {
          return true;
        } else {
          return false;
        }
      }
    }
    return true;
  }
  
  expandEnrollment(enrollment){
    enrollment['hide'] = !enrollment['hide']
  }
  expandPool(pool){
    pool['hide'] = !pool['hide']
  }

}
