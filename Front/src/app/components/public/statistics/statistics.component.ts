import {Component, OnInit} from '@angular/core';
import {SummonerService} from "../../../services/summoner.service";
import {StatsService} from "../../../services/stats.service";
import {Sort} from "@angular/material";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  loadingC: boolean = true;
  loadingS: boolean = true;

  champions;
  stats;

  endIndex: number = 25;

  constructor(
    private _summonerService: SummonerService,
    private _statsService: StatsService
  ) {
    this._summonerService.getChampionsIcons().subscribe(res => {
      this.champions = res['data'];
      this.loadingC = false;
    });
    this._statsService.getAllStats().subscribe(res => {
      if (res['status'] === 200) {
        this.stats = StatisticsComponent.orderStats(res['body']);
        this.loadingS = false;
      }
    });
  }

  ngOnInit() {
  }

  static orderStats(arr) {
    return arr.sort((a, b) => {
      if (a['win_rate'] > b['win_rate']) {
        return -1
      } else if (a['win_rate'] < b['win_rate']) {
        return 1
      } else {
        return 0
      }
    })
  }

  getChampionName(idC) {
    // let resultado = this.champions.find(function (element) {
    //   return element['key'] === idC;
    // });
    // console.log(resultado);
    for (let champion of Object.values(this.champions)) {
      if (champion['key'] == idC) {
        return champion['id'];
      }
    }

  }

  static compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    const data = this.stats.slice();
    if (!sort.active || sort.direction === '') {
      this.stats = data;
    }
    this.stats = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'ban_rate':
          return StatisticsComponent.compare(a.ban_rate, b.ban_rate, isAsc);
        case 'goldTotal':
          return StatisticsComponent.compare((a.goldTotal / a.matchesTotal), (b.goldTotal / b.matchesTotal), isAsc);
        case 'matchesTotal':
          return StatisticsComponent.compare(a.matchesTotal, b.matchesTotal, isAsc);
        case 'pick_rate':
          return StatisticsComponent.compare(a.pick_rate, b.pick_rate, isAsc);
        case 'win_rate':
          return StatisticsComponent.compare(a.win_rate, b.win_rate, isAsc);
        case 'kda':
          return StatisticsComponent.compare((a.kda / a.matchesTotal), (b.kda / b.matchesTotal), isAsc);
        case 'minionsKilledTotal':
          return StatisticsComponent.compare((a.minionsKilledTotal / a.matchesTotal), (b.minionsKilledTotal / b.matchesTotal), isAsc);
        default:
          return 0;
      }
    });
  }

  moreChampions(){
    this.endIndex += 25;
  }

}
