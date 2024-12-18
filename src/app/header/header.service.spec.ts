import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeaderService } from './header.service';
import { RestApiService } from '../shared/services/restAPI.service';
import { UtilitiesService } from '../shared/services/utilities.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { HttpClient } from '@angular/common/http';

describe('HeaderService', () => {
  let service: HeaderService;
  let httpMock: HttpTestingController;
  let utilitiesServiceMock: any;
  let restApiMock: any;
  let appDataServiceMock: any;

  beforeEach(() => {
    utilitiesServiceMock = { setTableHeight: jest.fn() };
    restApiMock = {};
    appDataServiceMock = { getAppDomain: 'http://example.com/' };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeaderService,
        { provide: RestApiService, useValue: restApiMock },
        { provide: UtilitiesService, useValue: utilitiesServiceMock },
        { provide: AppDataService, useValue: appDataServiceMock }
      ]
    });

    service = TestBed.inject(HeaderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('fullScreenView', () => {
    it('should set fullScreen to true', () => {
      service.fullScreenView();
      expect(service.fullScreen).toBe(true);
    });
  });

  describe('exitFullScreenView', () => {
    it('should set fullScreen to false', () => {
      service.fullScreen = true;
      service.exitFullScreenView();
      expect(service.fullScreen).toBe(false);
    });
  });

  describe('toggleFullScreenView', () => {
    it('should toggle fullScreen from false to true', () => {
      service.fullScreen = false;
      service.toggleFullScreenView();
      expect(service.fullScreen).toBe(true);
    });

    it('should toggle fullScreen from true to false', () => {
      service.fullScreen = true;
      service.toggleFullScreenView();
      expect(service.fullScreen).toBe(false);
    });
  });

  describe('getOauthToken', () => {
    it('should make a GET request to get the OAuth token', () => {
      const mockTokenResponse = { token: 'dummyToken' };
      const url = `${appDataServiceMock.getAppDomain}api/oauth/token`;

      service.getOauthToken().subscribe((response) => {
        expect(response).toEqual(mockTokenResponse);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockTokenResponse);
    });
  });

  describe('getExternalLink', () => {
    it('should make a GET request to get external link', () => {
      const mockLinkResponse = { link: 'http://external-link.com' };
      const url = `${appDataServiceMock.getAppDomain}api/external/link`;

      service.getExternalLink().subscribe((response) => {
        expect(response).toEqual(mockLinkResponse);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockLinkResponse);
    });
  });
});
