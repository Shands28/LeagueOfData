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
    userEmail: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    userName: new FormControl('', Validators.required),
    userPass: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
  });

  addSummonerForm = new FormGroup({
    summonerName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[\\d\\sa-zA-Z._]+$')])),
    region: new FormControl('euw1')
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

  searchSummoner(){

  }

}
