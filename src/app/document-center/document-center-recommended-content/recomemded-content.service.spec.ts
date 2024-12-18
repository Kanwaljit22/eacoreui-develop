import { TestBed, waitForAsync } from "@angular/core/testing"
import { RecommendedContentService } from "./recommended-content.service"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";


describe('RecommendedContentService', () => {
    let service:RecommendedContentService;
    let httpTestingController:HttpTestingController;
    const url = "https://localhost:4200/";

    class MockAppDataService {
        userId = '123';
        customerID = '123';
        customerName = 'test';
        isQualOrPropListFrom360Page = true;
        get getAppDomain() {
            return url;
        }
        userInfo = {
            userId: "123"
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers:[RecommendedContentService,
            {provide:AppDataService, useClass:MockAppDataService}],
            imports:[HttpClientTestingModule]
        }).compileComponents();
       service = TestBed.inject(RecommendedContentService);
       httpTestingController = TestBed.inject(HttpTestingController)

    }));

    it('should call getRecommendedContentData', (done) => {
        const response = {
            status:'success'
        }
        service.getRecommendedContentData('test').subscribe((res:any) => {;
            done();
            expect(res.status).toBe('success');
        });
        const localeUrl = url + 'api/sales-connect/recommended-content-fetch';
        const req = httpTestingController.expectOne(localeUrl);
        req.flush(response);
        expect(req.request.method).toBe('POST');
    })
})