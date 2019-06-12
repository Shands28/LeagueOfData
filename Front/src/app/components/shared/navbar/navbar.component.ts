import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SignupModalComponent} from './signup-modal/signup-modal.component';
import {LoginModalComponent} from './login-modal/login-modal.component';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  logedIn: boolean = false;
  userInfo;


  constructor(
    private dialog: MatDialog,
    private _authService: AuthService,
  ) {
    if (localStorage.getItem('token')) {
      this._authService.getUserName().subscribe(res => {
        if (res['status'] === 200) {
          if (Date.now() > res['body']['exp']) {
            this._authService.isLoggedIn = true;
            this.logedIn = true;
            this.userInfo = res['body'];
            console.log(this.userInfo);
          }
        }
      })
    }
  }

  ngOnInit() {
  }

  openSignUpModal() {
    const dialogRef = this.dialog.open(SignupModalComponent, {
      width: '35%',
      minWidth: '550px',
      height: '50%',
      minHeight: '550px',
      autoFocus: false,
      disableClose: false,
      data: {}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.openLogInModal();
      }
    });
  }

  openLogInModal() {
    const dialogRef2 = this.dialog.open(LoginModalComponent, {
      width: '35%',
      minWidth: '360px',
      height: '35%',
      minHeight: '320px',
      autoFocus: false,
      disableClose: false,
      data: {}
    });
    dialogRef2.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        window.location.reload();
      }
    });
  }

  logOut() {
    this._authService.logout();
    window.location.reload();
  }

}
