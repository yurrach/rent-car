import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/core/auth.service';


@Component({
  selector: 'crayf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

}
