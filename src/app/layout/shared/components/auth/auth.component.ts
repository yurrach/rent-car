import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/core/auth.service';

@Component({
  selector: 'crayf-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {

  }

}
