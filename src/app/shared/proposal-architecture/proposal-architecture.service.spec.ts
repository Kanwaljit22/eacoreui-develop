import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { MessageService } from "@app/shared/services/message.service";
import { of } from "rxjs";
import { ProposalArchitectureService } from "./proposal-architecture.service";
import { PermissionService } from "@app/permission.service";

describe("ProposalArchitectureService", () => {
  let service: ProposalArchitectureService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";

  class MockAppDataService {
    subHeaderData = { favFlag: false, moduleName: "test", subHeaderVal: "" };
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    archName = "test";
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
    };
  }

  class MockProposalDataService {
    proposalDataObject = {
      proposalData: {
        desc: "",
        name: "",
        eaTermInMonths: "",
        billingModel: "",
        priceList: "",
        eaStartDateStr: "",
        eaStartDateFormed: "",
        status: "",
      },
      proposalId: "123",
    };
  }
  class MockConstantsService {
    SECURITY = "test";
  }

  class MockPermissionService {
    isProposalPermissionPage = jest.fn();
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ProposalArchitectureService,
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: PermissionService, useClass: MockPermissionService },
        HttpClient,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(ProposalArchitectureService);
    httpTestingController = TestBed.inject(HttpTestingController);
    service.architectureListObject = {
      isParentQuestion: false,
      answers: [
        {
          defaultSelected: true,
          parentId: "test",
          name: "SEC",
          selected: "",
          questionnaire: {},
        },
      ],
    };
  }));

  it("should call getArchitectureData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = "assets/data/proposal/proposalArchitecture.json";
    service.getArchitectureData().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getArchitectureDataNew", (done) => {
    const response = {
      status: "Success",
    };

    const uri = "assets/data/proposal/proposalArchitectureNew.json";
    service.getArchitectureDataNew().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getProposalArchitectures", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + "api/proposal/architectures";
    service.getProposalArchitectures().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getArchQuestionsforParentIds", (done) => {
    const response = {
      status: "Success",
    };

    const uri =
      url +
      "api/proposal/qna?q=" +
      "123" +
      "&arch=" +
      "123" +
      "&subRefId=" +
      "123";
    service
      .getArchQuestionsforParentIds({}, "123", "123", "123")
      .subscribe((response: any) => {
        expect(response.status).toBe("Success");
        done();
      });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);
  });

  it("should call getQuestionnaireForProposalId", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + "api/proposal/" + "123" + "/qna";
    service.getQuestionnaireForProposalId("123").subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call setFinalQuestionnaireRequest", () => {
    const questionarie = [
      {
        questionnaire: null,
        answers: [
          {
            selected: true,
            name: "test",
            questionnaire: {
              selected: true,
              name: "test",
              questionnaire: null,
            },
          },
        ],
      },
    ];
    service.architectureListObject.answers = [
      {
        defaultSelected: true,
        parentId: "test",
        name: "SEC",
        selected: true,
        questionnaire: questionarie,
      },
    ];
    service.setFinalQuestionnaireRequest();
  });

  it("should call getFinalSelectionOfEditQuestionnaire", () => {
    const questionarie = [
      {
        key: "test",
        answers: [
          {
            selected: true,
            name: "test",
            questionnaire: {
              selected: true,
              name: "test",
              questionnaire: null,
            },
          },
        ],
      },
    ];
    service._finalQuestionnaireRequest = {};
    service.getFinalSelectionOfEditQuestionnaire(questionarie);
  });

  it("should call getFinalSelectionOfEditQuestionnaire", () => {
    service.architectureListObject.answers = [
      {
        defaultSelected: true,
        parentId: "test",
        name: "SEC",
        selected: true,
        questionnaire: null,
      },
    ];
    service.checkIsAllMandatoryQuestionnaireAreAnsweredForCreate();
  });

  it("should call getFinalSelectionOfEditQuestionnaire", () => {
    service.architectureListObject.answers = [
      {
        defaultSelected: true,
        parentId: "test",
        name: "SEC",
        selected: true,
        questionnaire: null,
      },
    ];
    service.checkIsAllMandatoryQuestionnaireAreAnsweredForCreate();
  });

  it("should call checkIsAllMandatoryQuestionnaireAreAnswered", () => {
    const questionarie = [
      {
        key: "test",
        answers: [
          {
            selected: true,
            name: "test",
            questionnaire: {
              selected: true,
              name: "test",
              questionnaire: null,
            },
          },
        ],
      },
    ];
    service.checkIsAllMandatoryQuestionnaireAreAnswered(questionarie);
  });

  it("should call makeFinalObjectForEditQuestionnaire", () => {
    const questionarie = {
      data: [
        {
          key: "archName",
          answers: [
            {
              parentId: [1, 2],
              selected: true,
              name: "test",
              questionnaire: {
                selected: true,
                name: "test",
                questionnaire: null,
              },
            },
          ],
        },
      ],
    };
    service.makeFinalObjectForEditQuestionnaire(questionarie);
  });

  it("should call clearChildques", () => {
    const questionarie = {
      key: "archName",
      type: "checkbox",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: { selected: true, name: "test", questionnaire: null },
        },
      ],
    };

    service.clearChildques(questionarie);
  });

  it("should call clearChildques", () => {
    const questionarie = {
      key: "archName",
      type: "",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: { selected: true, name: "test", questionnaire: null },
        },
      ],
    };

    service.clearChildques(questionarie);
  });


  
  it("should call getFinalQuestionsToEdit", () => {

    service.tempEditQuestionsList = [
      {
        id:'test',
        type:'checkbox',
        answers: [
          {
            parentId: [1, 2],
            selected: true,
            name: "test",
            questionnaire: { selected: true, name: "test", questionnaire: null },
          },
        ]
      }
    ]
    service.getFinalQuestionsToEdit('test', []);
  });

  it("should call isToEnableUpdateButton", () => {
    const questionarie = {
      key: "archName",
      type: "checkbox",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: { selected: true, name: "test", questionnaire: null },
        },
      ],
    };
    service['oldAnsweredValues'].set("archName","archName")
    service['permissionService'].proposalEdit = true;
    service['appDataService'].roadMapPath=false;
    service.isToEnableUpdateButton({name:'', selected:'',description:'test' }, questionarie);
  });



  it("should call isToEnableUpdateButton", () => {
    const questionarie = {
      key: "archName",
      type: "checkbox",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: { selected: true, name: "test", questionnaire: null },
        },
      ],
    };

    service['permissionService'].proposalEdit = true;
    service['appDataService'].roadMapPath=false;
    service.isToEnableUpdateButton({name:'', selected:'',description:'archName' }, questionarie);
  });


  

  it("should call isToEnableUpdateButton b2", () => {
    const questionarie = {
      key: "archName",
      type: "checkbox",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: { selected: true, name: "test", questionnaire: null },
        },
      ],
    };

    service.isToEnableUpdateButton({name:'', selected:'',description:'archName' }, questionarie);
  });

  it("should call isToEnableUpdateButton b3", () => {
    const questionarie = {
      key: "archName",
      type: "checkbox",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: { selected: true, name: "test", questionnaire: null },
        },
      ],
    };
    service['appDataService'].roadMapPath=true
    service.isToEnableUpdateButton({name:'', selected:'',description:'archName' }, questionarie);
  });


  it("should call isToEnableUpdateButton b3", () => {
    const questionarie = {
      key: "archName",
      type: "checkbox",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: { selected: true, name: "test", questionnaire: null },
        },
      ],
    };
    service['appDataService'].roadMapPath=true
    service.isToEnableUpdateButton({name:'', selected:'',description:'archName' }, questionarie);
  });



  it("should call handleUpdateButtonforNewQuestionsChild", () => {

 
    const questionarie = {
      key: "archName",
      type: "checkbox",
      answers: [
        {
          parentId: [1, 2],
          selected: true,
          name: "test",
          questionnaire: [{
            key: "archName",
            type: "checkbox",
            answers: [
              {
                parentId: [1, 2],
                selected: true,
                name: "test",
                questionnaire: null ,
              },
            ],
          }] ,
        },
      ],
    };

  const obj =   {
      questionnaire:[questionarie]
    }
    service.handleUpdateButtonforNewQuestionsChild(obj);
  });
});
