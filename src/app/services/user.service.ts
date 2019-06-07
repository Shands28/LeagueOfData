import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUserInfo(){
    return this.http.get('../assets/pruebauser.json').pipe(map( (data:any) => {
      localStorage.setItem("JavierArenasLlorente", "Juasjuas");
      return data;
    }));
  }
}
