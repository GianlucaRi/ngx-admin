import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '@nebular/auth';



@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  redirectDelay: number = 0;
  showMessages: any = {};

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  socialLinks: NbAuthSocialLink[] = [];
  validation = {};

  constructor(protected auth: AuthService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.socialLinks = this.getConfigValue('forms.register.socialLinks');

    this.validation = this.getConfigValue('forms.validation');
  }

  register(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.auth.register(this.user.email, this.user.password, this.user.fullName, this.user.company)
      .then(() => {
        this.submitted = false;
        this.messages = [];

        this.redirectToDashboard()
      })
      .catch((err) => {
        this.submitted = false;
        this.errors = [err];
      });
  }

  loginSocial(name) {
    if (name === "google") {
      this.loginGoogle();
    } else if (name === "facebook") {
      this.loginFb();
    } else{
      console.warn("No login for " + name);
    }
  }

  loginGoogle() {
    this.auth.signInWithGoogle()
      .then((success) => {
        this.redirectToDashboard()
      })
      .catch((err) => {
        this.errors = [err];
      });
  }

  loginFb() {
    this.auth.signInWithFacebook()
      .then((success) => {
        this.redirectToDashboard()
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