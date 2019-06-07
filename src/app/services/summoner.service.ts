import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SummonerService {
  private api_key = environment.api_key;

  constructor(private http: HttpClient) {
  }

  getSummonerInfo(summonerName, region) {
    return this.http.get('../assets/summonerData' + summonerName + '.json').pipe(map((data: any) => {
      return data;
    }));
  }

/*  getSummonerInfo(summonerName, region) {
    let headers = new HttpHeaders();
    /!*headers = headers.append('Content-Type', 'application/json;charset=utf-8');
    headers = headers.append('Origin', 'https://developer.riotgames.com');
    headers = headers.append('Accept-Charset', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers = headers.append('X-Riot-Token', 'RGAPI-2b3d76bb-1e1e-492c-bf73-54880b926d1a');
    headers = headers.append('Accept-Language', 'es-ES,es;q=0.9,en;q=0.8,fr;q=0.7,ro;q=0.6');
    headers = headers.append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');*!/
    headers = headers.append('Access-Control-Allow-Origin', '*');

    let params = new HttpParams();
    params = params.append('api_key', 'RGAPI-2b3d76bb-1e1e-492c-bf73-54880b926d1a');

    return this.http.get('https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName,  {headers, observe: 'response', params}).pipe(map((data: any) => {
      return data;
    }));
  }*/

  getSummonerMatchesInfo(summonerName, region) {
    return this.http.get('../assets/matchesData.json').pipe(map((data: any) => {
      return data;
    }));
  }

  getChampionsIcons() {
    return this.http.get('https://ddragon.leagueoflegends.com/cdn/9.11.1/data/en_US/champion.json').pipe(map((data: any) => {
      return data;
    }));
  }

  getSummonerSpells() {
    return this.http.get('https://ddragon.leagueoflegends.com/cdn/9.11.1/data/en_US/summoner.json').pipe(map((data => {
      return data;
    })));
  }

  getQueues(){
    return this.http.get('../../assets/json/queues.json').pipe(map((data => {
      return data;
    })));
  }
}
