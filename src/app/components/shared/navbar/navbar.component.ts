import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
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

  constructor(
    private dialog: MatDialog,
    private _authService: AuthService
  ) {
  }

  ngOnInit() {
  }

  openSignInModal(){
    const dialogRef = this.dialog.open(SignupModalComponent, {
      width: '35%',
      minWidth: '360px',
      height: '60%',
      minHeight: '600px',
      autoFocus: false,
      disableClose: false,
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.logedIn = true;
      }
    });
  }

  openLogInModal(){
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '35%',
      minWidth: '360px',
      height: '35%',
      minHeight: '320px',
      autoFocus: false,
      disableClose: false,
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.logedIn = true;
      }
    });
  }

  logOut(){
    this._authService.logout();
    this.logedIn = this._authService.isLoggedIn;
    window.location.reload();
  }

}
