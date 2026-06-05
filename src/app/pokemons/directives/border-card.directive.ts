import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: 'pkmnBorderCard',
  standalone: true
})
export class BorderCardDirective{
  private initialColor: string = '#e8e8ed';
  private defaultColor: string = '#e60012';

  private initialBgColor: string = '#ffffff';
  private defaultBgColor: string = '#fff0f1';

  private defaultHeight: number = 200;
  private _selected = false;

  @Input() set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this.applyHoverStyle();
    } else {
      this.applyInitialStyle();
    }
  }

  constructor( private el: ElementRef){
    this.setBorder(this.initialColor);
    this.setHeight(this.defaultHeight);
    this.setBackground(this.initialBgColor);
    this.el.nativeElement.style.transition = 'transform 0.2s ease-in-out';
  }

  private setBorder(color:string){
    let border = 'solid 4px '+ color;
    this.el.nativeElement.style.border = border;
  }

  private setHeight(heigh: number){
    this.el.nativeElement.style.height = heigh+'px';
  }

  private setBackground(background: string){
    this.el.nativeElement.style.background = background;
  }


  private applyHoverStyle() {
    this.setBorder(this.defaultColor);
    this.setBackground(this.defaultBgColor);
    this.el.nativeElement.style.transform = 'scale(1.1)';
  }

  private applyInitialStyle() {
    this.setBorder(this.initialColor);
    this.setBackground(this.initialBgColor);
    this.el.nativeElement.style.transform = 'scale(1)';
  }

  @HostListener('mouseenter') onMouseEnter(){
    this.applyHoverStyle();
  }

  @HostListener('mouseleave') onMouseLeave(){
    if (!this._selected) {
      this.applyInitialStyle();
    }
  }


}