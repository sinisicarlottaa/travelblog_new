import { Directive, Input, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appAuthDirective]',
})
export class AuthDirective {
  role = input<string>();

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const expectedRole = this.role(); 
    const currentRole = this.auth.getRole();

    if (currentRole === expectedRole) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
