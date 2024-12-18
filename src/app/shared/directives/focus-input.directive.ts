import {Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[appFocus]',
})
export class FocusDirective implements OnChanges {
    @Input() appFocus = false;
    @Input() focusDelay = 0;

    constructor(private elementRef: ElementRef) {}

    ngOnChanges() {
        this.checkFocus();
    }

    private checkFocus() {
        if (this.appFocus && document.activeElement !== this.elementRef.nativeElement) {
            let checkFocusTimeoutHandle: number;
            const focus = () => {
                this.elementRef.nativeElement.focus();
            };
            checkFocusTimeoutHandle = setTimeout(focus, this.focusDelay) as any;
        }
    }
}
