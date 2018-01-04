import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[crayfDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open') isOpen = false;
  @HostListener('click') onClick(target) {
    this.isOpen = !this.isOpen;
  }
}
