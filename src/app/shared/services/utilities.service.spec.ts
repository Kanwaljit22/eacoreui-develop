import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MessageService } from "./message.service";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { LocaleService } from "./locale.service";
import { ConstantsService } from "./constants.service";
import { UtilitiesService } from "./utilities.service";
import { CurrencyPipe } from "@angular/common";
import { AppDataService } from "./app.data.service";

describe("UtilitiesService", () => {
  let service: UtilitiesService;
  let appDataService: AppDataService;

  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }
  class MockLocaleService {
    getLocalizedString = jest.fn();
    getLocalizedMessage = jest.fn();
  }

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
    PROPOSAL = "proposal";
  }

  class MockAppDataService {
    PAGE_CONTEXT = {
      manageUserAdmin: "ManageUserAdmin",
      manageUserRoles: "ManageUserRoles",
      manageServiceRegistry: "ManageServiceRegistry",
    };
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
    };

    setMessageObject = jest.fn();
  }

  class MockMessageService {
    displayMessages = jest.fn();
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilitiesService,
        CurrencyPipe,
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: LocaleService, useClass: MockLocaleService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: MessageService, useClass: MockMessageService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(UtilitiesService);
    appDataService = TestBed.inject(AppDataService);

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call sendMessage", () => {
    service.sendMessage("test");
  });

  it("should call sendNav", () => {
    service.sendNav("test");
  });

  it("should call clearMessage", () => {
    service.clearMessage();
  });

  it("should call moveTo", () => {
    service.moveTo();
  });

  it("should call getMessage", () => {
    service.getMessage();
  });

  it("should call checkDecimalOrIntegerValue", () => {
    service.checkDecimalOrIntegerValue(10);
    service.checkDecimalOrIntegerValue(10.101);
  });

  it("should call formatValue", () => {
    service.formatValue(0);
  });

  it("should call pretifyAndFormatNumber", () => {
    const thousand = 1000 + 1;
    const million = 1000000 + 1;
    const billion = 1000000000 + 1;
    const trillion = 1000000000000 + 1;
    service.pretifyAndFormatNumber(0);
    service.pretifyAndFormatNumber(-1);
    service.pretifyAndFormatNumber(100);
    service.pretifyAndFormatNumber(thousand);
    service.pretifyAndFormatNumber(million);
    service.pretifyAndFormatNumber(billion);
    service.pretifyAndFormatNumber(trillion);
  });

  it("should call formatWithNoDecimal", () => {
    service.formatWithNoDecimal(100.11);
  });

  it("should call formatWithNoDecimalForDashboard", () => {
    service.formatWithNoDecimalForDashboard(100.11);
    service.formatWithNoDecimalForDashboard(0);
  });

  it("should call round", () => {
    service.round(-1);
    service.round("");
  });

  it("should call removeDecimal", () => {
    service.removeDecimal("100.10");
  });

  it("should call dollarvalue", () => {
    service.dollarvalue("100");
  });

  it("should call setTableHeight", () => {
    service.setTableHeight();
  });

  it("should call creditTableHeight", () => {
    jest
      .spyOn(document, "getElementById")
      .mockReturnValue({ style: { height: 10 }, offsetHeight: 10 } as any);
    service.creditTableHeight();
  });

  it("should call onCellMouseOver", () => {
    const div = document.createElement("div");
    div["offset"] = jest.fn().mockReturnValue(10);
    div["outerHeight"] = jest.fn().mockReturnValue(10);
    div["outerWidth"] = jest.fn().mockReturnValue(10);
    div["find"] = jest.fn().mockReturnValue({
      outerHeight: jest.fn().mockReturnValue(10),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    });
    window["$"] = jest.fn().mockReturnValue({
      closest: jest.fn().mockReturnValue(div),
      outerHeight: jest.fn().mockReturnValue(10),
    });
    window["$"]["outerHeight"] = jest.fn().mockReturnValue(10);

    service.onCellMouseOver({ event: { target: "test" } }, "4");
    service.onCellMouseOver({ event: { target: "test" } }, 4);
  });

  it("should call onCellMouseOver", () => {
    const div = document.createElement("div");
    div["offset"] = jest.fn().mockReturnValue(10);
    div["outerHeight"] = jest.fn().mockReturnValue(10);
    div["outerWidth"] = jest.fn().mockReturnValue(10);
    div["hasClass"] = jest.fn().mockReturnValue(true);
    div["find"] = jest.fn().mockReturnValue({
      outerHeight: jest.fn().mockReturnValue(10),
      addClass: jest.fn(),
      removeClass: jest.fn(),
      hasClass: jest.fn().mockReturnValue(true),
      length: 0,
    });
    window["$"] = jest.fn().mockReturnValue({
      closest: jest.fn().mockReturnValue(div),
      outerHeight: jest.fn().mockReturnValue(10),
      scrollTop: jest.fn().mockReturnValue(10),
      css: jest.fn(),
      addClass: jest.fn(),
      hasClass: jest.fn().mockReturnValue(true),
    });

    service.onCellMouseOverPrice(
      { colDef: { field: "test" }, event: { target: "test" } },
      "4"
    );
    // service.onCellMouseOverPrice({event:{colDef:{ field :'test'}, target:'test'}},4);
  });

  it("should call getSortedData", () => {
    const data = [{ children: [{ children: [{ children: [] }] }] }];
    service.getSortedData(data, "desc", "name");
  });

  it("should call sortArrayObject", () => {
    const data = [
      {
        test: "01/01/2023",
        name: "a",
        children: [{ children: [{ children: [] }] }],
      },
      {
        test: "02/01/2023",
        name: "a",
        children: [{ children: [{ children: [] }] }],
      },
    ];
    service.columnDataTypeMap.set("test", "Date");
    service.columnDataTypeMap.set("name", "Name");
    service["sortArrayObject"](data, "desc", "test", false);
    service["sortArrayObject"](data, "asc", "test", false);
    service["sortArrayObject"](data, "desc", "name", false);
    service["sortArrayObject"](data, "desc", "name", true);
    service["sortArrayObject"](data, "asc", "name", true);
  });

  it("should call getSortedData", () => {
    const data = [1, 2, 3, 4, 5];
    service.removeArrayElement(data, 1);
  });

  it("should call changeMessage", () => {
    service["changeMessage"](true);
  });

  it("should call wrapAxisText", () => {
    const selection = {
      each: function (cb) {
        cb();
      },
    };

    const d3 = {
      select: jest.fn().mockReturnValue({
        append: jest.fn().mockReturnValue({
          attr: jest.fn().mockReturnValue({
            attr: jest.fn().mockReturnValue({
              attr: jest.fn().mockReturnValue({
                text: jest.fn().mockReturnValue({
                  style: jest.fn().mockReturnValue({ style: jest.fn() }),
                }),
              }),
            }),
          }),
        }),
        attr: jest.fn().mockReturnValue("10"),
        text: jest.fn().mockReturnValue({
          replace: jest.fn().mockReturnValue("test"),
          attr: jest.fn().mockReturnValue("10"),
          append: jest.fn().mockReturnValue({
            attr: jest.fn().mockReturnValue({
              attr: jest.fn().mockReturnValue({
                attr: jest.fn().mockReturnValue({
                  text: jest.fn().mockReturnValue({
                    style: jest.fn().mockReturnValue({ style: jest.fn() }),
                  }),
                  node: jest.fn().mockReturnValue({
                    getComputedTextLength: jest.fn().mockReturnValue(80),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    };
    service.wrapAxisText(selection, d3);
  });

  it("should call getUniqueKeys", () => {
    service.getUniqueKeys([{ areas: [{ freq: { name: "test" } }] }]);
  });

  it("should call getFloatValue", () => {
    service.getFloatValue("Test");
  });

  it("should call formatAdditionalCostValue", () => {
    service.formatAdditionalCostValue("Test");
    service.formatAdditionalCostValue("");
  });

  it("should call showSuperUserMessage", () => {
    service.showSuperUserMessage("Test", "test", "proposal");
    service.showSuperUserMessage(false, "test", "proposal");
  });

  it("should call getValueFromCookie", () => {
    service.getValueFromCookie("tets");
  });

  it("should call isNumberKey", () => {
    service.isNumberKey({ which: 100 });
    service.isNumberKey({ which: 200 });
  });

  it("should call isNumberOnlyKey", () => {
    service.isNumberOnlyKey({ keyCode: 100, shiftKey: false });
    service.isNumberOnlyKey({ keyCode: 200, shiftKey: false });
  });

  it("should call allowNumberWithPlus", () => {
    service.allowNumberWithPlus({ keyCode: 100, shiftKey: false });
    service.allowNumberWithPlus({ keyCode: 200, shiftKey: false });
  });

  it("should call restrictSpecialChar", () => {
    event = { preventDefault: jest.fn() } as any;
    service.restrictSpecialChar({
      keyCode: 100,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
    service.restrictSpecialChar({
      keyCode: 200,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
  });

  it("should call allowAphaNumeric", () => {
    event = { preventDefault: jest.fn() } as any;

    appDataService.pageContext = "ManageUserAdmin";
    service.allowAphaNumeric({
      keyCode: 100,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
    service.allowAphaNumeric({
      keyCode: 200,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
  });

  it("should call allowAphaNumeric", () => {
    event = { preventDefault: jest.fn() } as any;
    appDataService.pageContext = "ManageUserRoles";
    service.allowAphaNumeric({
      keyCode: 100,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
    service.allowAphaNumeric({
      keyCode: 200,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
  });

  it("should call restrictBlankSpces", () => {
    event = { preventDefault: jest.fn() } as any;
    appDataService.pageContext = "ManageServiceRegistry";
    service.restrictBlankSpces({
      keyCode: 100,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
    service.restrictBlankSpces({
      keyCode: 200,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
  });

  it("should call restrictBlankSpces", () => {
    event = { preventDefault: jest.fn() } as any;
    appDataService.pageContext = "test";
    service.restrictBlankSpces({
      keyCode: 100,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
    service.restrictBlankSpces({
      keyCode: 200,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
  });

  it("should call numberOnlyKey", () => {
    event = { preventDefault: jest.fn() } as any;
    service.numberOnlyKey({
      keyCode: 100,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
    service.numberOnlyKey({
      keyCode: 200,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
  });

  it("should call allowAlpha", () => {
    event = { preventDefault: jest.fn() } as any;
    service.allowAlpha({
      keyCode: 100,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
    service.allowAlpha({
      keyCode: 200,
      shiftKey: false,
      preventDefault: jest.fn(),
    });
  });

  it("should call allowAlpha", () => {
    service.convertArrayToStringWithSpaces(["test"]);
  });

  it("should call saveFile", () => {
    URL.createObjectURL = jest.fn().mockReturnValue("www.test.com");
    URL.revokeObjectURL = jest.fn().mockReturnValue("www.test.com");
    const res = {
      body: {},
      headers: {
        get: jest.fn().mockReturnValue("test=test"),
      },
    };
    const d = {
      nativeElement: { href: "test", download: "", click: jest.fn() },
    };
    service.saveFile(res, d);
  });

  it("should call removeWhiteSpace", () => {
    service.removeWhiteSpace({ trim: jest.fn() });
  });

  it("should call isFollowonButtonDisplay", () => {
    service.isFollowonButtonDisplay();
    appDataService.displayRenewal = true;
    service.isFollowonButtonDisplay();
  });

  it("should call formattedDate", () => {
    service.formattedDate();
  });
});
