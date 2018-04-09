import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '@nebular/auth';

@Component({
  selector: 'app-request-password',
  styleUrls: ['./request-password.component.scss'],
  templateUrl: './request-password.component.html',
})
export class RequestPasswordComponent {

  redirectDelay: number = 0;
  showMessages: any = {};

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  validation = {};

  constructor(protected auth: AuthService,
              @Inject(NB_AUTH_OPTIONS) protected config = {},
              protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.requestPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.requestPassword.showMessages');

    this.validation = this.getConfigValue('forms.validation');
  }

  requestPass(){

    this.errors = this.messages = [];
    this.submitted = true;

    this.auth.requestPass(this.user.email).then(
      (res) => {
      this.submitted = false;
      this.messages = [res];

      this.redirectToDashboard()
    })
    .catch((err) => {
      this.submitted = false;
      this.errors = [err];
    });
  }

  redirectToDashboard(){
    setTimeout(() => {
      this.router.navigate(['/pages/dashboard']);
    }, this.redirectDelay);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}