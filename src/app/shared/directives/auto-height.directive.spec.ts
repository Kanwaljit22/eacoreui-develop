import { AutoHeightDirective } from './auto-height.directive';
import { ElementRef } from '@angular/core';

describe('AutoHeightDirective', () => {
  let directive: AutoHeightDirective;
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = {
      nativeElement: document.createElement('div')
    };
    directive = new AutoHeightDirective(elementRef);
  });

  test('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  test('should set height on window resize', () => {
    const setHeightSpy = jest.spyOn(directive, 'setHeight');
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => {
      expect(setHeightSpy).toHaveBeenCalled();
    }, 50);
  });

  test('should set height on window scroll', () => {
    const setHeightSpy = jest.spyOn(directive, 'setHeight');
    window.dispatchEvent(new Event('scroll'));
    setTimeout(() => {
      expect(setHeightSpy).toHaveBeenCalled();
    }, 50);
  });

  //test('should set height on initialization', () => {
   // const setHeightSpy = jest.spyOn(directive, 'setHeight');
   // directive.ngOnInit();
   // setTimeout(() => {
   //   expect(setHeightSpy).toHaveBeenCalled();
   // }, 20);
  //});

  test('should set height correctly', () => {
    const ele = elementRef.nativeElement;
    ele.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, width: 100, height: 100 });
    window.innerHeight = 800;
    directive.autoHeight = '50';
    directive.setHeight();
    expect(ele.style.height).toBe('650px');
  });

  test('should set minimum height if calculated height is less than min', () => {
    const ele = elementRef.nativeElement;
    ele.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, width: 100, height: 100 });
    window.innerHeight = 200;
    directive.autoHeight = '50';
    directive.min = 100;
    directive.setHeight();
    expect(ele.style.height).toBe('100px');
  });

  test('should retry setting height if element dimensions are zero', () => {
    const ele = elementRef.nativeElement;
    ele.getBoundingClientRect = jest.fn().mockReturnValue({ top: 100, width: 0, height: 0 });
    const setHeightSpy = jest.spyOn(directive, 'setHeight');
    directive.setHeight();
    setTimeout(() => {
      expect(setHeightSpy).toHaveBeenCalledTimes(2);
    }, 20);
  });
});
