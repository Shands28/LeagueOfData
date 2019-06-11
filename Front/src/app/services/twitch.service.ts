import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  URL = 'https://api.twitch.tv/helix/streams?game_id=21779';

  constructor(
    private http: HttpClient
  ) { }

  getLivestreams() {
    let headers = new HttpHeaders();
    headers = headers.append( 'Client-ID', 'c04duz4fp9l0nyvqqvhj93kk90ga8v');
    return this.http.get(this.URL + '&first=9', { headers: headers, observe: 'response' }).pipe(map( (data:any) => {
      return data;
    }))
  }

  getTopLivestreams() {
    let headers = new HttpHeaders();
    headers = headers.append( 'Client-ID', 'c04duz4fp9l0nyvqqvhj93kk90ga8v');
    return this.http.get(this.URL + '&first=10', { headers: headers, observe: 'response' }).pipe(map( (data:any) => {
      return data;
    }))
  }

  getMoreLivestreams(pagination){
    let headers = new HttpHeaders();
    headers = headers.append( 'Client-ID', 'c04duz4fp9l0nyvqqvhj93kk90ga8v');
    return this.http.get(this.URL + '&first=9&after=' + pagination, { headers: headers, observe: 'response' }).pipe(map( (data:any) => {
      return data;
    }))
  }
}
