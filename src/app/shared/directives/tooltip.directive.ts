import { Directive, ElementRef, Input, TemplateRef, EventEmitter, Renderer2, Injector, NgZone, ApplicationRef, ChangeDetectorRef, ViewContainerRef, ComponentFactoryResolver, Inject } from '@angular/core';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import {DOCUMENT} from '@angular/common';

@Directive({
    selector: '[isTooltip]',
    exportAs: "isTooltip"
})
export class TooltipDirective extends NgbTooltip {
    @Input() tooltipContent: TemplateRef<any>;
    @Input() ellipsis: boolean;
    public placement: "auto" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left-top" | "left-bottom" | "right-top" | "right-bottom" | ("auto" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left-top" | "left-bottom" | "right-top" | "right-bottom")[];
    public triggers: string;
    public container: string;
    public tooltip: TemplateRef<any>;
    public shown: EventEmitter<{}>;
    public  hidden: EventEmitter<{}>;
    public toggle(): void {
        super.toggle()
    }
    public isOpen(): boolean {
        return super.isOpen()
    }

  //  public ngbTooltip: TemplateRef<any>;
    canCloseTooltip: boolean;

    constructor(private _elRef: ElementRef, private _render: Renderer2, injector: Injector,
        componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef, config: NgbTooltipConfig,@Inject(DOCUMENT) _document: any, _changeDetector: ChangeDetectorRef, _applicationRef: ApplicationRef,
        ngZone: NgZone) {
        super(_elRef, _render, injector, viewContainerRef, config, ngZone, _document, _changeDetector, _applicationRef);
        this.triggers = "manual";
        this.container = "body";
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.ngbTooltip = this.tooltipContent;

        this._render.listen(this._elRef.nativeElement, "mouseenter", () => {
            this.canCloseTooltip = true;

          const x = this._elRef.nativeElement.offsetParent.offsetWidth;
          const  y = this._elRef.nativeElement.offsetParent.scrollWidth;
           if(this.ellipsis)
           {
            if(y>x) {
               this.open();
            }
           }else{
             this.open();
           }
        });

        this._render.listen(this._elRef.nativeElement, "mouseleave", (event: Event) => {
            setTimeout(() => { if (this.canCloseTooltip) this.close() }, 0)

        })

        this._render.listen(this._elRef.nativeElement, "click", () => {
            this.close();
        })
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
    }

    open() {
        super.open();
        let tooltip = window.document.querySelector(".tooltip")
        this._render.listen(tooltip, "mouseover", () => {
            this.canCloseTooltip = false;
        });

        this._render.listen(tooltip, "mouseout", () => {
            this.canCloseTooltip = true;
            setTimeout(() => { if (this.canCloseTooltip) this.close() }, 0)
        });
    }

    close() {
        super.close();
    }

}
