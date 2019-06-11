import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

  participantIds: Array<number> = [];
  matchesInfo: Array<any>;
  championsPlayed: Array<any>;

  champions;
  summonerSpells;
  queues;


  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private _summonerService: SummonerService
  ) {
    this.loading = true;
    this.summonerName = activatedRoute.snapshot.params['name'];
    this.region = activatedRoute.snapshot.params['region'];
    this._summonerService.getSummonerInfo(this.summonerName, this.region).subscribe(result => {
        if (result['status'] === 200) {
          this.summonerName = result['body'].summonerName;
          this.summonerStats = result['body'];
          this.matchesInfo = result['body'].foundMatches;
          this.getParticipantId();
          this.championsPlayed = this.getChampionsPlayed();
          this.loading = false;
        }
      },
      error => {
        this.route.navigate(['/error']);
      });
    this._summonerService.getChampionsIcons().subscribe(res => {
      this.champions = res['data'];
    });
    this._summonerService.getSummonerSpells().subscribe(res => {
      this.summonerSpells = res['data'];
    });
    this._summonerService.getQueues().subscribe(res => {
      this.queues = res;
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

  getChampionsPlayed() {
    let array = [];
    for (let i = 0; i < this.matchesInfo.length; i++) {
      for (let participant of this.matchesInfo[i]['participants']) {
        if (participant['participantId'] == this.participantIds[i]) {
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
      if (a['winRate']['wins'] + a['winRate']['total'] > b['winRate']['wins'] + b['winRate']['total']) {
        return -1;
      }
      if (a['winRate']['wins'] + a['winRate']['total'] < b['winRate']['wins'] + b['winRate']['total']) {
        return 1;
      }
      return 0;
    });
  }

  calculateWinRate(championId) {
    let win = 0;
    let total = 0;
    for (let i = 0; i < this.matchesInfo.length; i++) {
      for (let participant of this.matchesInfo[i]['participants']) {
        if (this.matchesInfo[i]['participants'][this.participantIds[i] - 1]['stats']['win'] && this.matchesInfo[i]['participants'][this.participantIds[i] - 1]['championId'] == championId) {
          win++;
        }
        if (this.matchesInfo[i]['participants'][this.participantIds[i] - 1]['championId'] == championId) {
          total++;
        }
      }
    }
    return {wins: win, total: total};
  }

  getParticipantId() {
    for (let match of this.matchesInfo) {
      for (let participantIden of match['participantIdentities']) {
        if (participantIden['player']['summonerName'] == this.summonerName) {
          this.participantIds.push(participantIden['participantId']);
        }
      }
    }
  }

  getChampionName(idC) {
    for (let champion of Object.values(this.champions)) {
      if (champion['key'] == idC) {
        return champion['id'];
      }
    }
  }

  getSummonerSpellName(idSp) {
    for (let spell in this.summonerSpells) {
      if (this.summonerSpells.hasOwnProperty(spell)) {
        if (this.summonerSpells[spell]['key'] === idSp.toString()) {
          return this.summonerSpells[spell]['image']['full'];
        }
      }
    }
  }

  getQueueName(idQ) {
    for (let queue of this.queues) {
      if (queue['id'] === idQ) {
        return queue['name'];
      }
    }
  }
}