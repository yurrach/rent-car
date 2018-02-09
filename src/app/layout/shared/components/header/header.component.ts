import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/core/auth.service';

@Component({
  selector: 'crayf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAdmin = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.user.subscribe(user => {
      if (user && user.roles) {
        this.isAdmin = user.roles.admin;
      }
    });
  }
}
