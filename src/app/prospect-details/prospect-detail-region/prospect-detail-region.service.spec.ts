import { TestBed, waitForAsync } from "@angular/core/testing"
import { ProspectDetailRegionService } from "./prospect-detail-region.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProspectDetailsService } from "../prospect-details.service";



describe('ProspectDetailRegionService', () => {
    
let service:ProspectDetailRegionService;
    class MockAppDataService {
        customerID = "123";
        customerName = "test";
        isQualOrPropListFrom360Page = true;
        archName = "test";
        get getAppDomain() {
          return "";
        }
        userInfo = {
          userId: "123",
        };

        getDetailsMetaData(a){
            return {};
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
  
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                ProspectDetailRegionService,
            { provide: AppDataService, useClass:MockAppDataService },
            HttpClient,
              {provide:ProspectDetailsService, useValue:mockProspectDetailsService}
            ],
            imports: [HttpClientTestingModule],
      
          })
            .compileComponents();
            service = TestBed.inject(ProspectDetailRegionService);     
      })) 

      it('should call getRegionColumnsData', () => {
        const res = service.getRegionColumnsData();
        expect(res).toEqual({});
      })
})
