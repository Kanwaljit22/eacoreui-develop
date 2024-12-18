import { AppDataService } from '@app/shared/services/app.data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PermissionService } from '@app/permission.service';
import { map } from 'rxjs/operators';
import { ProposalDataService } from '@app/proposal/proposal.data.service';

@Injectable()
export class ProposalArchitectureService {

  public architectureListObject: any;
  questions: any;
  showError = false;
  _finalQuestionnaireRequest: any;
  isAllMandatoryAnswered = true;
  tempEditQuestionsList = Array<any>();
  createPageResetEmitter = new EventEmitter();
  public selectedArchObjectForEdit = {};

  private oldAnsweredValues = new Map<string, any>();
  private allChagedValues = Array<any>();
  isToEnableUpdateBtnForEditQuestionnaire = false;
  isToShowArchitectureEditError = false;
  isMspSelectionChanged = false; // flag to set if MSP selection changed



  constructor(private proposalDataService: ProposalDataService, private http: HttpClient, private appDataService: AppDataService, private permissionService: PermissionService) { }

  getArchitectureData() {
    return this.http.get('assets/data/proposal/proposalArchitecture.json');
  }
  

  getArchitectureDataNew() {
    return this.http.get('assets/data/proposal/proposalArchitectureNew.json');
  }

  getProposalArchitectures() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/architectures')
      .pipe(map(res => res));
  }

  getArchQuestionsforParentIds(parentIds, qualId, archName, subRefId) {
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/qna?q='+qualId+'&arch='+archName+'&subRefId='+subRefId, parentIds)
      .pipe(map(res => res));
  }
  
  getQuestionnaireForProposalId(_proposalId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + _proposalId + '/qna')
      .pipe(map(res => res));
  }

  setFinalQuestionnaireRequest() {
    for (let ans of this.architectureListObject.answers) {
      let _selectedList = [];

      if (ans.selected === true) {
        let _ansObject = {
          'name': ans.name,
          'selected': ans.name // this.getselectionfor(this.architectureListObject, ans)
        };
        this._finalQuestionnaireRequest = {};
        _selectedList.push(_ansObject);
        this._finalQuestionnaireRequest[this.architectureListObject.key] = _selectedList;
        this.getFinalSelection(ans.questionnaire);
      }
    }
  }

  getFinalSelectionOfEditQuestionnaire(_questions) {

    this.getFinalSelection(_questions);

    for (let archKey of Object.keys(this.selectedArchObjectForEdit)) {
      let archValue = this.selectedArchObjectForEdit[archKey];
      this._finalQuestionnaireRequest[archKey] = archValue;
    }
  }

  getFinalSelection(_finalQuestions) {

    for (let ques of _finalQuestions) {
      let _selectedList = [];
      for (let _ans of ques.answers) {
        if (_ans.selected === true) {
          let _object =
          {
            'name': _ans.name,
            'selected': this.getselectionfor(ques, _ans)
          };
          _selectedList.push(_object);
          if (_ans.questionnaire && _ans.questionnaire.length > 0) {
            this.getFinalSelection(_ans.questionnaire);
          }
        }
      }
      if (_selectedList.length > 0) {
        this._finalQuestionnaireRequest[ques.key] = _selectedList;
      }
    }
  }

  getselectionfor(_ques, _ans) {
    let str = '';
    if (_ques.type === 'radio') {
      str = (_ans.description === 'Yes' || _ans.description === 'Y') ? 'Y' : 'N';
    } else {
      str = _ans.description;
    }

    return str;

  }

  checkIsAllMandatoryQuestionnaireAreAnsweredForCreate() {
    let isArchSelected = false;
    for (let ans of this.architectureListObject.answers) {
      if (ans.selected === true) {
        isArchSelected = true;
      }
    }

    if (isArchSelected === true) { // Now checking for child
      return this.checkIsAllMandatoryQuestionnaireAreAnswered(this.questions);
    } else {
      // No architecture is selected
      return isArchSelected;
    }
  }

  checkIsAllMandatoryQuestionnaireAreAnswered(_qestions) {

    if (!_qestions || _qestions.length == 0) {
      return true;
    }
    // By Default this.isAllMandatoryAnswered is true

    outerLabeled: for (let _ques of _qestions) {
      let atleastOneSelected = true;
      if (_ques.mandatory === true) {
        atleastOneSelected = false;
      }
      for (let _ans of _ques.answers) {
        if (_ans.selected === true) {
          atleastOneSelected = true;
          if (_ans.questionnaire && _ans.questionnaire.length > 0) {
            this.isAllMandatoryAnswered = this.checkIsAllMandatoryQuestionnaireAreAnswered(_ans.questionnaire);
            if (this.isAllMandatoryAnswered === false) {
              break outerLabeled;
            }
          }
        }
      }
      if (atleastOneSelected === false) {
        this.isAllMandatoryAnswered = false;
        break;
      }
    }
    return this.isAllMandatoryAnswered;
  }

  makeFinalObjectForEditQuestionnaire(questionnaireObject) {
    this.questions = [];
    this.selectedArchObjectForEdit = {};
    this.oldAnsweredValues.clear();
    this.allChagedValues = [];
    this.tempEditQuestionsList = questionnaireObject['data']; // suiteDiscounts

    let _archObjectList = this.tempEditQuestionsList.filter(_item => _item.key === 'archName');

    let _archObject = _archObjectList[0];

    let _archChildParentIds: string[] = [];
    for (let ans of _archObject.answers) {
      if (ans.name === this.appDataService.archName || ans.name === this.proposalDataService.relatedSoftwareProposalArchName) {
        this.selectedArchObjectForEdit[_archObject['key']] = [
          {
            'name': ans.name,
            'selected': ans.name
          }
        ];
        _archChildParentIds = ans.parentId;
        break;
      }
    }

    this.questions = [];

    for (let _parentId of _archChildParentIds) {
      this.getFinalQuestionsToEdit(_parentId, this.questions);
    }
  }

  clearChildques(ques) {
    // to remove child ans we user is deselecting parent question;
    let key = '';
    let index = -1;
    // if type is check box we are adding name with the key;
    if (ques.type === 'checkbox') {
      for (let ans of ques.answers) {
        key = ques.key + ans.name;
        index = this.allChagedValues.indexOf(key);
        if (index > -1) {
          this.allChagedValues.splice(index, 1);
        }
        this.oldAnsweredValues.delete(key);
      }
    } else {
      key = ques.key;
      index = this.allChagedValues.indexOf(key);
      if (index > -1) {
        this.allChagedValues.splice(index, 1);
      }
      this.oldAnsweredValues.delete(key);
    }
  }

  getFinalQuestionsToEdit(_parentId, questionObject) {

    for (let ques of this.tempEditQuestionsList) {
      if (ques.id === _parentId) {
        questionObject.push(ques);
        for (let ans of ques.answers) {
          if (ans.selected) {
              ans.description = ans.selected;
            if (ques.type === 'checkbox') {
              this.oldAnsweredValues.set(ques.key + ans.name, 'Y');
            } else {
              this.oldAnsweredValues.set(ques.key, ans.description);
            }
            ans.selected = true;
            if (ans.parentId && ans.parentId.length > 0) {
              ans.questionnaire = [];
              for (let _parentId of ans.parentId) {
                this.getFinalQuestionsToEdit(_parentId, ans.questionnaire);
              }
            }
          }

        }
      }
    }

  }

  isToEnableUpdateButton(answeredValue, question) {

    // To handle disabling and enabling update button at edit proposal page for completed proposal or not have edit access
    if (!this.permissionService.proposalEdit) {
      this.isToEnableUpdateBtnForEditQuestionnaire = false;
      return this.isToEnableUpdateBtnForEditQuestionnaire;
    } else if (this.appDataService.roadMapPath) {
      this.isToEnableUpdateBtnForEditQuestionnaire = false;
      return this.isToEnableUpdateBtnForEditQuestionnaire;
    }

    let keyStr = question.key;
    if (question.type === 'checkbox') {
      keyStr = question.key + answeredValue.name;
    }

    let _ans = answeredValue.description;
    if (question.type === 'checkbox') {
      _ans = answeredValue.selected ? 'Y' : 'N';
    }

    if (this.oldAnsweredValues.has(keyStr)) { // For already answered questions

      if (!_ans) {
        _ans = '';
      }
      let _index = this.allChagedValues.indexOf(keyStr);

      if (this.oldAnsweredValues.get(keyStr) === _ans.toString()) {
        if (_index !== -1) {
          this.allChagedValues.splice(_index, 1);
        }
      } else {
        if (_index === -1) {
          this.allChagedValues.push(keyStr);
        }
      }
    } else { // For new questions(if a new question is answered)

      let _index = this.allChagedValues.indexOf(keyStr);
      if (_ans.toString().length === 0 && _index !== -1) {
        // To handle new text field
        // this condition show that user has cleared the update value in the field
        this.allChagedValues.splice(_index, 1);
      } else {
        if (_index === -1 && _ans.toString().length !== 0) {
          // user has update a new field
          this.allChagedValues.push(keyStr);
        } else {
          if (_ans.toString().length === 0) {
            // this will run when user updates a new field and then clears it.
            this.allChagedValues.splice(_index, 1);
          }
          this.handleUpdateButtonforNewQuestionsChild(answeredValue);
        }
      }
    }

    if (this.allChagedValues.length > 0 || this.isMspSelectionChanged) {
      this.isToEnableUpdateBtnForEditQuestionnaire = true;
    } else {
      this.isToEnableUpdateBtnForEditQuestionnaire = false;
    }

    return this.isToEnableUpdateBtnForEditQuestionnaire;
  }

  handleUpdateButtonforNewQuestionsChild(ans) {

    if (ans.questionnaire && ans.questionnaire.length > 0) {
      for (let childQuest of ans.questionnaire) {
        for (let answeredValue of childQuest.answers) {

          if (answeredValue.selected) {
            let keyStr = childQuest.key;
            if (childQuest.type === 'checkbox') {
              keyStr = childQuest.key + childQuest.name;
            }

            let _index = this.allChagedValues.indexOf(keyStr);
            if (_index !== -1) {
              this.allChagedValues.splice(_index, 1);
            }
            if (answeredValue.questionnaire && answeredValue.questionnaire.length > 0) {
              this.handleUpdateButtonforNewQuestionsChild(answeredValue);
            }
          }

        }
      }
    }

  }

}
