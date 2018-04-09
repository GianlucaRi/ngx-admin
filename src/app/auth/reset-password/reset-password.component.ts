import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '@nebular/auth';

@Component({
  selector: 'app-reset-password',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
})

export class ResetPasswordComponent {

  redirectDelay: number = 0;
  showMessages: any = {};

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  validation = {};

  code: string;

  constructor(protected auth: AuthService, @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router, private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params['oobCode'];
      console.log(this.code); // Print the parameter to the console. 
    });

    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');

    this.validation = this.getConfigValue('forms.validation');
  }

  resetPass(): void {

    this.errors = this.messages = [];
    this.submitted = true;

    this.auth.confirmPasswordReset(this.code, this.user.password)
      .then((res) => {
        this.submitted = false;
        this.messages = [res];

        this.redirectToDashboard()
      })
      .catch((err) => {
        this.submitted = false;
        this.errors = [err];
      });
  }

  redirectToDashboard() {
    setTimeout(() => {
      this.router.navigate(['/pages/dashboard']);
    }, this.redirectDelay);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}