import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnaComponent } from './qna.component';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { VnextService } from 'vnext/vnext.service';
import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { of } from 'rxjs';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { EaRestService } from 'ea/ea-rest.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { IQuestion, PriceEstimateStoreService } from '../price-estimation/price-estimate-store.service';
import { ITooltip, QuestionnaireStoreService } from '../price-estimation/questionnaire/questionnaire-store.service';
import { QuestionnaireService } from '../price-estimation/questionnaire/questionnaire.service';
import { PriceEstimateService } from '../price-estimation/price-estimate.service';
import { EaStoreService } from 'ea/ea-store.service';

class MockQuestionnaireStoreService {

 tierTooltipMap = new Map<string,ITooltip>();
}

class MockQuesService {
  selectedEnrollment:IEnrollmentsInfo;
  nextLevelQuestionsMap = new Map<string,Array<IQuestion>>;
  selectedAnswerMap =  new Map<string,IQuestion>();
}

describe('QnaComponent', () => {
  let component: QnaComponent;
  let fixture: ComponentFixture<QnaComponent>;
  let questionStoreService = new MockQuestionnaireStoreService();
  let questionaireService = new MockQuesService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QnaComponent , LocalizationPipe],
      providers: [ PriceEstimateStoreService,  LocalizationService, DataIdConstantsService, VnextService, ProposalStoreService, {provide: QuestionnaireStoreService, useValue:questionStoreService} , {provide:QuestionnaireService, useValue: questionaireService}, ConstantsService, EaService, MessageService, VnextStoreService, ProjectStoreService, UtilitiesService,CurrencyPipe,EaRestService, PriceEstimateService, ProposalRestService, EaStoreService],
      imports: [HttpClientModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it ('call ngoninit', ()=> {
     component.questions = [
      {
          "id": "scu_count",
          "desc": "How many Security Content Users(SCU) does this customer have?",
          "displayType": "number",
          "mandatory": false,
          "answers": [
              {
                  "id": "scu_count_qna_value",
                  "value": '',
                  "desc": "How many Security Content Users(SCU) does this customer have?"
              }
          ],
          "parentQId": "tier",
      },
      {
          "id": "tier",
          "desc": "Select one of the Tiers",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "tier_qna_tier0",
                  "value": "TIER_0",
                  "desc": "Access Only"
              },
              {
                  "id": "tier_qna_tier1",
                  "value": "TIER_1",
                  "desc": "Tier 1",
                  "min": 100,
                  "max": 499
              },
              {
                  "id": "tier_qna_tier2",
                  "value": "TIER_2",
                  "desc": "Tier 2",
                  "min": 500,
                  "max": 999
              },
              {
                  "id": "tier_qna_tier3",
                  "value": "TIER_3",
                  "desc": "Tier 3",
                  "defaultSel": true,
                  "selected": true,
                  "min": 1000,
                  "max": 4999
              },
              {
                  "id": "tier_qna_tier4",
                  "value": "TIER_4",
                  "desc": "Tier 4",
                  "min": 5000,
                  "max": 9999
              },
              {
                  "id": "tier_qna_tier5",
                  "value": "TIER_5",
                  "desc": "Tier 5",
                  "min": 10000,
                  "max": 24999
              },
              {
                  "id": "tier_qna_tier6",
                  "value": "TIER_6",
                  "desc": "Tier 6",
                  "min": 25000,
                  "max": 999999999
              }
          ],
          "additionalInfo": {
              "scuCountRange": {
                  "TIER_1": {
                      "min": 100,
                      "max": 499
                  },
                  "TIER_2": {
                      "min": 500,
                      "max": 999
                  },
                  "TIER_3": {
                      "min": 1000,
                      "max": 4999
                  },
                  "TIER_4": {
                      "min": 5000,
                      "max": 9999
                  },
                  "TIER_5": {
                      "min": 10000,
                      "max": 24999
                  },
                  "TIER_6": {
                      "min": 25000,
                      "max": 999999999
                  }
              },
              "threshold": [
                  {
                      "name": "E3-SEC-DUO-MFA",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-ACS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-BYD",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-FEDMFA",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-FEDACS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EDUMFA",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EDUACS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EDUBYD",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-ESS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-ADV",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-PRE",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EES-F",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EES-FS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EES-HC",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EAD-F",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EAD-FS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EAD-HC",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EPR-F",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EPR-FS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EPR-HC",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-KENNA",
                      "desc": "Cisco Vulnerability Management",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-KENNA-PRE",
                      "desc": "Cisco Vulnerability Management",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-ISE",
                      "desc": "Identity Services Engine (ISE)",
                      "qtyUnit": "Sessions",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-WKLD",
                      "desc": "Secure Workload",
                      "qtyUnit": "Workloads",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 100,
                          "TIER_3": 100,
                          "TIER_4": 500,
                          "TIER_5": 1000,
                          "TIER_6": 2500
                      }
                  },
                  {
                      "name": "E3-SEC-UMBDNSE",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMBDNSA",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMBSIGE",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMBSIGA",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMB-EDU",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-WEB",
                      "desc": "Secure Web",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-SFW",
                      "desc": "Secure Firewall",
                      "qtyUnit": "commit value (USD)",
                      "tiersPriceThreshold": {
                          "TIER_1": 7500,
                          "TIER_2": 15000,
                          "TIER_3": 30000,
                          "TIER_4": 112500,
                          "TIER_5": 225000,
                          "TIER_6": 450000
                      }
                  },
                  {
                      "name": "E3-SEC-ES-ESS",
                      "desc": "Secure Email",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-ES-ADV",
                      "desc": "Secure Email",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ESS",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ADV",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-PRM",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ESS-EDU",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ADV-EDU",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-PRM-EDU",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-SIG-EDU",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-NWCLDA",
                      "desc": "Secure Network & Cloud Analytics",
                      "qtyUnit": "Flows",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  }
              ]
          },
          "scuCountInfo": [
              {
                  "id": "scu_count_qna_value",
                  "value": "",
                  "desc": "How many Security Content Users(SCU) does this customer have?"
              }
          ]
      },
      {
          "id": "edu_institute",
          "desc": "Is this an Educational Institution?",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "edu_institute_qna_y",
                  "value": "true",
                  "desc": "Yes",
                  "selected": true
              },
              {
                  "id": "edu_institute_qna_n",
                  "value": "false",
                  "desc": "No",
                  "defaultSel": true,
                  "selected": false
              }
          ],
          "questions": [
              {
                  "id": "edu_lvl",
                  "desc": "Select the education level",
                  "displayType": "radio",
                  "mandatory": true,
                  "answers": [
                      {
                          "id": "edu_lvl_qna_k12",
                          "value": "K-12",
                          "desc": "K-12"
                      },
                      {
                          "id": "edu_lvl_qna_high_edu",
                          "value": "Higher Education",
                          "desc": "Higher Education"
                      }
                  ],
                  "parentQId": "edu_institute",
                  "parentAId": "edu_institute_qna_y"
              },
              {
                  "id": "student_count",
                  "desc": "What is the total number of students?",
                  "displayType": "number",
                  "mandatory": true,
                  "answers": [
                      {
                          "id": "student_count_qna_value",
                          "value": "",
                          "desc": ""
                      }
                  ],
                  "parentQId": "edu_institute",
                  "parentAId": "edu_institute_qna_y"
              }
          ]
      },
      {
          "id": "edu_lvl",
          "desc": "Select the education level",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "edu_lvl_qna_k12",
                  "value": "K-12",
                  "desc": "K-12"
              },
              {
                  "id": "edu_lvl_qna_high_edu",
                  "value": "Higher Education",
                  "desc": "Higher Education"
              }
          ],
          "parentQId": "edu_institute",
          "parentAId": "edu_institute_qna_y"
      },
      {
          "id": "student_count",
          "desc": "What is the total number of students?",
          "displayType": "number",
          "mandatory": true,
          "answers": [
              {
                  "id": "student_count_qna_value",
                  "value": "",
                  "desc": ""
              }
          ],
          "parentQId": "edu_institute",
          "parentAId": "edu_institute_qna_y"
      }
    ]
    component.ngOnInit();
  });

  it('call checkForChildQuestion', () => {
    const que = {
      "id": "edu_institute",
      "desc": "Is this an Educational Institution?",
      "displayType": "radio",
      "mandatory": true,
      "answers": [
          {
              "id": "edu_institute_qna_y",
              "value": "true",
              "desc": "Yes",
              "selected": true
          },
          {
              "id": "edu_institute_qna_n",
              "value": "false",
              "desc": "No",
              "defaultSel": true,
              "selected": false
          }
      ],
      "questions": [
          {
              "id": "edu_lvl",
              "desc": "Select the education level",
              "displayType": "radio",
              "mandatory": true,
              "answers": [
                  {
                      "id": "edu_lvl_qna_k12",
                      "value": "K-12",
                      "desc": "K-12"
                  },
                  {
                      "id": "edu_lvl_qna_high_edu",
                      "value": "Higher Education",
                      "desc": "Higher Education"
                  }
              ],
              "parentQId": "edu_institute",
              "parentAId": "edu_institute_qna_y"
          },
          {
              "id": "student_count",
              "desc": "What is the total number of students?",
              "displayType": "number",
              "mandatory": true,
              "answers": [
                  {
                      "id": "student_count_qna_value",
                      "value": "",
                      "desc": ""
                  }
              ],
              "parentQId": "edu_institute",
              "parentAId": "edu_institute_qna_y"
          }
      ]
    }
    const ans = {
      "id": "edu_institute_qna_y",
      "value": "true",
      "desc": "Yes",
      "selected": true
    }
    component.checkForChildQuestion(que, ans);
  });

  it('call getChildQuestion', () => {
    const que = 
    {
        "id": "tier",
        "desc": "Select one of the Tiers",
        "displayType": "radio",
        "mandatory": true,
        "answers": [
            {
                "id": "tier_qna_tier0",
                "value": "TIER_0",
                "desc": "Access Only"
            },
            {
                "id": "tier_qna_tier1",
                "value": "TIER_1",
                "desc": "Tier 1",
                "min": 100,
                "max": 499
            },
            {
                "id": "tier_qna_tier2",
                "value": "TIER_2",
                "desc": "Tier 2",
                "min": 500,
                "max": 999
            },
            {
                "id": "tier_qna_tier3",
                "value": "TIER_3",
                "desc": "Tier 3",
                "defaultSel": true,
                "selected": true,
                "min": 1000,
                "max": 4999
            },
            {
                "id": "tier_qna_tier4",
                "value": "TIER_4",
                "desc": "Tier 4",
                "min": 5000,
                "max": 9999
            },
            {
                "id": "tier_qna_tier5",
                "value": "TIER_5",
                "desc": "Tier 5",
                "min": 10000,
                "max": 24999
            },
            {
                "id": "tier_qna_tier6",
                "value": "TIER_6",
                "desc": "Tier 6",
                "min": 25000,
            }
          ]
        }
    const ans =  {
      "id": "tier_qna_tier0",
      "value": "TIER_0",
      "desc": "Access Only"
    }
    component.questionnaireService.selectedAnswerMap.clear();
    component.getChildQuestion(que, ans);
  });
  

  it('call setQnaMapInitial', ()=> {
    const que = {
      "id": "edu_institute",
      "desc": "Is this an Educational Institution?",
      "displayType": "radio",
      "mandatory": true,
      "answers": [
          {
              "id": "edu_institute_qna_y",
              "value": "true",
              "desc": "Yes",
              "selected": true
          },
          {
              "id": "edu_institute_qna_n",
              "value": "false",
              "desc": "No",
              "defaultSel": true,
              "selected": false
          }
      ],
      "questions": [
          {
              "id": "edu_lvl",
              "desc": "Select the education level",
              "displayType": "radio",
              "mandatory": true,
              "answers": [
                  {
                      "id": "edu_lvl_qna_k12",
                      "value": "K-12",
                      "desc": "K-12"
                  },
                  {
                      "id": "edu_lvl_qna_high_edu",
                      "value": "Higher Education",
                      "desc": "Higher Education"
                  }
              ],
              "parentQId": "edu_institute",
              "parentAId": "edu_institute_qna_y"
          },
          {
              "id": "student_count",
              "desc": "What is the total number of students?",
              "displayType": "number",
              "mandatory": true,
              "answers": [
                  {
                      "id": "student_count_qna_value",
                      "value": "",
                      "desc": ""
                  }
              ],
              "parentQId": "edu_institute",
              "parentAId": "edu_institute_qna_y"
          }
      ]
    }
    const defaultSel = false;
    const indexToUpdate = 0;
    component.setQnaMapInitial(que, defaultSel, indexToUpdate)
  }) 

  it('call updateTextboxValue', ()=> { 
    const que = {
              "id": "student_count",
              "desc": "What is the total number of students?",
              "displayType": "number",
              "mandatory": true,
              "answers": [
                  {
                      "id": "student_count_qna_value",
                      "value": "12",
                      "desc": ""
                  }
              ],
              "parentQId": "edu_institute",
              "parentAId": "edu_institute_qna_y"
          }
     
      const val ='11' 
    
      component.updateTextboxValue(que, val);   

      let value = "13";
      let answersArray = [{ 'id': 'student_count', "selected": true, 'value': '12' }];
      let selectedQuestion: IQuestion = { 'id':'student_count' };
      selectedQuestion.answers = answersArray;
      component.questionnaireService.selectedAnswerMap.set('student_count', selectedQuestion)
      component.updateTextboxValue(que, value);   

      value = ''
      selectedQuestion.answers = answersArray;
      component.questionnaireService.selectedAnswerMap.set('student_count', selectedQuestion)
      component.updateTextboxValue(que, value);   
  });

  it ('call prepareTooltipForTiers', () => {
    let addInfo = {
      "scuCountRange": {
          "TIER_1": {
              "min": 100,
              "max": 499
          },
          "TIER_2": {
              "min": 500,
              "max": 999
          },
          "TIER_3": {
              "min": 1000,
              "max": 4999
          },
          "TIER_4": {
              "min": 5000,
              "max": 9999
          },
          "TIER_5": {
              "min": 10000,
              "max": 24999
          },
          "TIER_6": {
              "min": 25000,
              "max": 999999999
          }
      },
      "threshold": [
          {
              "name": "E3-SEC-DUO-MFA",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-ACS",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-BYD",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-FEDMFA",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-FEDACS",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EDUMFA",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EDUACS",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EDUBYD",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-ESS",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-ADV",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-PRE",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EES-F",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EES-FS",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EES-HC",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EAD-F",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EAD-FS",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EAD-HC",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EPR-F",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EPR-FS",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-DUO-EPR-HC",
              "desc": "Duo",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-KENNA",
              "desc": "Cisco Vulnerability Management",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-KENNA-PRE",
              "desc": "Cisco Vulnerability Management",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-ISE",
              "desc": "Identity Services Engine (ISE)",
              "qtyUnit": "Sessions",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-WKLD",
              "desc": "Secure Workload",
              "qtyUnit": "Workloads",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 100,
                  "TIER_3": 100,
                  "TIER_4": 500,
                  "TIER_5": 1000,
                  "TIER_6": 2500
              }
          },
          {
              "name": "E3-SEC-UMBDNSE",
              "desc": "Umbrella",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-UMBDNSA",
              "desc": "Umbrella",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-UMBSIGE",
              "desc": "Umbrella",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-UMBSIGA",
              "desc": "Umbrella",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-UMB-EDU",
              "desc": "Umbrella",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-WEB",
              "desc": "Secure Web",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-SFW",
              "desc": "Secure Firewall",
              "qtyUnit": "commit value (USD)",
              "tiersPriceThreshold": {
                  "TIER_1": 7500,
                  "TIER_2": 15000,
                  "TIER_3": 30000,
                  "TIER_4": 112500,
                  "TIER_5": 225000,
                  "TIER_6": 450000
              }
          },
          {
              "name": "E3-SEC-ES-ESS",
              "desc": "Secure Email",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-ES-ADV",
              "desc": "Secure Email",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-EP-ESS",
              "desc": "Secure Endpoint",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-EP-ADV",
              "desc": "Secure Endpoint",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-EP-PRM",
              "desc": "Secure Endpoint",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-EP-ESS-EDU",
              "desc": "Secure Endpoint",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-EP-ADV-EDU",
              "desc": "Secure Endpoint",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-EP-PRM-EDU",
              "desc": "Secure Endpoint",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-SIG-EDU",
              "desc": "Umbrella",
              "qtyUnit": "User",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          },
          {
              "name": "E3-SEC-NWCLDA",
              "desc": "Secure Network & Cloud Analytics",
              "qtyUnit": "Flows",
              "tiersQtyThreshold": {
                  "TIER_1": 100,
                  "TIER_2": 500,
                  "TIER_3": 1000,
                  "TIER_4": 5000,
                  "TIER_5": 10000,
                  "TIER_6": 25000
              }
          }
      ]
    }
    component.prepareTooltipForTiers(addInfo)
  })

  it ('call setSelectedTier', () => {
    component.firstLevelQuestions = [
      {
          "id": "scu_count",
          "desc": "How many Security Content Users(SCU) does this customer have?",
          "displayType": "number",
          "mandatory": false,
          "answers": [
              {
                  "id": "scu_count_qna_value",
                  "value": '',
                  "desc": "How many Security Content Users(SCU) does this customer have?"
              }
          ],
          "parentQId": "tier",
      },
      {
          "id": "tier",
          "desc": "Select one of the Tiers",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "tier_qna_tier0",
                  "value": "TIER_0",
                  "desc": "Access Only"
              },
              {
                  "id": "tier_qna_tier1",
                  "value": "TIER_1",
                  "desc": "Tier 1",
                  "min": 100,
                  "max": 499
              },
              {
                  "id": "tier_qna_tier2",
                  "value": "TIER_2",
                  "desc": "Tier 2",
                  "min": 500,
                  "max": 999
              },
              {
                  "id": "tier_qna_tier3",
                  "value": "TIER_3",
                  "desc": "Tier 3",
                  "defaultSel": true,
                  "selected": true,
                  "min": 1000,
                  "max": 4999
              },
              {
                  "id": "tier_qna_tier4",
                  "value": "TIER_4",
                  "desc": "Tier 4",
                  "min": 5000,
                  "max": 9999
              },
              {
                  "id": "tier_qna_tier5",
                  "value": "TIER_5",
                  "desc": "Tier 5",
                  "min": 10000,
                  "max": 24999
              },
              {
                  "id": "tier_qna_tier6",
                  "value": "TIER_6",
                  "desc": "Tier 6",
                  "min": 25000,
                  "max": 999999999
              }
          ],
          
          "scuCountInfo": [
              {
                  "id": "scu_count_qna_value",
                  "value": "",
                  "desc": "How many Security Content Users(SCU) does this customer have?"
              }
          ]
      }
    ]
    let que = {
      "id": "tier",
      "desc": "Select one of the Tiers",
      "displayType": "radio",
      "mandatory": true,
      "answers": [
          {
              "id": "tier_qna_tier0",
              "value": "TIER_0",
              "desc": "Access Only"
          },
          {
              "id": "tier_qna_tier1",
              "value": "TIER_1",
              "desc": "Tier 1",
              "min": 100,
              "max": 499
          },
          {
              "id": "tier_qna_tier2",
              "value": "TIER_2",
              "desc": "Tier 2",
              "min": 500,
              "max": 999
          },
          {
              "id": "tier_qna_tier3",
              "value": "TIER_3",
              "desc": "Tier 3",
              "defaultSel": true,
              "selected": true,
              "min": 1000,
              "max": 4999
          },
          {
              "id": "tier_qna_tier4",
              "value": "TIER_4",
              "desc": "Tier 4",
              "min": 5000,
              "max": 9999
          },
          {
              "id": "tier_qna_tier5",
              "value": "TIER_5",
              "desc": "Tier 5",
              "min": 10000,
              "max": 24999
          },
          {
              "id": "tier_qna_tier6",
              "value": "TIER_6",
              "desc": "Tier 6",
              "min": 25000,
              "max": 999999999
          }
      ],
      "scuCountInfo": [
          {
              "id": "scu_count_qna_value",
              "value": "",
              "desc": "How many Security Content Users(SCU) does this customer have?"
          }
      ]
    }

    let ans = {
      "id": "tier_qna_tier0",
      "value": "TIER_0",
      "desc": "Access Only"
    }
   component.setSelectedTier(que, ans)
  }) 

  it ('call selectSellingModel', ()=> {
  let type = 'test';
  let que = {
    "id": "tier",
    "desc": "Select one of the Tiers",
    "displayType": "radio",
    "mandatory": true,
    "answers": [
        {
            "id": "tier_qna_tier0",
            "value": "TIER_0",
            "desc": "Access Only"
        },
        {
            "id": "tier_qna_tier1",
            "value": "TIER_1",
            "desc": "Tier 1",
            "min": 100,
            "max": 499,
            "selected": true
        },
        {
            "id": "tier_qna_tier2",
            "value": "TIER_2",
            "desc": "Tier 2",
            "min": 500,
            "max": 999
        },
        {
            "id": "tier_qna_tier3",
            "value": "TIER_3",
            "desc": "Tier 3",
            "defaultSel": true,
            "selected": true,
            "min": 1000,
            "max": 4999
        },
        {
            "id": "tier_qna_tier4",
            "value": "TIER_4",
            "desc": "Tier 4",
            "min": 5000,
            "max": 9999
        },
        {
            "id": "tier_qna_tier5",
            "value": "TIER_5",
            "desc": "Tier 5",
            "min": 10000,
            "max": 24999
        },
        {
            "id": "tier_qna_tier6",
            "value": "TIER_6",
            "desc": "Tier 6",
            "min": 25000,
            "max": 999999999
        }
    ],
    "scuCountInfo": [
        {
            "id": "scu_count_qna_value",
            "value": "",
            "desc": "How many Security Content Users(SCU) does this customer have?"
        }
    ]
   }
   component.selectSellingModel(type, que);
  })

  it ('call prepareTiersCount', ()=> {
    let ans = [
      {
          "id": "tier_qna_tier0",
          "value": "TIER_0",
          "desc": "Access Only"
      },
      {
          "id": "tier_qna_tier1",
          "value": "TIER_1",
          "desc": "Tier 1",
          "min": 100,
          "max": 499,
          "selected": true
      },
      {
          "id": "tier_qna_tier2",
          "value": "TIER_2",
          "desc": "Tier 2",
          "min": 500,
          "max": 999
      },
      {
          "id": "tier_qna_tier3",
          "value": "TIER_3",
          "desc": "Tier 3",
          "defaultSel": true,
          "selected": true,
          "min": 1000,
          "max": 4999
      },
      {
          "id": "tier_qna_tier4",
          "value": "TIER_4",
          "desc": "Tier 4",
          "min": 5000,
          "max": 9999
      },
      {
          "id": "tier_qna_tier5",
          "value": "TIER_5",
          "desc": "Tier 5",
          "min": 10000,
          "max": 24999
      },
      {
          "id": "tier_qna_tier6",
          "value": "TIER_6",
          "desc": "Tier 6",
          "min": 25000,
          "max": 999999999
      }
    ]
    let addInfo = {
      "scuCountRange": {
          "TIER_1": {
              "min": 100,
              "max": 499
          },
          "TIER_2": {
              "min": 500,
              "max": 999
          },
          "TIER_3": {
              "min": 1000,
              "max": 4999
          },
          "TIER_4": {
              "min": 5000,
              "max": 9999
          },
          "TIER_5": {
              "min": 10000,
              "max": 24999
          },
          "TIER_6": {
              "min": 25000,
              "max": 999999999
          }
      }
    }
    component.prepareTiersCount(ans, addInfo);
  }) 

  it ('call scuCountChange', ()=> {
    let value = 1000;
    let que = {
      "id": "tier",
      "desc": "Select one of the Tiers",
      "displayType": "radio",
      "mandatory": true,
      "answers": [
          {
              "id": "tier_qna_tier0",
              "value": "TIER_0",
              "desc": "Access Only"
          },
          {
              "id": "tier_qna_tier1",
              "value": "TIER_1",
              "desc": "Tier 1",
              "min": 100,
              "max": 499,
              "selected": true
          },
          {
              "id": "tier_qna_tier2",
              "value": "TIER_2",
              "desc": "Tier 2",
              "min": 500,
              "max": 999
          },
          {
              "id": "tier_qna_tier3",
              "value": "TIER_3",
              "desc": "Tier 3",
              "defaultSel": true,
              "selected": true,
              "min": 1000,
              "max": 4999
          },
          {
              "id": "tier_qna_tier4",
              "value": "TIER_4",
              "desc": "Tier 4",
              "min": 5000,
              "max": 9999
          },
          {
              "id": "tier_qna_tier5",
              "value": "TIER_5",
              "desc": "Tier 5",
              "min": 10000,
              "max": 24999
          },
          {
              "id": "tier_qna_tier6",
              "value": "TIER_6",
              "desc": "Tier 6",
              "min": 25000,
              "max": 999999999
          }
      ],
      "scuCountInfo": [
          {
              "id": "scu_count_qna_value",
              "value": "",
              "desc": "How many Security Content Users(SCU) does this customer have?"
          }
      ]
     }
     component.firstLevelQuestions = [
      {
          "id": "scu_count",
          "desc": "How many Security Content Users(SCU) does this customer have?",
          "displayType": "number",
          "mandatory": false,
          "answers": [
              {
                  "id": "scu_count_qna_value",
                  "value": '',
                  "desc": "How many Security Content Users(SCU) does this customer have?"
              }
          ],
          "parentQId": "tier",
      },
      {
          "id": "tier",
          "desc": "Select one of the Tiers",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "tier_qna_tier0",
                  "value": "TIER_0",
                  "desc": "Access Only"
              },
              {
                  "id": "tier_qna_tier1",
                  "value": "TIER_1",
                  "desc": "Tier 1",
                  "min": 100,
                  "max": 499
              },
              {
                  "id": "tier_qna_tier2",
                  "value": "TIER_2",
                  "desc": "Tier 2",
                  "min": 500,
                  "max": 999
              },
              {
                  "id": "tier_qna_tier3",
                  "value": "TIER_3",
                  "desc": "Tier 3",
                  "defaultSel": true,
                  "selected": true,
                  "min": 1000,
                  "max": 4999
              },
              {
                  "id": "tier_qna_tier4",
                  "value": "TIER_4",
                  "desc": "Tier 4",
                  "min": 5000,
                  "max": 9999
              },
              {
                  "id": "tier_qna_tier5",
                  "value": "TIER_5",
                  "desc": "Tier 5",
                  "min": 10000,
                  "max": 24999
              },
              {
                  "id": "tier_qna_tier6",
                  "value": "TIER_6",
                  "desc": "Tier 6",
                  "min": 25000,
                  "max": 999999999
              }
          ],
          
          "scuCountInfo": [
              {
                  "id": "scu_count_qna_value",
                  "value": "",
                  "desc": "How many Security Content Users(SCU) does this customer have?"
              }
          ]
      }
    ]
    component.scuCountChange(que, value);

    value = 10;
    component.scuCountChange(que, value);
  }) 

  it ('call checkToShowExceptionForTier', ()=> { 
   let answers = [
    {
        "id": "tier_qna_tier0",
        "value": "TIER_0",
        "desc": "Access Only"
    },
    {
        "id": "tier_qna_tier1",
        "value": "TIER_1",
        "desc": "Tier 1",
        "min": 100,
        "max": 499,
        "selected": true
    },
    {
        "id": "tier_qna_tier2",
        "value": "TIER_2",
        "desc": "Tier 2",
        "min": 500,
        "max": 999
    },
    {
        "id": "tier_qna_tier3",
        "value": "TIER_3",
        "desc": "Tier 3",
        "defaultSel": true,
        "selected": true,
        "min": 1000,
        "max": 4999
    },
    {
        "id": "tier_qna_tier4",
        "value": "TIER_4",
        "desc": "Tier 4",
        "min": 5000,
        "max": 9999
    },
    {
        "id": "tier_qna_tier5",
        "value": "TIER_5",
        "desc": "Tier 5",
        "min": 10000,
        "max": 24999
    },
    {
        "id": "tier_qna_tier6",
        "value": "TIER_6",
        "desc": "Tier 6",
        "min": 25000,
        "max": 999999999
    }
  ]
  let ans = {
    "id": "tier_qna_tier1",
    "value": "TIER_1",
    "desc": "Tier 1",
    "min": 100,
    "max": 499,
    "selected": true
  
  }
  component.recomendedIndex = 2
  component.checkToShowExceptionForTier(answers, ans)
  });

  it ('call checkUpdatedValue', ()=> { 
    let evt: any = {
      keyCode: 55,
      shiftKey: false,

    }
    let que = {
      id :'user_count',
      min : 100
    }
    let value = 80
    component.checkUpdatedValue(evt, que, value);

    value = 120;
    component.checkUpdatedValue(evt, que, value);
  })
});
