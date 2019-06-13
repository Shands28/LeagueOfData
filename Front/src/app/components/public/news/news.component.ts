import {Component, OnInit} from '@angular/core';
import {NewsService} from "../../../services/news.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  loading: boolean = true;
  news;


  constructor(
    private activatedRoute: ActivatedRoute,
    private _newsService: NewsService
  ) {
    this._newsService.getNewsBody(this.activatedRoute.snapshot.params['id']).subscribe(res => {
      if (res['status'] === 200) {
        console.log(res['body']);
        this.news = res['body'];
        this.loading = false;
      }
    })
  }

  ngOnInit() {
  }

}
