import { Component, ElementRef, Input, OnInit } from '@angular/core';


@Component({
    standalone: true,
    selector: 'pkmn-star',
    template: `
    <svg class="star-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  `,
})
export class StarIconComponent implements OnInit {

    @Input() color = '';

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        const allIcons = this.el.nativeElement.getElementsByClassName('star-icon');

        for (let i = 0; i < allIcons.length; i++) {
            const path = allIcons[i].querySelector('path');
            path.setAttribute('fill', this.color);
        }
    }
}
