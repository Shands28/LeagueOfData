import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SummonerService {

  constructor(
    private http: HttpClient
  ) {  }

  getSummonerInfo(summonerName, region){
    return this.http.get('../assets/pruebasummoner.json').pipe(map( (data:any) => {
      return data;
    }))
  }
}
