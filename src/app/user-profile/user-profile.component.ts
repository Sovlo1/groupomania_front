import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public users$!: Observable<User>;
  public loggedUser$!: Observable<User>;
  public id?: string;
  public authId?: string | null;
  public isAdmin!: boolean;
  public isMod?: boolean;
  public currentWindowWidth!: number;

  constructor(
    private users: UsersService,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  ngOnInit() {
    this.currentWindowWidth = window.innerWidth;
    this.isAdmin = this.auth.getAdminStatus();
    this.isMod = this.auth.getModStatus();
    this.authId = this.auth.getUserId();
    this.users$ = this.users.users$;
    this.loggedUser$ = this.users.loggedUser$;
    this.users.getLoggedUserInfos(this.authId!).subscribe();
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
      this.users.getUserInfos(this.id).subscribe();
    });
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
