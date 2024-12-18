import { TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { BlockUiService } from "./block.ui.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("BlockUiService", () => {
  let service: BlockUiService;
  let httpTestingController: BlockUiService;
  const url = "https://localhost:4200/";

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [BlockUiService],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(BlockUiService);
    httpTestingController = TestBed.inject(BlockUiService);
  }));

  it("should call startChain", () => {
    service.spinnerConfig.startChain();
  });

  it("should call blockUI", () => {
    service.spinnerConfig.blockUI();
  });

  it("should call unBlockUI", () => {
    service.spinnerConfig.unBlockUI();
  });

  it("should call unBlockUI b1", fakeAsync(() => {
    service.spinnerConfig.isPageContainGrid =true;
    service.spinnerConfig.unBlockUI();
    tick(1000)
  }));

  it("should call pageContainGrid", () => {
    service.spinnerConfig.pageContainGrid();
  });

  it("should call stopChainAfterThisCall", () => {
    service.spinnerConfig.stopChainAfterThisCall();
  });
});
