import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  newsUrl: string = environment.back_route;

  constructor(
    private http: HttpClient
  ) {
  }

  getAllNews() {
    return this.http.get(this.newsUrl + 'news', {observe: 'response'}).pipe(map((data: any) => {
      return data;
    }));
  }

  getNewsBody(idN) {
    return this.http.get(this.newsUrl + 'news/' + idN, {observe: 'response'}).pipe(map((data: any) => {
      return data;
    }));
  }
}
