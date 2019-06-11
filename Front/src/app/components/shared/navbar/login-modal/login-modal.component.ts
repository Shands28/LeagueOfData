import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  isLoggedIn: boolean = false;

  logInForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    userPass: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    private _authService: AuthService
  ) {
  }


  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  logInUser() {
    this._authService.login(this.logInForm.value).subscribe((res) => {
      console.log(res);
      localStorage.setItem('token', res.toString());
    });
  }

}
