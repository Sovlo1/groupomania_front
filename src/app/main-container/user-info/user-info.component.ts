import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  public users$!: Observable<User>;
  public id?: string | null;
  public userInfos!: User;
  public auth$!: Observable<boolean>;
  public currentWindowWidth!: number;
  public image?: string;

  constructor(
    private users: UsersService,
    private auth: AuthService,
    public router: Router
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.auth$ = this.auth.auth$;
    this.users$ = this.users.users$;
    this.currentWindowWidth = window.innerWidth;
    this.id = this.auth.getUserId();
    this.users.getUserInfos(this.id!).subscribe();
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
