import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SummonerService} from '../../../services/summoner.service';
import {Summoner} from '../../../interfaces/summoner';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.css']
})
export class SummonerComponent implements OnInit {

  loading: boolean;
  summonerName: string;
  region: string;
  summonerStats: Summoner;

  constructor(
    private route: ActivatedRoute,
    private _summonerService: SummonerService
  ) {
    this.loading = true;
    this.summonerName = route.snapshot.params['name'];
    this.region = route.snapshot.params['region'];
    this._summonerService.getSummonerInfo(this.summonerName, this.region).subscribe( result => {
      // if( result['status'] == 200) {
      //   this.summonerStats = result['body'];
      // }
      this.summonerStats = result;
      this.loading = false;
    });
  }

  ngOnInit() {
  }

}
