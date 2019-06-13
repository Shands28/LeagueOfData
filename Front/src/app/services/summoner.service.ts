import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SummonerService {

  summonerUrl = environment.back_route;

  constructor(private http: HttpClient) {
  }

  getSummonerInfo(summonerName, region) {
    return this.http.get(this.summonerUrl + 'register/' + summonerName + '/' + region, {observe: 'response'}).pipe(map((data: any) => {
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

  getQueues() {
    return this.http.get('../../assets/json/queues.json').pipe(map((data => {
      return data;
    })));
  }

  refreshSummonerData(summonerName, region){
    return this.http.get(this.summonerUrl + 'update/' + region + '/' + summonerName, {observe: 'response'}).pipe(map( (data) => {
      return data;
    }))
  }
}
