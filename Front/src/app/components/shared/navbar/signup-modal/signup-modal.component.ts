import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css']
})
export class SignupModalComponent implements OnInit {

  userIdentifier;

  summonerId: string;
  profileIconId: number;


  signUpForm: FormGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', Validators.required),
    userPass: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  addSummonerForm: FormGroup = new FormGroup({
    summonerNameUser: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[\\d\\sa-zA-Z._]+$')])),
    regionUser: new FormControl('euw1')
  });

  constructor(
    public dialogRef: MatDialogRef<SignupModalComponent>,
    private _userService: UserService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
  }

  signUpUser(stepper) {
    this._userService.submitRegisterStepOne(this.signUpForm.value).subscribe(
      res => {
        stepper.next();
      },
      error => {
        this.snackBar.open(error['error']['message'], 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['my-snack-bar']
        });
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  searchSummoner(stepper) {
    this._userService.submitRegisterStepTwo(this.addSummonerForm.value).subscribe(
      res => {
        console.log(res);
        this.userIdentifier = res['body']['userIdentifier'];
        this.summonerId = res['body']['summonerId'];
        this.profileIconId = res['body']['userIconId'];
        stepper.next();
      },
      error => {
        this.snackBar.open(error['error']['message'], 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['my-snack-bar']
        });
      }
    );
  }

  validateSummoner(stepper) {
    let object = {
      userForm: this.signUpForm.value,
      summonerForm: this.addSummonerForm.value,
      summonerId: this.summonerId,
      profileIconId: this.profileIconId,
      userIdentifier: this.userIdentifier
    };
    this._userService.submitRegisterStepThree(object).subscribe(
      res => {
        this.dialogRef.close(true);
      },
      error => {
        this.snackBar.open(error['error']['message'], 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['my-snack-bar']
        });
      }
    );
  }

  getErrorMessageEmail() {
    return this.signUpForm.controls['userEmail'].hasError('required') ? 'You must enter a value' :
      this.signUpForm.controls['userEmail'].hasError('email') ? 'Not a valid email' :
        '';
  }

  getErrorMessageUsername(){
    return this.signUpForm.controls['userName'].hasError('required') ? 'You must enter a value' :
        '';
  }

  getErrorMessagePass(){
    return this.signUpForm.controls['userPass'].hasError('required') ? 'You must enter a value' :
      this.signUpForm.controls['userPass'].hasError('minlength') ? 'Minimum 6 characters' :
        '';
  }
}
