import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  redirectDelay: number = 0;

  errors: string[] = [];
  messages: string[] = [];
  user: any = { rememberMe: true };

  showMessages: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];

  validation = {};

  constructor(protected auth: AuthService, @Inject(NB_AUTH_OPTIONS) protected config = {}, protected router: Router) {
    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');

    this.validation = this.getConfigValue('forms.validation');
  }

  loginEmail() {
    this.errors = this.messages = [];
    this.submitted = true;

    this.auth.signInWithEmail(this.user.email, this.user.password)
      .then(() => {
        this.submitted = false;

        this.redirectToDashboard();
      })
      .catch((err) => {
        this.submitted = false;
        this.errors = [err];
      });
  }

  loginSocial(name) {
    if (name === 'google') {
      this.loginGoogle();
    } else if (name === 'facebook') {
      this.loginFb();
    } else {
      console.warn('No login for ' + name);
    }
  }

  loginGoogle() {
    this.auth.signInWithGoogle()
      .then(() => {
        this.redirectToDashboard();
      })
      .catch((err) => {
        this.errors = [err];
      });
  }

  loginFb() {
    this.auth.signInWithFacebook()
      .then((success) => {
        this.redirectToDashboard();
      })
      .catch((err) => {
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
