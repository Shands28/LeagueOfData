import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  statsUrl: string = environment.back_route;

  constructor(
    private http: HttpClient
  ) {
  }

  getAllStats() {
    return this.http.get(this.statsUrl + 'stats', {observe: 'response'}).pipe(map((data) => {
      return data;
    }))
  }

  getWinRate() {
    return this.http.get(this.statsUrl + 'stats/win-rate', {observe: 'response'}).pipe(map((data) => {
      return data;
    }))
  }
}
