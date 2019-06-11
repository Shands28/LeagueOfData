import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  logUrl: string = environment.back_route;

  constructor(
    private http: HttpClient
  ) {
  }

  login(form: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const body = {
      'username': form['summonerNameUser'],
      'password': form['regionUser']
    };
    return this.http.post(this.logUrl + 'register', body, {headers, observe: 'response'}).pipe(map((data: any) => {
      return data;
    }))
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  getUserName() {
    return this.http.get(this.logUrl + '', {
      observe: 'response', params: new HttpParams().append('token', localStorage.getItem('t'))
    }).pipe(map((data: any) => {
      return data;
    }))
  }
}
