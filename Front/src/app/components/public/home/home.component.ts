import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {TwitchService} from '../../../services/twitch.service';
import {NewsService} from "../../../services/news.service";
import {StatsService} from "../../../services/stats.service";
import {SummonerService} from "../../../services/summoner.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loadingStreams: boolean = true;
  loadingNews: boolean = true;
  loadingStats: boolean = true;

  livestreams;
  news;
  stats;
  champions;

  newsStartIndex: number = 0;
  newsEndIndex: number = 4;

  searchSummonerForm = new FormGroup({
    summonerName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[\\d\\sa-zA-Z._]+$')])),
    region: new FormControl('euw1')
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _twitchService: TwitchService,
    private _newsService: NewsService,
    private _statsService: StatsService,
    private _summonerService: SummonerService
  ) {
    this._twitchService.getTopLivestreams().subscribe(result => {
      if (result['status'] == 200) {
        this.livestreams = result['body']['data'];
        this.loadingStreams = false;
      }
    });
    this._newsService.getAllNews().subscribe(res => {
      if (res['status'] === 200) {
        this.news = this.orderNews(res['body']);
        this.loadingNews = false;
      }
    });
    this._summonerService.getChampionsIcons().subscribe(res => {
      this.champions = res['data'];
    });
    this._statsService.getWinRate().subscribe(res => {
      if (res['status'] === 200) {
        this.stats = this.orderStats(res['body']);
        this.loadingStats = false;
      }
    });
  }

  ngOnInit() {
  }

  searchSummoner() {
    return this.router.navigate(['/summoner/' + this.searchSummonerForm.controls['region'].value + '/'
    + this.searchSummonerForm.controls['summonerName'].value]);
  }

  orderNews(arr) {
    return arr.sort((a, b) => {
      if (a['publicationDate'] > b['publicationDate']) {
        return -1
      } else if (a['publicationDate'] < b['publicationDate']) {
        return 1
      } else {
        return 0
      }
    })
  }

  orderStats(arr) {
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

  nextNews() {
    this.newsEndIndex += 4;
    this.newsStartIndex += 4;
  }

  previousNews() {
    this.newsEndIndex -= 4;
    this.newsStartIndex -= 4;
  }

  getChampionName(idC) {
    for (let champion of Object.values(this.champions)) {
      if (champion['key'] == idC) {
        return champion['id'];
      }
    }
  }
}
