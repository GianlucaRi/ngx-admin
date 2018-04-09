import { CanActivate, Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { AuthService } from './auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    return this.auth.user
            .take(1)
            .map(authState => !!authState)
            .do(authenticated => {
              if (!authenticated) {
                  this.router.navigate(['auth/login']);
              }
            });
  }

}