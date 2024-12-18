import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
enum KEY_CODE {
  ENTER = 13,
  BACKSPACE = 8
}
@Directive({
  selector: '[appApptextArea]'
})
export class ApptextAreaDirective {

  constructor(private el: ElementRef, private ren: Renderer2) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      const offsetHeight = this.el.nativeElement.offsetHeight;
      if (offsetHeight < 44) {
        this.ren.setStyle(this.el.nativeElement, 'height', (offsetHeight * 2) + 'px');
      }
    }

    if (event.keyCode === KEY_CODE.BACKSPACE) {
      const value = this.el.nativeElement.value;
      const offsetHeight = this.el.nativeElement.offsetHeight;
      if (value.length < 4 && offsetHeight >= 44) {
        this.ren.setStyle(this.el.nativeElement, 'height', (offsetHeight / 2) + 'px');
      }
    }
  }

}
