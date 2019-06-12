import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {TwitchService} from '../../../services/twitch.service';
import {NewsService} from "../../../services/news.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loadingStreams: boolean = true;
  loadingNews: boolean = true;

  livestreams;
  news;

  searchSummonerForm = new FormGroup({
    summonerName: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[\\d\\sa-zA-Z._]+$')])),
    region: new FormControl('euw1')
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _twitchService: TwitchService,
    private _newsService: NewsService
  ) {
    this._twitchService.getTopLivestreams().subscribe(result => {
      if (result['status'] == 200) {
        this.livestreams = result['body']['data'];
        this.loadingStreams = false;
      }
    });
    this._newsService.getAllNews().subscribe(res => {
      if (res['status'] === 200){
        this.news = res['body'];
        this.loadingNews = false;
      }
    })
  }

  ngOnInit() {
  }

  searchSummoner() {
    return this.router.navigate(['/summoner/' + this.searchSummonerForm.controls['region'].value + '/'
    + this.searchSummonerForm.controls['summonerName'].value]);
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
