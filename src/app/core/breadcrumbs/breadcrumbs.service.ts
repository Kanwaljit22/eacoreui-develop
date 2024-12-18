
import {of as observableOf,  Observable ,  BehaviorSubject ,  Subscription } from 'rxjs';

import {concat, first, toArray, distinct, mergeMap, filter} from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';

import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterState } from '@angular/router';







    

import { IBreadcrumb, stringFormat, wrapIntoObservable } from './breadcrumbs.shared';
import { BreadcrumbsConfig } from './breadcrumbs.config';
import { BreadcrumbsResolver } from './breadcrumbs.resolver';

@Injectable()
export class BreadcrumbsService {

  private _breadcrumbs = new BehaviorSubject<IBreadcrumb[]>([]);
  private _defaultResolver = new BreadcrumbsResolver();
  private _showBreadCrumbs = false;
  showFullBreadcrumb = false;
  showOrHideSubject = new BehaviorSubject<boolean>(this.showBread());
  public breadCrumbStatus = new BehaviorSubject(false);
  currentBreadCrumbStatus = this.breadCrumbStatus.asObservable();
  constructor(private _router: Router, private _route: ActivatedRoute, private _config: BreadcrumbsConfig, private _injector: Injector) {

    this._router.events.pipe(
      filter((x) => x instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const route = _router.routerState.snapshot.root;

        // Observable.of(this._config.prefixCrumbs)
        this._resolveCrumbs(route).pipe(
          mergeMap((x) => x),
          distinct((x) => x.text),
          toArray(),
          mergeMap((x) => {
            if (this._config.postProcess) {
              const y = this._config.postProcess(x);
              return wrapIntoObservable<IBreadcrumb[]>(y).pipe(first());
            } else {
              return observableOf(x);
            }
          }),)
          .subscribe((x) => {
            this._breadcrumbs.next(x);
          });
      });
  }

  get crumbs$(): Observable<IBreadcrumb[]> {
    return this._breadcrumbs;
  }

  private showBread(): boolean {
    return this._showBreadCrumbs;
  }

  showOrHideBreadCrumbs(value: boolean = false) {
    this._showBreadCrumbs = value;
    this.showOrHideSubject.next(value);
  }

  isBreadCrumShown(): Observable<boolean> {
    return this.showOrHideSubject.asObservable();
  }

  private _resolveCrumbs(route: ActivatedRouteSnapshot)
    : Observable<IBreadcrumb[]> {

    let crumbs$: Observable<IBreadcrumb[]>;

    const data = route.routeConfig &&
      route.routeConfig.data;

    if (data && data.breadcrumbs) {

      let resolver: BreadcrumbsResolver;

      if (data.breadcrumbs.prototype instanceof BreadcrumbsResolver) {
        resolver = this._injector.get(data.breadcrumbs);
      } else {
        resolver = this._defaultResolver;
      }

      const result = resolver.resolve(route, this._router.routerState.snapshot);
      crumbs$ = wrapIntoObservable<IBreadcrumb[]>(result).pipe(first());

    } else {
      crumbs$ = observableOf([]);
    }

    if (route.firstChild) {
      crumbs$ = crumbs$.pipe(concat(this._resolveCrumbs(route.firstChild)));
    }

    return crumbs$;
  }
}
