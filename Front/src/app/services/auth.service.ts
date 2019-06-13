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
    private http: HttpClient,
  ) {
  }

  login(form: any) {
    const body = {
      'email': form['userName'],
      'password': form['userPass'],
      'getHash': true
    };
    return this.http.post(this.logUrl + 'login', body, {observe: 'response'}).pipe(map((data: any) => {
      return data;
    }))
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUserName() {
    let headers = new HttpHeaders();
    headers.append('Content-Length', '999');
    return this.http.get(this.logUrl + 'user/' + localStorage.getItem('token'), {
      headers,
      observe: 'response'
    }).pipe(map((data: any) => {
      return data;
    }))
  }
}
