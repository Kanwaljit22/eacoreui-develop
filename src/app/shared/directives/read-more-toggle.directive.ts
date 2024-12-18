import { Directive, HostListener, HostBinding, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[ReadMoreToggle]'
})

export class ReadMoreToggleDirective {
  setClass = true;
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {

  }
  // @HostBinding('attr.class') setClass = 'redmore';

  // @HostListener('click', ['$event'])
  //   onClick(event: MouseEvent) {

  //     this.setClass=this.setClass=='redmore'?'less':'redmore';

  //     if(this.setClass ==='redmore'){
  //       this.renderer.setStyle(this.elementRef.nativeElement, 'height', '300px');
  //      // this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'white');
  //     }else{
  //       this.renderer.setStyle(this.elementRef.nativeElement, 'height', '300px');
  //       this.renderer.setStyle(this.elementRef.nativeElement, 'color', 'white');
  //     }
  // }



  // @HostBinding('attr.class') setClass = 'redmore';

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {

    this.setClass = !this.setClass;

    if (this.setClass === false) {
      //  this.renderer.setStyle(this.elementRef.nativeElement, 'height', '150px');
      //  this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'hidden');
      this.renderer.addClass(this.elementRef.nativeElement, 'extend');

    } else {
      //  this.renderer.setStyle(this.elementRef.nativeElement, 'height', 'auto');
      //  this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'hidden');
      this.renderer.removeClass(this.elementRef.nativeElement, 'extend');
    }
  }

}
