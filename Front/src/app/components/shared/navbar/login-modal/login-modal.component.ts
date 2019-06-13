import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  errorMessage: string = '';

  logInForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    userPass: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    private _authService: AuthService,
    private snackBar: MatSnackBar
  ) {
  }


  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  logInUser() {
    this._authService.login(this.logInForm.value).subscribe((res) => {
      if(res['status'] === 200){
        localStorage.setItem('token', res['body']['token']);
        this.dialogRef.close(true);
      }else{
        console.log(res);
      }
    },
      (err)=>{
        this.snackBar.open(err['error']['message'], 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['my-snack-bar']
        });
      });
  }

}
