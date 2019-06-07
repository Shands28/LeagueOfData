import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loadingAccounts:boolean;
  userInfo: Object;
  displayedColumns: string[] = ['icon', 'name', 'level'];

  constructor(
    _userService: UserService
  ) {
    this.loadingAccounts = true;
    _userService.getUserInfo().subscribe(result => {
      this.userInfo = result;
      this.loadingAccounts = false;
    });
  }

  ngOnInit() {
  }

}
