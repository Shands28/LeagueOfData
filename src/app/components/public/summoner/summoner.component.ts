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

  beginIndex: number = 0;
  endIndex: number = 10;

  participantId: number;
  matchesInfo: Array<any>;

  champions;

  constructor(
    private route: ActivatedRoute,
    private _summonerService: SummonerService
  ) {
    this.loading = true;
    this.summonerName = route.snapshot.params['name'];
    this.region = route.snapshot.params['region'];
    this._summonerService.getSummonerInfo(this.summonerName, this.region).subscribe(result => {
      // if( result['status'] == 200) {
      //   this.summonerStats = result['body'];
      // }
      this.summonerStats = result;
    });
    this._summonerService.getSummonerMatchesInfo(this.summonerName, this.region).subscribe(result => {
      this.getParticipantId(result);
      this.matchesInfo = result;
      this.loading = false;
    });
    this._summonerService.getChampionsIcons().subscribe(res => {
      this.champions = res['data'];
    });
  }

  ngOnInit() {
  }

  nextPageMatches() {
    this.beginIndex += 10;
    this.endIndex += 10;
  }

  lastPageMatches() {
    this.beginIndex -= 10;
    this.endIndex -= 10;
  }

  getChampionsPlayed(matches) {
    let array = [];
    for (let match of matches) {
      for (let participant of match['participants']) {
        if (participant['participantId'] == this.participantId) {
          if (array.findIndex((element) => {
            return element['championId'] === participant['championId'];
          }) == -1) {
            let object = {};
            object['name'] = this.getChampionName(participant['championId']);
            object['championId'] = participant['championId'];
            object['winRate'] = this.calculateWinRate(participant['championId']);
            array.push(object);
          }
        }
      }
    }
    return array.sort((a, b) => {
      if (a['winRate'] > b['winRate']) {
        return -1;
      }
      if (a['winRate'] < b['winRate']) {
        return 1;
      }
      return 0;
    });
  }

  calculateWinRate(championId) {
    let win = 0;
    let total = 0;
    for (let match of this.matchesInfo) {
      if (match['participants'][this.participantId - 1]['stats']['win'] && match['participants'][this.participantId - 1]['championId'] == championId) {
        win++;
      }
      if (match['participants'][this.participantId - 1]['championId'] == championId) {
        total++;
      }

    }
    return (win / total) * 100;
  }

  getParticipantId(matches) {
    for (let match of matches) {
      for (let participantIden of match['participantIdentities']) {
        if (participantIden['player']['summonerName'] == this.summonerName) {
          this.participantId = participantIden['participantId'];
        }
      }
    }
  }

  getChampionName(idC) {
    for (let champion of Object.values(this.champions)) {
      if (champion['key'] == idC) {
        return champion['name'];
      }
    }
  }

  checkWin(match) {
    return match['participants'][this.participantId - 1]['stats']['win'];
  }
}
