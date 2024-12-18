import { TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LocaleService } from "./locale.service";

describe("LocaleService", () => {
  let service: LocaleService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LocaleService],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(LocaleService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call ngOnInit", () => {
    service.ngOnInit()
  });

  it("should call getLocalizedString", () => {
    service.getLocalizedString('proposal.summary.EOS_BANNER_NEW')
  });

  it("should call getLocalizedString", () => {
    service.getLocalizedMessage('authentication.SUPERUSER_MESSAGE')
  });


  
});
