import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { DocumentCenterService } from "./document-center.service";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";



describe('DocumentCenterService', () => {
    let service: DocumentCenterService;
    let httpTestingController: HttpTestingController;
    let appDataService;
    const url = "https://localhost:4200/";



    class MockQualificationsService {
        qualification = { qualID: '123' };
        loaData={partnerBeGeoId:'123',customerGuId:'123' }
        viewQualSummary(data) { }
        loadUpdatedQualListEmitter = new EventEmitter();
        reloadSmartAccountEmitter = new EventEmitter();
        listQualification() { return of({}) }
    }

    class MockProposalDataService {
        proposalDataObject = { proposalId: '123' }
    }
   
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
            providers: [
                DocumentCenterService,
                { provide: AppDataService, useClass: MockAppDataService },
                { provide: QualificationsService, useClass: MockQualificationsService },
                { provide: ProposalDataService, useClass: MockProposalDataService },



            ],
            imports: [HttpClientTestingModule],

        })
            .compileComponents();
        service = TestBed.inject(DocumentCenterService);
        appDataService = TestBed.inject(AppDataService)
        httpTestingController = TestBed.inject(HttpTestingController);
    }));

    it('should call setLOAParam', () => {
        const mckloaData = jest.spyOn(service.loaData, 'push')
        service.setLOAParam({ documentId: '123', createdAtStr: 'abc', name: 'test' });
        expect(mckloaData).toBeCalled();
        expect(service.isLOAUploaded).toBeTruthy();
        expect(service.loaDocumentTraceID).toBe('123');
        expect(service.LoaSignatureValidDate).toBe('abc');
    });

    it('should call getDocumentCenterData', (done) => {
        const response = {
            status: 'success'
        }

        service.getDocumentCenterData().subscribe((res: any) => {
            done()
            expect(res.status).toBe('success')
        })
        const url1 = '../../../assets/data/DocumentCenter/documentCenter.json';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    })

    it('should call getProposalDocsData', (done) => {
        const response = {
            status: 'success'
        }

        service.getProposalDocsData().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/document/proposal-documents-data?p=' + '123';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    })

    it('should call getProgrammTermIncluded', (done) => {
        const response = {
            status: 'success'
        }

        service.getProgrammTermIncluded('condition').subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/' + '123' + '/force-attach-program-term/condition';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });


    it('should call getCheckProgrammTermStatus', (done) => {
        const response = {
            status: 'success'
        }

        service.getCheckProgrammTermStatus().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/' + '123' + '/check-program-term-status';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call getLOAData', (done) => {
        const response = {
            status: 'success'
        }

        service.getLOAData().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/document/proposal-loa-documents?p=123';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call getIBAssessmentURL', (done) => {
        const response = {
            status: 'success'
        }

        service.getIBAssessmentURL().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/123/service-ib-assessment-punchout';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call getCxLinkedProposalList', (done) => {
        const response = {
            status: 'success'
        }
        let proposalId = '123';
        let linkId = '123';
        service.getCxLinkedProposalList(proposalId, linkId).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/' + proposalId + "/link-proposals?linkId=" + linkId;
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call getTCOComparisonReport', (done) => {
        const response = {
            status: 'success'
        };

        service.getTCOComparisonReport({ data: 'test' }).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/report/tco-comparison';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call getCustomerIBReport', (done) => {
        const response = {
            status: 'success'
        };

        service.getCustomerIBReport({ data: 'test' }).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/report/ib-summary';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call getCustomerBookingPackage', (done) => {
        const response = {
            status: 'success'
        };

        service.getCustomerBookingPackage({ data: 'test' }).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/report/booking-report';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call getProposalIBReport', (done) => {
        const response = {
            status: 'success'
        };

        service.getProposalIBReport({ data: 'test' }).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/report/proposal-ib';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call getCustomerProposalReport', (done) => {
        const response = {
            status: 'success'
        };

        service.getCustomerProposalReport({ data: 'test' }).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/report/customer-proposal-package';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call getProgramTermsSignedOrNot', (done) => {
        const response = {
            status: 'success'
        }
        let proposalId = '123';

        service.getProgramTermsSignedOrNot().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/document/program-term-2?proposalId=' + proposalId;
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call downloadSignedCustomerPackage', (done) => {
        const response = {
            status: 'success'
        }
        let api = 'test';
        const fakeFile = (): File => {
            const blob = new Blob([''], { type: 'text/html' });
            return blob as File;
        };

        service.downloadSignedCustomerPackage(api).subscribe((res: any) => {
            done();
            expect(res.statusText).toBe('OK')
        })
        const url1 = url + api;
        httpTestingController
        const req = httpTestingController.expectOne(url1);
        req.flush(fakeFile());
        expect(req.request.method).toBe('GET')
    });

    it('should call downloadDoc', (done) => {
        const response = {
            status: 'success'
        }
        let api = 'test';
        const fakeFile = (): File => {
            const blob = new Blob([''], { type: 'text/html' });
            return blob as File;
        };

        service.downloadDoc(api).subscribe((res: any) => {
            done();
            expect(res.statusText).toBe('OK')
        })
        const url1 = url + api;
        httpTestingController
        const req = httpTestingController.expectOne(url1);
        req.flush(fakeFile());
        expect(req.request.method).toBe('GET')
    });

    it('should call initiateDocusign', (done) => {
        const response = {
            status: 'success'
        }
        let proposalId = '123';

        service.initiateDocusign().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/document/sign/customerPackage?p=' + proposalId + '&f=1&fcg=1';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call savePartnerDetail', (done) => {
        const response = {
            status: 'success'
        };

        const partnerDetail = [
            { data: 'test' },
            { data: 'test' },
            { data: 'test' },
            { data: 'test' },
            { data: 'test' },
            { data: 'test' },
            { data: 'test' },
            { data: 'test' },
        ]

        service.savePartnerDetail(partnerDetail).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/mspPartnerContact';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });


    it('should call resetPartnerDetail', (done) => {
        const response = {
            status: 'success'
        };

        service.resetPartnerDetail().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/mspPartnerContact';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call uploadAdditionalDoc', (done) => {
        const response = {
            status: 'success'
        };
        const file = 'test';
        const json = {
            isSigned: true,
            proposalId: '123',
            uploadType: 'UPLOAD',
            userName: 'Test',
            loaIncluded: '',
            uploadLegalPackage: '',
            manualLegalPackageSignedDateStr: ''
        };

        service.uploadAdditionalDoc(file, json).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/document/upload/additional';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call uploadLOADoc', (done) => {
        const response = {
            status: 'success'
        };
        const file = 'test';
        const json = {
            isSigned: true,
            proposalId: '123',
            uploadType: 'UPLOAD',
            userName: 'Test',
            loaIncluded: '',
            uploadLegalPackage: '',
            manualLegalPackageSignedDateStr: ''
        };

        service.uploadLOADoc(file, json).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/document/upload/loa';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });



    it('should call deleteDoc', (done) => {
        const response = {
            status: 'success'
        }
        let documentId = '123';
        let dt = 'DT';

        service.deleteDoc(documentId, dt).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })


        const url1 = url + 'api/document/additional/customerPackage?u=' + '123' + '&p=' + '123' + '&dt=' + dt + '&did=' + documentId;
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('DELETE');
    });

    it('should call deleteLOA', (done) => {
        const response = {
            status: 'success'
        }
        let documentId = '123';
        let dt = 'DT';

        service.deleteLOA(documentId).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })


        const url1 = url + 'api/document/partner/delete?proposalId=' + '123' + '&documentId=' + documentId;
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET');
    });

    it('should call updateFromWhoInvolvedModal', (done) => {
        const response = {
            status: 'success'
        };

        service.updateFromWhoInvolvedModal({}).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/document/custrep';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call loaCusotmerQuestion', (done) => {
        const response = {
            status: 'success'
        };

        service.loaCusotmerQuestion(false).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/123/special-loa-signing/DELINK';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call getClarificationsData', (done) => {
        const response = {
            status: 'success'
        };

        const mode = 'clarificationsTab';

        service.getClarificationsData(mode).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/123/loa/language-clarifications';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call getClarificationsData branch 1', (done) => {
        const response = {
            status: 'success'
        };

        const mode = 'modifications';

        service.getClarificationsData(mode).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/123/loa/non-std-modifications';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call saveClarification', (done) => {
        const response = {
            status: 'success'
        };

        const mode = 'modifications';

        service.saveClarification(mode, [1]).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/123/loa/non-std-modifications';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call saveClarification branch 1', (done) => {
        const response = {
            status: 'success'
        };

        const mode = 'clarificationsTab';

        service.saveClarification(mode, [1]).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/123/loa/language-clarifications';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call noDocumentChangeNeeded', (done) => {
        const response = {
            status: 'success'
        };


        service.noDocumentChangeNeeded().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/' + '123' + '/noDocumentChangeNeeded';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call alreadyObtainedLOA', (done) => {
        const response = {
            status: 'success'
        };


        service.alreadyObtainedLOA().subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
        const url1 = url + 'api/proposal/' + '123' + '/negotiationCompleted';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('GET')
    });

    it('should call addCustomerContact', (done) => {
        const response = {
            status: 'success'
        };


        service.addCustomerContact({}).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })

        const url1 = url + 'api/qualification/123/add-additional-customer-contact';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call deleteCustomerContactInfo', (done) => {
        const response = {
            status: 'success'
        };


        service.deleteCustomerContactInfo({}).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })

        const url1 = url + 'api/document/delete-custrep';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call deleteCustomerContact', (done) => {
        const response = {
            status: 'success'
        };


        service.deleteCustomerContact({}).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })

        const url1 = url + 'api/qualification/123/delete-additional-customer-contact';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('DELETE')
    });


    it('should call updateFromLOAWhoInvolvedModal', (done) => {
        const response = {
            status: 'success'
        };


        service.updateFromLOAWhoInvolvedModal({}).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
       
        const url1 = url +  'api/partner/loa-contact?' + 'partnerBeGeoId=123&customerGuId=123';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });

    it('should call updateCustomerContact', (done) => {
        const response = {
            status: 'success'
        };


        service.updateCustomerContact({}).subscribe((res: any) => {
            done();
            expect(res.status).toBe('success')
        })
       
        const url1 = url + 'api/qualification/123/update-additional-customer-contact';
        const req = httpTestingController.expectOne(url1);
        req.flush(response);
        expect(req.request.method).toBe('POST')
    });
});