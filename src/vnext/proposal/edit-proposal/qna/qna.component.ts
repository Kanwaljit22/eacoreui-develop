import { QuestionnaireStoreService, ITooltip } from './../price-estimation/questionnaire/questionnaire-store.service';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { QuestionnaireService } from './../price-estimation/questionnaire/questionnaire.service';
import { IQuestion, IAnswer } from './../price-estimation/price-estimate-store.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaStoreService } from 'ea/ea-store.service';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.scss']
})
export class QnaComponent implements OnInit, OnDestroy {
  activeColumn = false;
  constructor(public questionnaireService: QuestionnaireService, public priceEstimateService: PriceEstimateService, public dataIdConstantsService: DataIdConstantsService,
    private questionnaireStoreService: QuestionnaireStoreService, private utilitiesService: UtilitiesService, public proposalStoreService: ProposalStoreService,
    public localizationService:LocalizationService, private eaService: EaService, private constantService: ConstantsService, private eaStoreService: EaStoreService) { }

  @Input() questions: Array<IQuestion>;
  @Input() firstLevel: boolean;
  firstLevelQuestions = new Array<IQuestion>();
  displayTooltipArray: Array<any>;
  showDetails = false;
  showTiers = false;
  selectedTierObj: IAnswer;
  commitmentTierArr = [];
  disableAccess = false;
  disableCommitment = false; // se tot disable commitment tiers selecion
  tierLength: number;
  selectedTierIndex: number;
  showCountInfo = false;
  showCountError = false;
  showScuError = false;
  scuCount: number;
  inEligibleTierIndex : number;
  recomendedIndex: number;
  showExceptionForScu = false;

  ngOnInit() {
    // this.eaService.getLocalizedString('add-suites.qna');
    if(!this.questions || !this.questions.length){
      this.questions = this.questionnaireStoreService.questionsArray;
    }
    this.getFirstLevelQuestion();

    if (this.questions) {
      for (let i = 0; i < this.questions.length; i++) {
        this.questions[i].answers.forEach((answer) => {
        let selectedQuestion: IQuestion = { 'id': this.questions[i].id };
          if (answer.selected) {
            const answersArray = [{ 'id': answer.id, "selected": true, 'value': answer.value }];
            selectedQuestion.answers = answersArray;
            this.questionnaireService.selectedAnswerMap.set(this.questions[i].id, selectedQuestion);
          
          }
           if (answer.id === 'user_count_qna_value' && answer.value !== "") {
            const answersArray = [{ 'id': answer.id, "selected": true, 'value': answer.value }];
            selectedQuestion.answers = answersArray;
            this.questionnaireService.selectedAnswerMap.set(this.questions[i].id, selectedQuestion);
           }
        })
      }
      if (this.questions[0].id === 'user_count') {
        this.showCountInfo = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.selectedTierObj && this.selectedTierObj.id === 'tier_qna_tier0' && this.questionnaireService.selectedAnswerMap.has(this.constantService.SCU_COUNT)) {
      this.questionnaireService.selectedAnswerMap.delete(this.constantService.SCU_COUNT);
    }
    this.firstLevelQuestions.forEach(question => {
      if (question.mandatory && this.questionnaireService.mandatoryQuestCount) {
        this.questionnaireService.mandatoryQuestCount--;
      }
      question.answers.forEach(answer => {
        if (question.displayType === "number") {
          answer.value = ''
        }
        answer.selected = false;
      });
    });
  }


  private getFirstLevelQuestion() {
    this.showExceptionForScu = false;
    if (this.questions) {
      for (const question of this.questions) {
        if (question.parentAId && this.firstLevel) {
          if (this.questionnaireService.nextLevelQuestionsMap.has(question.parentAId)) {
            const questionsArray = this.questionnaireService.nextLevelQuestionsMap.get(question.parentAId);
            questionsArray.push(question);
          } else {
            const questionsArray = new Array<IQuestion>();
            questionsArray.push(question);
            this.questionnaireService.nextLevelQuestionsMap.set(question.parentAId, questionsArray);
          }
        } else {
          this.firstLevelQuestions.push(question);
          let isAnswerAlreadySelected = false;
          let defaultSel;
          let indexToUpdate = 0;
          question.answers.forEach((answer, index) => {//use for and add break;
            if (answer.id === 'tier_qna_tier0' && answer.disabled) {
              this.disableAccess = true;
            }
            if (answer.selected) {
              isAnswerAlreadySelected = true;
              // if tier selection set selectedTierObj
              if (question.id === 'tier') {
                this.selectedTierObj = answer;
              }
              if (question.id === 'user_count') {
                if (parseInt(answer.value) < 250) {
                  this.showCountError = true;
                  this.questionnaireService.mandatoryQuestCount++;
                }
              } 
            }
            else if (answer.defaultSel) {
              defaultSel = answer.defaultSel;
              indexToUpdate = index;
              // if tier selection set selectedTierObj
              if (question.id === 'tier' && !this.selectedTierObj) {
                this.selectedTierObj = answer;
              }
            }
          });
          if (!isAnswerAlreadySelected) {
            if (defaultSel) {
              if (question.id === 'tier' && !this.selectedTierObj.selected) {
                this.setQnaMapInitial(question, this.selectedTierObj, indexToUpdate);
              } else {
                this.setQnaMapInitial(question, defaultSel, indexToUpdate);
              }
            } else if (question.mandatory) {
              if (question.id === 'user_count') {
                question.answers.forEach((answer) => { 
                  if (answer.value === '') {
                    this.questionnaireService.mandatoryQuestCount++
                  }
                })
              } else {
                this.questionnaireService.mandatoryQuestCount++
              }
            }

          }


        }
        if(question.additionalInfo && question.additionalInfo.scuCountRange) {
          this.prepareTiersCount(question.answers, question.additionalInfo)
        }
        if (question.additionalInfo && question.additionalInfo.threshold) {
          this.prepareTooltipForTiers(question.additionalInfo);
        }
        // if tier selection, set minimum commitment rule array
        if (question.id === 'tier') {
          this.setSelectedTier(question, this.selectedTierObj);
          if(this.selectedTierObj.id === 'tier_qna_tier0' && !this.disableAccess){
            const commitmentTierArrCopy = question.answers.filter(tier => tier.id !== 'tier_qna_tier0');
            this.disableCommitment = commitmentTierArrCopy.every(tier => tier.disabled);
          }
        }
      }
    }
  }

  // set qna for initial load for first level questions
  setQnaMapInitial(question, defaultSel, indexToUpdate) {
    question.answers[indexToUpdate].selected = true;
    const selectedQuestion: IQuestion = { 'id': question.id };
    // if id not present in defaultselected answer, get answer object selected from question
    if (!defaultSel.id){
      defaultSel = question.answers[indexToUpdate];
    }
    selectedQuestion.answers = [{ 'id': defaultSel.id, "selected": true, 'value': defaultSel.value }];
    this.questionnaireService.selectedAnswerMap.set(question.id, selectedQuestion);
  }


  public checkForChildQuestion(question: IQuestion, answer: IAnswer) {
    this.getChildQuestion(question, answer, true);
    return answer.selected;
  }

  public getChildQuestion(question: IQuestion, answer: IAnswer, checkForOnlyChild?) {
    if (!checkForOnlyChild) {
      this.showDetails = false;
    }
    // if (question.id === 'tier' && answer.selected) {
    //   this.showTiers = false;
    //   return;
    // }
    if (question.displayType === 'radio') {
      question.answers.forEach(ans => {//set previously selected answer as false;
        ans.selected = (ans.id === answer.id) ? true : false;
      });
      const answersArray = [{ 'id': answer.id, "selected": true, 'value': answer.value }];
      if (this.questionnaireService.selectedAnswerMap.has(question.id)) {//this lock will run if that question is already answered
        const questionForRequest = this.questionnaireService.selectedAnswerMap.get(question.id);
        questionForRequest.answers = answersArray;
        //remove child question for previously selected answer from selectedAnswerMap...
        if (question.questions && question.questions.length && !checkForOnlyChild) {
          question.questions.forEach(childQuestion => {
            if (this.questionnaireService.selectedAnswerMap.has(childQuestion.id)) {
              this.questionnaireService.selectedAnswerMap.delete(childQuestion.id);
              this.questionnaireService.mandatoryQuestCount++;
            }
          });
        }
      } else {
        if (!checkForOnlyChild) {
          const selectedQuestion: IQuestion = { 'id': question.id };
          selectedQuestion.answers = answersArray;
          this.questionnaireService.selectedAnswerMap.set(question.id, selectedQuestion);
          //If mandatory quest. is answered then decerese the count of  mandatoryQuestCount;
          if (question.mandatory && this.questionnaireService.mandatoryQuestCount) {
            this.questionnaireService.mandatoryQuestCount--;
          }
        }
      }
    }
    question.questions = [];
    //check if the answer has any child questions or not 
    if (this.questionnaireService.nextLevelQuestionsMap.has(answer.id + '')) {
      question.questions = this.questionnaireService.nextLevelQuestionsMap.get(answer.id + '');
    } else {
      question.questions = [];
    }
    // if tier selection, set minimum commitment rule array
    if (question.id === 'tier') {
      if (!(this.questionnaireService.selectedAnswerMap.has(question.id))) {
        let selectedQuestion: IQuestion = { 'id': question.id };
        question.answers.forEach(ans => {//set previously selected answer as false;
          ans.selected = (ans.id === answer.id) ? true : false;
        });
        const answersArray = [{ 'id': answer.id, "selected": true, 'value': answer.value }];
        selectedQuestion.answers = answersArray
        this.questionnaireService.selectedAnswerMap.set(question.id, selectedQuestion);
        this.questionnaireService.mandatoryQuestCount--
      }
      if ((this.questionnaireService.selectedAnswerMap.has(this.constantService.SCU_COUNT))) {
        let scuQuestion: IQuestion = { 'id': this.constantService.SCU_COUNT };
        scuQuestion.answers = [{ 'id': question.scuCountInfo[0].id, "selected": true, 'value': question.scuCountInfo[0].value }];
        this.questionnaireService.selectedAnswerMap.set(scuQuestion.id, scuQuestion);
        this.questionnaireService.selectedScuCount = question.scuCountInfo[0].value;
      }
      this.setSelectedTier(question, answer, true);
    }

  }


  updateTextboxValue(question, value) {
    const isAlreadyAnswerd = this.questionnaireService.selectedAnswerMap.has(question.id)
    if (value && question.answers[0].value !== value) {
      const answersArray = [{ 'id': question.id, "selected": true, 'value': value }];
      if (isAlreadyAnswerd) {
        const questionForRequest = this.questionnaireService.selectedAnswerMap.get(question.id);
        questionForRequest.answers = answersArray;
      } else {
        const selectedQuestion: IQuestion = { 'id': question.id };
        selectedQuestion.answers = answersArray;
        this.questionnaireService.selectedAnswerMap.set(question.id, selectedQuestion);
        //for checking mandatory question answered or not 
        if (question.mandatory && this.questionnaireService.mandatoryQuestCount) {
          this.questionnaireService.mandatoryQuestCount--;
        }
      }

    } else if (!value && isAlreadyAnswerd) {
      this.questionnaireService.mandatoryQuestCount++;
      this.questionnaireService.selectedAnswerMap.delete(question.id);
    } else if (value && isAlreadyAnswerd && question.answers[0].value === value) {
      const answersArray = [{ 'id': question.id, "selected": true, 'value': value }];
      const questionForRequest = this.questionnaireService.selectedAnswerMap.get(question.id);
        questionForRequest.answers = answersArray;
    }

  }
  //This method is use to set the value for tooltip for tier question.
  prepareTooltipForTiers(additionalInfo) {
    // sort by displayseq
    if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
      this.utilitiesService.sortArrayByDisplaySeq(additionalInfo.threshold); 
    }
    for (const anserThershold of additionalInfo.threshold) {
      const keysArray = Object.keys(anserThershold);
      // replace qtyunit string with currency code from proposal
      anserThershold['qtyUnit'] = anserThershold['qtyUnit'].replace('$$UI-CurrencyCode$$', this.proposalStoreService.proposalData.currencyCode);
      for (const key of keysArray) {
        if (this.isObject(anserThershold[key]) && key.search('Threshold')) {
          const threshodObject = anserThershold[key];
          const tierNameArray = Object.keys(threshodObject);
          this.tierLength = tierNameArray.length;
          for (const tierName of tierNameArray) {
            const keyForMap = anserThershold['desc'] + '$' + anserThershold['qtyUnit'] + '$' + key + '$' + tierName + '$' + threshodObject[tierName];
            if (this.questionnaireStoreService.tierTooltipMap.has(keyForMap)) {
              const mapValueObject = this.questionnaireStoreService.tierTooltipMap.get(keyForMap);
              mapValueObject.atoName = mapValueObject.atoName + ' , ' + anserThershold['name'];
            } else {
              const mapValueObject: ITooltip = {
                atoName: anserThershold['name'],
                qtyUnit: anserThershold['qtyUnit'],
                count: threshodObject[tierName],
                suiteName: anserThershold['desc']
              };
              // set qtyUnitDisplaySeq, displaySeq
              if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
                mapValueObject['qtyUnitDisplaySeq'] = anserThershold['qtyUnitDisplaySeq'] ? anserThershold['qtyUnitDisplaySeq'] : 0;
                mapValueObject['displaySeq'] = anserThershold['displaySeq'] ? anserThershold['displaySeq'] : 0;
              }
              this.questionnaireStoreService.tierTooltipMap.set(keyForMap, mapValueObject);
            }
          }
        }
      }
    }
  }


  public getTierDetails(answerId) {
    this.displayTooltipArray = new Array<any>();
    this.commitmentTierArr = [];
    
    if (this.questionnaireStoreService.tierTooltipMap.size && answerId !== 'TIER_0') {
      for (let key of this.questionnaireStoreService.tierTooltipMap.keys()) {
        if (key.indexOf(answerId) !== -1) {
          const toolTipObject = this.questionnaireStoreService.tierTooltipMap.get(key);
          toolTipObject.count = this.utilitiesService.convertFloatValueByDecimalCount(+toolTipObject.count, 2).toString();
          this.displayTooltipArray.push(toolTipObject);
          this.showDetails = true;
        }
      }
    } else if (answerId === 'TIER_0') {
      this.showDetails = false;
    }

    const qtyKeysArr = []
    const keyArr = [];
    let setarr = new Map<string, any>();
    for (let key of this.questionnaireStoreService.tierTooltipMap.keys()) {
      let tempkey = this.questionnaireStoreService.tierTooltipMap.get(key)
      let qtyKey = tempkey.qtyUnit
      if (qtyKeysArr.indexOf(qtyKey) === -1) {
        qtyKeysArr.push(qtyKey);
      }
      if (qtyKeysArr.indexOf(key) === -1) {
        keyArr.push(key);
      }
    }
    
    for (let k = 0; k < qtyKeysArr.length; k++) {
      setarr.clear();
      let qtyObj = {
        suites: [],
        suiteType: '',
        tiersArr: [],
        displaySeq: 0
      };
      if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
          qtyObj['displaySeq'] = 0;
      }
      for (let j = 0; j < keyArr.length; j++) {
        if (keyArr[j].indexOf(qtyKeysArr[k]) !== -1) {
          const key = keyArr[j]
          let toolTipObject = this.questionnaireStoreService.tierTooltipMap.get(key);
          setarr.set(keyArr[j], toolTipObject)
          for (let i = 1; i <= this.tierLength; i++) {
              let tierKey = 'TIER_' + i;
              for (let userkey of setarr.keys()) {
                if (userkey.indexOf(tierKey) !== -1) {
                  const obj = setarr.get(userkey);
                  if(i === 1 && qtyObj.suites.indexOf(obj.suiteName) === -1) {
                    qtyObj.suites.push(obj.suiteName);
                    // check index of currency code
                    let stringIndex = obj.qtyUnit.indexOf(this.proposalStoreService.proposalData.currencyCode)
                    if (stringIndex > 0) {
                      qtyObj.suiteType = obj.qtyUnit
                    } else {
                      qtyObj.suiteType = obj.qtyUnit.toLowerCase();
                    }
                    if((this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI) && obj.qtyUnitDisplaySeq){
                      qtyObj.displaySeq = obj.qtyUnitDisplaySeq;
                    }
                  }
                 // qtyObj[tierKey]  = obj.count;
                  qtyObj.tiersArr[i] =  obj.count;
                }
              }
            }
          }
        }
      this.commitmentTierArr.push(qtyObj);
    }
    // sort qtyunitdisplayseq
    if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
      this.utilitiesService.sortArrayByDisplaySeq(this.commitmentTierArr);
    }
    // this.showDetails = true;
  }

  isObject(val) {
    if (val === null) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
  }

  // check keydown event, allow only numbers
  checkUpdatedValue(event, ques, value) {
    if (!this.utilitiesService.isNumberOnlyKey(event)) {
      event.preventDefault();
    }
    if (ques.id === 'user_count') {
      if (value < ques.min) {
        this.showCountError = true;
        this.questionnaireService.mandatoryQuestCount = 1
      } else {
        this.showCountError = false;
        this.questionnaireService.mandatoryQuestCount = 0;
      }
    } 
  }

  showMinCommitmentRules() {
    this.showDetails = !this.showDetails;
  }

  setSelectedTier(question, answer, isUserChange = false) {
    this.showExceptionForScu = false;
    this.selectedTierObj = answer;
    this.getTierDetails(answer.value);
    this.showTiers = false;
    this.selectedTierIndex = parseInt(this.selectedTierObj.value.match(/(\d+)/)[0]);
    let recommendedScuRangeTier: any;
    let recommendedScuRangeIndex: any;
    if (!isUserChange) {
      let scuInfo;
      this.firstLevelQuestions.forEach((element) => {
        if (element.id === this.constantService.SCU_COUNT) {
          scuInfo = element.answers;
          scuInfo[0].desc = element.desc
        }
        if (element.id === 'tier') {
          element.scuCountInfo = scuInfo;
          if (!element.scuCountInfo[0].value){
            element.scuCountInfo[0].value = this.questionnaireService.selectedScuCount ? this.questionnaireService.selectedScuCount : answer.min
          }
          // check for entered scu range and set the recommended range and tier
          recommendedScuRangeTier = question.answers.filter(ans => element.scuCountInfo[0].value >= ans.min && element.scuCountInfo[0].value <= ans.max);
          if (recommendedScuRangeTier && recommendedScuRangeTier[0]){
            recommendedScuRangeIndex = parseInt(recommendedScuRangeTier[0].value.match(/(\d+)/)[0]);
          }
          let scuQuestion: IQuestion = { 'id': this.constantService.SCU_COUNT };
          scuQuestion.answers = [{ 'id': element.scuCountInfo[0].id, "selected": true, 'value': element.scuCountInfo[0].value }];
          this.questionnaireService.selectedAnswerMap.set(scuQuestion.id, scuQuestion);
          this.questionnaireService.selectedScuCount = element.scuCountInfo[0].value
        }
      })

      // check if recommended scr range is different from selected tier range
      if(recommendedScuRangeIndex && (recommendedScuRangeIndex !== this.selectedTierIndex)){
        this.selectedTierIndex = recommendedScuRangeIndex;
      }
      this.recomendedIndex =  this.selectedTierIndex
      this.inEligibleTierIndex = this.selectedTierIndex - 2;
     
    }
    this.checkToShowExceptionForTier(question.answers, answer);
  }

  selectSellingModel(type, ques) {
    if(this.disableAccess || this.disableCommitment) {
      return;
    } else {
      if(type === 'access') {
        this.selectedTierObj = ques.answers[0];
      } else {
        const index = ques.answers.findIndex(ans => ans.selected === true);
        if(index === 0) {
          const defaultIndex = ques.answers.findIndex(ans => ans.defaultSel === true);
          this.selectedTierObj = ques.answers[defaultIndex];
        } else {
          this.selectedTierObj = ques.answers[index];
        }
        this.selectedTierIndex = parseInt(this.selectedTierObj.value.match(/(\d+)/)[0]);
        // check for scucount present
        if(ques.scuCountInfo){
          ques.scuCountInfo[0].value = this.selectedTierObj.min;
          let scuQuestion: IQuestion = { 'id': this.constantService.SCU_COUNT };
          scuQuestion.answers = [{ 'id': ques.scuCountInfo[0].id, "selected": true, 'value': ques.scuCountInfo[0].value }];
          this.questionnaireService.selectedAnswerMap.set(scuQuestion.id, scuQuestion);
          this.questionnaireService.selectedScuCount = ques.scuCountInfo[0].value
          this.recomendedIndex =  this.selectedTierIndex
          this.inEligibleTierIndex = this.selectedTierIndex - 2;
        }
      }
      const answersArray = [{ 'id': this.selectedTierObj.id, "selected": true, 'value': this.selectedTierObj.value }];
        const selectedQuestion: IQuestion = { 'id': ques.id };
        selectedQuestion.answers = answersArray;
        this.questionnaireService.selectedAnswerMap.set(ques.id, selectedQuestion);
        this.questionnaireService.selectedScuCount = ques.scuCountInfo[0].value;
    }  
  }

  prepareTiersCount(answer, additionalInfo) {
    let arr = answer.filter(ans => ans.id !== 'tier_qna_tier0');
    const keys = Object.keys(additionalInfo.scuCountRange)
    for (const key of keys) {
      arr.forEach(element => {
        if (element.value === key) {
          element['min'] = additionalInfo.scuCountRange[key].min
          element['max'] = additionalInfo.scuCountRange[key].max
        }
      });
    }
    for (let i = 0; i < arr.length - 1; i++) {
      arr[i]['max'] = arr[i + 1].min - 1
    }
  }

  scuCountChange(question, value) {
    if (value < 100) {
      this.showScuError = true;
      this.inEligibleTierIndex = 0;
      this.recomendedIndex = 0;
      this.selectedTierIndex = 0;
      this.selectedTierObj = {};
      this.resetScuRange(question);
    } else {
      const oldRecomendedIndex = this.recomendedIndex
      this.showScuError = false;
      let selectedScu;
      this.firstLevelQuestions.forEach((element) => {
        if (element.id === 'tier') {
          selectedScu = element.answers.filter(ele => (ele.min <= value && ele.max >= value))
        }
      })
      if(selectedScu.length) {
        this.recomendedIndex = parseInt(selectedScu[0].value.match(/(\d+)/)[0]);
        this.inEligibleTierIndex = this.recomendedIndex - 2;
      }
      if(this.recomendedIndex !== oldRecomendedIndex){
         this.selectedTierObj = {};
         this.resetScuRange(question);
      } else {
        if ((this.questionnaireService.selectedAnswerMap.has(this.constantService.SCU_COUNT))) {
          let scuQuestion: IQuestion = { 'id': this.constantService.SCU_COUNT };
          scuQuestion.answers = [{ 'id': question.scuCountInfo[0].id, "selected": true, 'value': question.scuCountInfo[0].value }];
          this.questionnaireService.selectedAnswerMap.set(scuQuestion.id, scuQuestion);
          this.questionnaireService.selectedScuCount = question.scuCountInfo[0].value;
        }
      }
    }
  }

  resetScuRange(question){
    this.showExceptionForScu = false;
    if (this.questionnaireService.selectedAnswerMap.has(question.id)) {
      this.questionnaireService.selectedAnswerMap.delete(question.id);
      this.questionnaireService.mandatoryQuestCount++;
    }
  }

  checkToShowExceptionForTier(answers, answer){
    for(let i= 0; i < answers.length; i++){
      if(answer?.desc === answers[i].desc && (i === (this.recomendedIndex - 1))){
        this.showExceptionForScu = true;
        return;
      }
    }
  }

}