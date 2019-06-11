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
  displayedColumns: string[] = ['icon', 'name', 'level'];

  constructor(
    private _authService: AuthService,
    private router: Router
  ) {
    this.loadingAccounts = true;
    this._authService.getUserName().subscribe(res => {
        this.loadingAccounts = false;
      },
      error => {
        this.router.navigate(['/home']);
      })
  }

  ngOnInit() {
  }

}
