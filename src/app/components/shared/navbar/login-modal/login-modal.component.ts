import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    private _authService: AuthService
  ) { }

  logInForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    userPass: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  logInUser(){
    this._authService.login().subscribe(() => {
      if(this._authService.isLoggedIn) {
        this.dialogRef.close(true);
      }
    })
  }

}
