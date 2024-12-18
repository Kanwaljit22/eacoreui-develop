
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable, Inject, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, map } from 'rxjs/operators';



@Injectable()
export class HttpService implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(map(event => {
      return event;
    }),
      catchError(error => {
        return observableThrowError(error);
      }),
      finalize(() => {
      })
    );
  }
}
