import { Component, OnInit, AfterViewInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit, AfterViewInit  {
  socialAuth = false;
  error: any;
  dataLoading = false;
  brokenNetwork = false;

  constructor(private afAuth: AngularFireAuth, private _router: Router, private _backendService: BackendService) { }

  ngOnInit() {
    if (environment.socialAuthEnabled) {
      this.socialAuth = true;
    }
  }

  ngAfterViewInit() {
      this.getAuthStatus();
      if (this.afAuth.authState) {
        this._router.navigate(['/settings']);
      }
  }

  getAuthStatus() {
    this._backendService.redirectLogin().then(function(result) {
      if (result.credential) {
        window.localStorage.setItem('displayName', result.user.displayName);
        window.localStorage.setItem('email', result.user.email);
        window.localStorage.setItem('picture', result.user.photoURL);
      }
    }).catch(
      (err) => {
        this.error = err;
      });
  }

  login(loginType, formData?) {
      this._backendService.login(loginType, formData)
      .then(
        (success) => {
          if (formData) {
            window.localStorage.setItem('email', formData.email);
          }
          this._router.navigate(['/settings']);
        }).catch(
        (err) => {
          this.error = err;
        })
      ;
    }

    logout() {
      this._backendService.logout()
       .then(
         (success) => {
         this._router.navigate(['/login']);
       }).catch(function (error) {
           console.log(error);
         });
    }
  }
