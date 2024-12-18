import { Directive, ViewContainerRef } from '@angular/core';
@Directive({
  selector: '[app-dynamic]'
})
export class DynamicDirective {
  constructor(
    public viewContainerRef: ViewContainerRef
  ) {
  }
}
