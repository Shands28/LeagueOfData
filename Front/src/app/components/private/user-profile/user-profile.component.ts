import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loadingAccounts: boolean;
  userInfo: Object;
  displayedColumns: string[] = ['icon', 'name'];

  constructor(
    private _authService: AuthService,
    private router: Router
  ) {
    this.loadingAccounts = true;
    this._authService.getUserName().subscribe(
      res => {
        if (res['status'] === 200) {
          if (Date.now() > res['body']['exp']) {
            this._authService.isLoggedIn = true;
            this.userInfo = res['body'];
            this.loadingAccounts = false;
          }
        }
      },
      error => {
        this.router.navigate(['/home']);
      })
  }

  ngOnInit() {
  }

}
