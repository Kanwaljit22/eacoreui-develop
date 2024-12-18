import { TestBed, waitForAsync } from "@angular/core/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ProspectDetailsService } from "../prospect-details.service";
import { ProspectDetailSubsidiaryService } from "./prospect-detail-subsidiary.service";
import { MessageService } from "@app/shared/services/message.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { LocaleService } from "@app/shared/services/locale.service";

describe("ProspectDetailSubsidiaryService", () => {
  let service: ProspectDetailSubsidiaryService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";
  class MockAppDataService {
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

    getDetailsMetaData(a) {
      return {};
    }

    assignColumnWidth(...a){
        return 100;
    }
  }

  const mockProspectDetailsService = {
    getTabData: (a) => {
      return of({
        data: [
          {
            column: "test",
            name: "test",
            data: [
              {
                column: "test",
                name: "test",
              },
            ],
          },
        ],
      });
    },
    reloadSuites: of({}),
    updateRowData: (a, b) => {},
  };

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }
  class MockLocaleService {
    getLocalizedString(value) {}
    getLocalizedMessage() {
      return "test";
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ProspectDetailSubsidiaryService,
        { provide: AppDataService, useClass: MockAppDataService },
        HttpClient,
        {
          provide: ProspectDetailsService,
          useValue: mockProspectDetailsService,
        },
        ProspectDetailsService,
        { provide: MessageService, useClass: MockMessageService },
        { provide: BlockUiService, useClass: MockBlockUiService },
        { provide: LocaleService, useClass: MockLocaleService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    service = TestBed.inject(ProspectDetailSubsidiaryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call getSubsidiaryColumnsData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = "assets/data/prospect-detail-subsidiaryColumns.json";
    service.getSubsidiaryColumnsData().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getSubsidiaryData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + "api/prospect/subsidiary";
    service.getSubsidiaryData({}).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);
  });

  it("should call loadSubsidiaryData", () => {
    jest.spyOn(JSON, "parse").mockReturnValue({ userId: "123" });
    sessionStorage.setItem("userInfo", JSON.stringify({ userId: "123" }));
    jest
      .spyOn(service, "getSubsidiaryData")
      .mockReturnValue(
        of({ error: false, data: [{ column: "test", value: 1 }] })
      );

    service.loadSubsidiaryData("123");
  });

  it("should call loadSubsidiaryData b1", () => {
    jest.spyOn(JSON, "parse").mockReturnValue({ userId: "123" });
    sessionStorage.setItem("userInfo", JSON.stringify({ userId: "123" }));
    jest
      .spyOn(service, "getSubsidiaryData")
      .mockReturnValue(of({ error: true, messages: [{ text: "test" }] }));

    service.loadSubsidiaryData("123");
  });

  it("should call prepareSubsidiaryMetaData", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "customerGuName",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "N",
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });

  it("should call prepareSubsidiaryMetaData b1", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "test",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "N",
        dataType :"Number",
        groupName:"test",
        columnGroupShow :'',
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      gridOptions:{headerHeight:100},
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });


  it("should call prepareSubsidiaryMetaData b2", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "test",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "Y",
        dataType :"Number",
        groupName:"test",
        columnGroupShow :'',
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      gridOptions:{headerHeight:100},
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });

  it("should call prepareSubsidiaryMetaData b3", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "eaQty",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "Y",
        dataType :"Number",
        groupName:"test",
        columnGroupShow :'',
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      gridOptions:{headerHeight:100},
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });

  it("should call prepareSubsidiaryMetaData b4", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "id",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "N",
        dataType :"",
        groupName:"test",
        columnGroupShow :'',
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      gridOptions:{headerHeight:100},
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });

  
  it("should call prepareSubsidiaryMetaData b5", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "address",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "N",
        dataType :"",
        groupName:"test",
        columnGroupShow :'',
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      gridOptions:{headerHeight:100},
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });

  it("should call prepareSubsidiaryMetaData b6", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "state",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "N",
        dataType :"",
        groupName:"test",
        columnGroupShow :'',
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      gridOptions:{headerHeight:100},
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });

  it("should call prepareSubsidiaryMetaData b7", () => {
    const param1 = [
      {
        columnSize: 1,
        name: "zip",
        displayName: "test",
        persistanceColumn: "test",
        hideColumn: "N",
        dataType :"",
        groupName:"test",
        columnGroupShow :'',
      },
    ];
    const param2 = {
      columnDefs: [],
      columnHeaderList: [],
      gridOptions:{headerHeight:100},
      currencyFormat: (...a) => {
        return "test";
      },
    };
    service.prepareSubsidiaryMetaData(param1, param2);
  });
});
