import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective {
  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  @HostListener('swipeleft') onSwipeLeft() {
    this.swipeLeft.emit();
  }

  @HostListener('swiperight') onSwipeRight() {
    this.swipeRight.emit();
  }
}
