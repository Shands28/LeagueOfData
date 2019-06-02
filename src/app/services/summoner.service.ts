import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SummonerService {

  constructor(
    private http: HttpClient
  ) {
  }

  getSummonerInfo(summonerName, region) {
    return this.http.get('../assets/summonerData' + summonerName + '.json').pipe(map((data: any) => {
      return data;
    }));
  }

  getSummonerMatchesInfo(summonerName, region) {
    return this.http.get('../assets/matchesData.json').pipe(map((data: any) => {
      return data;
    }));
  }

  getChampionsIcons(){
    return this.http.get('https://ddragon.leagueoflegends.com/cdn/9.11.1/data/en_US/champion.json').pipe(map( (data:any) => {
      return data;
    }))
  }
}
