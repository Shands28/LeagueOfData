import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>
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

  }

}
