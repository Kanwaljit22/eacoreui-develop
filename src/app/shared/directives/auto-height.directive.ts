import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[autoHeight]'
})
export class AutoHeightDirective {
  @HostListener('window:resize', [])
  @HostListener('window:scroll', [])
  onWindowScroll() {
    setTimeout(() => { this.setHeight() }, 50);
  }

  @Input('bottom') bottom: any = null;
  @Input('min') min: number = 0;
  @Input('autoHeight') autoHeight: string = null;

  constructor(private elementRef: ElementRef) {
    setTimeout(() => { this.setHeight() }, 20);
  }

  setHeight() {
    const ele: any = this.elementRef.nativeElement;
    if (ele != null) {
      const pos = ele.getBoundingClientRect();
      if (pos.width === 0 && pos.height === 0) {
        setTimeout(() => { this.setHeight() }, 20);
        return;
      }
      let no = (this.autoHeight != null && isNaN(parseInt(this.autoHeight, 10))) ? 20 : parseInt(this.autoHeight, 10);
      no = (window.innerHeight - (pos.top + no));
      if (this.min > 0 && no < this.min) {
        no = this.min;
      }
      ele.style.height = no + 'px';
    } 
  }

}
