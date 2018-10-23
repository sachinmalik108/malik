import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/interface.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  isAuthenticated:Boolean = false;
  show:Boolean = false;

  constructor(
    private authservice: AuthService
  ) { }

  ngOnInit() {
    this.authservice.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
    this.authservice.isAuthenticated.subscribe(
      (bool) => {
        this.isAuthenticated = bool;
        this.show = true;
      }
    );
  }

  logout(){
    this.authservice.logout();
  }

}
