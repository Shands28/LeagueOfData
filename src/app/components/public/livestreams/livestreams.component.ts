import { Component, OnInit } from '@angular/core';
import {TwitchService} from '../../../services/twitch.service';

@Component({
  selector: 'app-livestreams',
  templateUrl: './livestreams.component.html',
  styleUrls: ['./livestreams.component.css']
})
export class LivestreamsComponent implements OnInit {

  loading: boolean = true;
  livestreams: any[];
  lastPagination: string;

  constructor(
    private __twitchService: TwitchService
  ) {
    this.__twitchService.getLivestreams().subscribe( result => {
      if(result['status']==200){
        this.livestreams = result['body']['data'];
        this.lastPagination = result['body']['pagination']['cursor'];
        this.loading = false;
      }
    });
  }

  ngOnInit() {
  }

  formatImageUrl(image_url){
    return image_url.replace('{width}', '700').replace('{height}', '320');
  }

  getMoreLivestreams(){
    this.__twitchService.getMoreLivestreams(this.lastPagination).subscribe( result => {
      if(result['status']==200){
        this.livestreams = this.livestreams.concat(result['body']['data']);
        this.lastPagination = result['body']['pagination']['cursor'];
      }
    })
  }

  getLivestreamsLink(user_id){

  }

}
