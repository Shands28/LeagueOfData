import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  redirectUrl: string;
  constructor() { }

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(val => this.isLoggedIn = true)
    )
  }

  logout(): void{
    this.isLoggedIn = false;
  }
}
