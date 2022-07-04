import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public auth$!: Observable<boolean>;
  public id?: string | null;
  public currentWindowWidth!: number;

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  constructor(private auth: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.auth$ = this.auth.auth$;
    this.currentWindowWidth = window.innerWidth;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['../login']);
  }

  checkProfile() {
    this.id = this.auth.getUserId();
    this.router.navigate(['./profile/' + this.id]);
  }
}
