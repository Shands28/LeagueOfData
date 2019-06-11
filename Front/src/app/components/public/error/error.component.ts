import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  searchSummonerForm = new FormGroup({
    summonerName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[\\d\\sa-zA-Z._]+$')])),
    region: new FormControl('euw1')
  });

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  searchSummoner() {
    return this.router.navigate(['/summoner/' + this.searchSummonerForm.controls['region'].value + '/'
    + this.searchSummonerForm.controls['summonerName'].value]);
  }

}
