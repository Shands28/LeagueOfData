import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  registerUrl = environment.back_route;

  constructor(
    private http: HttpClient
  ) {
  }

  submitRegisterStepOne(form: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const body = {
      'step': '1',
      'username': form['userName'],
      'email': form['userEmail'],
      'password': form['userPass']
    };
    return this.http.post(this.registerUrl+'registro/steps', body, {headers, observe: 'response'}).pipe(map((data: any) => {
      return data;
    }));
  }

  submitRegisterStepTwo(form: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const body = {
      'step': '2',
      'summonerName': form['summonerNameUser'],
      'region': form['regionUser']
    };
    return this.http.post(this.registerUrl+'registro/steps', body, {headers, observe: 'response'}).pipe(map((data: any) => {
      return data;
    }));
  }

  submitRegisterStepThree(form: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const body = {
      'step': '3',
      'username': form['userForm']['userName'],
      'email': form['userForm']['userEmail'],
      'password': form['userForm']['userPass'],
      'userIdentifier': form['userIdentifier'],
      'summonerName': form['summonerForm']['summonerNameUser'],
      'region': form['summonerForm']['regionUser'],
      'summonerId': form['summonerId'],
      'profileIconId': form['profileIconId']
    };
    return this.http.post(this.registerUrl+'registro/steps', body, {headers, observe: 'response'}).pipe(map((data: any) => {
      return data;
    }));
  }

  saveAccount(summonerName, region, profileIconId){
    const body = {
      summonerName: summonerName,
      region: region,
      profileIconId: profileIconId,
      token: localStorage.getItem('token')
    };
    return this.http.post(this.registerUrl+'user/save-account', body, {observe: 'response'}).pipe(map((data:any)=> {
      return data;
    }))
  }

  dropAccount(summonerName){
    const body = {
      summonerName: summonerName,
      token: localStorage.getItem('token')
    };
    return this.http.post(this.registerUrl+'user/drop-account', body, {observe: 'response'}).pipe(map((data:any)=> {
      return data;
    }))
  }
}
