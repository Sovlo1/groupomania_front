import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  public id?: string;

  constructor(
    private users: UsersService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.users$ = this.users.users$;
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
      this.users.getUserInfos(this.id).subscribe();
    });
  }
}
