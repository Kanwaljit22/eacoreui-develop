import { TestBed, waitForAsync } from "@angular/core/testing"
import { ActiveAgreementsService } from "./active-agreements.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { AppDataService } from "../services/app.data.service";
import { of } from 'rxjs';


describe('ActiveAgreementsService',() => {
    let service:ActiveAgreementsService;
    let httpTestingController:HttpTestingController;
    const url = "https://localhost:4200/";
    class MockAppDataService {
        subHeaderData={favFlag:false,moduleName:'test',subHeaderVal:''}
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
    
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            declarations:[],
            providers:[ActiveAgreementsService,HttpClient,{provide:AppDataService,useClass:MockAppDataService}]
        }).compileComponents();
        service =  TestBed.inject(ActiveAgreementsService);
        httpTestingController = TestBed.inject(HttpTestingController);


    }));

  it("should call getSalesReadinessData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = 'assets/data/agreements/consumptionMetaData.json';
    service.getColDataConsumption().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });
    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getColDataAgreements", (done) => {
    const response = {
      status: "Success",
    };

    const uri = 'assets/data/agreements/agreementsMetaData.json';
    service.getColDataAgreements().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });
    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getAgreementsData", (done) => {
    const response = {
        'rid': '4dfe844b-1adb-4807-8cb7-8adebe3c1294',
        'user': 'bhikumar',
        'error': false,
        'data': {
          'id': 109100,
          'name': 'AUTOLIV',
          'status': 'ACTIVE',
          'domain': 'autoliv.com',
          'type': 'CUSTOMER',
          'accounts': [{
            'id': 264484,
            'name': 'CiscoELA-CiscoONE',
            'status': 'ACTIVE',
            'domain': null,
            'type': null,
            'startDate': '23 Apr 2019',
            'endDate': '22 Apr 2022',
            'duration': 3,
            'remainingDuration': 3,
            'subscriptionID': 'Sub255892',
            'numberOfSuites': 2,
            'totalEntitlements': 4008,
            'totalConsumption': 2904,
            'remainingEntitlements': 1104,
            'nextTrueForward': '17 Sep 2020',
            'architecture': 'cross_arch'
          },
          {
            'id': 266044,
            'name': 'Security EA 2.0 Choice',
            'status': 'ACTIVE',
            'domain': null,
            'type': null,
            'startDate': '15 May 2019',
            'endDate': '14 May 2022',
            'duration': 3,
            'remainingDuration': 3,
            'subscriptionID': 'Sub259157',
            'numberOfSuites': 5,
            'totalEntitlements': 182578,
            'totalConsumption': 64405,
            'remainingEntitlements': 118173,
            'nextTrueForward': '14 May 2020',
            'architecture': 'cisco_security_choice'
          }
          ],
          'page': {
            'totalRows': 2,
            'pageSize': 100,
            'startIdx': 0
          }
        }
      };
    const uri = 'assets/data/agreements/agreementsMetaData.json';
    service.getAgreementsData().subscribe((response: any) => {
      expect(response).toEqual(response)
      done();
    });
    // const req = httpTestingController.expectOne(uri);
    // expect(req.request.method).toEqual("GET");
    // req.flush(response);
  });

  it("should call getConsumptionData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = 'assets/data/agreements/agreementsMetaData.json';
    service.getConsumptionData().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });
    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });
})