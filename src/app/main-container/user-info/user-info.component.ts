import { Component, HostListener, OnInit } from '@angular/core';
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

  constructor(private users: UsersService, private auth: AuthService) {}

  ngOnInit(): void {
    this.users$ = this.users.users$;
    this.id = this.auth.getUserId();
    this.users.getUserInfos(this.id!).subscribe();
  }
}
