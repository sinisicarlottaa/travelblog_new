import { Directive, Input, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appAuthDirective]',
  standalone: true
})
export class AuthDirective {
  role = input<string | null>(null, { alias: 'appAuthDirective' });

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
   const expectedRole = this.role(); 
    const currentRole = this.auth.getRole();
    console.log('expectedRole:', expectedRole);
    console.log('currentRole:', currentRole);

    if (currentRole === expectedRole) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
