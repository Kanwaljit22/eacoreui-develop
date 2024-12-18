import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MessageService } from "./message.service";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { BlockUiService } from "./block.ui.service";
import { LocaleService } from "./locale.service";
import { ConstantsService } from "./constants.service";

describe("MessageService", () => {
  let service: MessageService;
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
    getLocalizedString() {}
  }

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        Router,
        { provide: BlockUiService, useClass: MockBlockUiService },
        { provide: LocaleService, useClass: MockLocaleService },
        { provide: ConstantsService, useClass: MockConstantsService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(MessageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call clear", () => {
    service.pessistErrorOnUi = false;
    service.clear();
  });

  it("should call modalMessageClear", () => {
    service.modalMessageClear();
  });

  it("should call displayMessagesFromResponse", () => {
    const response = {
      messages: [],
      error: true,
    };
    service.displayMessagesFromResponse(response, true);

    const response1 = {
      messages: ["test"],
      error: true,
    };
    service.displayMessagesFromResponse(response1, true);
  });

  it("should call displayMessages", () => {
    service.pessistErrorOnUi = false;
    service.disaplyModalMsg = false;
    service.messagesObj = {
      errors: [],
      success: [],
      warns: [],
      infos: [],
    } as any;
    service.displayMessages(["test"], false);
    service.displayMessages(
      [{ severity: "ERROR", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "SUCCESS ", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "WARNING", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "INFO", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "WARN", text: "test", code: 123 }],
      false
    );
  });

  it("should call displayMessages b1", () => {
    service.pessistErrorOnUi = false;
    service.disaplyModalMsg = true;
    service.messagesObj = {
      errors: [],
      success: [],
      warns: [],
      infos: [],
    } as any;
    service.messagesSet = new Set();
    service.displayMessages(
      [{ severity: "ERROR1", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "ERROR", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "SUCCESS ", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "WARNING", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "INFO", text: "test", code: 123 }],
      false
    );
    service.displayMessages(
      [{ severity: "WARN", text: "test", code: 123 }],
      false
    );
  });


  it("should call displayUiTechnicalError", () => {
    service.disaplyModalMsg=true;
    service.messagesObj = {
        errors: [],
        success: [],
        warns: [],
        infos: [],
      } as any;
    service.displayUiTechnicalError();
    service.disaplyModalMsg=false;

    service.displayUiTechnicalError();
  });


  it("should call displayConnectivityError", () => {
    service.displayConnectivityError();
  });

  it("should call displayCustomUIMessage", () => {
    service.disaplyModalMsg=true;
    service.displayCustomUIMessage('test', 'test');

    service.disaplyModalMsg=false;
    service.displayCustomUIMessage('test', 'test');
  });

  it("should call removeExistingMsg", () => {
    service.messagesObj={
        infos:[{text:'test'}]
    }as any;
    service.removeExistingMsg('test', 'infos');
  });



});
