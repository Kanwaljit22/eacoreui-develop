import { Directive, ElementRef, DoCheck, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appElementFocus]'
})
export class ElementFocusDirective implements DoCheck {

  constructor(public el: ElementRef, public renderer: Renderer2) { }

  ngDoCheck() {
    const element = this.el.nativeElement;
    const type = element.localName;
    const textArea = type === 'textarea';
    let hasVal;

    if (type === 'select') {
      hasVal = element.selectedIndex > -1;
    } else {
      hasVal = element.value.length > 0;
    }

    if (hasVal) {
      this.renderer.addClass
      this.renderer.addClass(element, 'active');
      this.renderer.addClass(element.parentElement, 'element-hasvalue');
    } else {
      this.renderer.removeClass(element, 'active');
      this.renderer.removeClass(element.parentElement, 'element-hasvalue');
    }
  }

  @HostListener('focus', ['$event']) onFocus(e) {
    this.renderer.addClass(this.el.nativeElement.parentElement, 'element-focus');
    return;
  }
  @HostListener('blur', ['$event']) onblur(e) {
    this.renderer.removeClass(this.el.nativeElement.parentElement, 'element-focus');
    return;
  }

}
