import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  URL = 'https://api.twitch.tv/helix/streams?game_id=21779&first=9';

  constructor(
    private http: HttpClient
  ) { }

  getLivestreams() {
    let headers = new HttpHeaders();
    headers = headers.append( 'Client-ID', 'c04duz4fp9l0nyvqqvhj93kk90ga8v');
    return this.http.get(this.URL, { headers: headers, observe: 'response' }).pipe(map( (data:any) => {
      return data;
    }))
  }

  getMoreLivestreams(pagination){
    let headers = new HttpHeaders();
    headers = headers.append( 'Client-ID', 'c04duz4fp9l0nyvqqvhj93kk90ga8v');
    return this.http.get(this.URL + '&after=' + pagination, { headers: headers, observe: 'response' }).pipe(map( (data:any) => {
      return data;
    }))
  }
}
