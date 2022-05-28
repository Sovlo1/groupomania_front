import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  auth$!: Observable<boolean>;

  constructor(private auth: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.auth$ = this.auth.auth$;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['../login']);
  }
}
