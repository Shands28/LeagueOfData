import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css']
})
export class SignupModalComponent implements OnInit {

  signUpForm = new FormGroup({
    userEmail: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    userPass: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<SignupModalComponent>
  ) {
  }

  ngOnInit() {
  }

  signUpUser() {

  }

  closeDialog() {
    this.dialogRef.close();
  }

}
