import { TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ColorsService } from "./colors.service";

describe("ColorsService", () => {
  let service: ColorsService;
  const url = "https://localhost:4200/";

  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ColorsService
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(ColorsService);
  }));

  it("should call getColors", () => {
    service.getColors(Array(3).fill(0))
    service.getColors(Array(6).fill(0))
    service.getColors(Array(13).fill(0))
    service.getColors(Array(15).fill(0))
  });

});
