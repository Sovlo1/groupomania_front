import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Observable, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-remove',
  templateUrl: './user-remove.component.html',
  styleUrls: ['./user-remove.component.scss'],
})
export class UserRemoveComponent implements OnInit {
  public users$!: Observable<User>;
  public id?: string;
  public user!: User;
  public deleteUser!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private users: UsersService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.users$ = this.users.users$;
    this.id = this.auth.getUserId();
    this.users.getUserInfos(this.id).subscribe((user) => {
      this.user = user;
    });
    this.deleteUser = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }

  leaveForm(): void {
    this.id = this.auth.getUserId();
    this.router.navigate(['../profile/' + this.id]);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }

  submit(): void {
    this.users$ = this.users.users$;
    this.id = this.auth.getUserId();
    console.log(this.id);
    console.log(this.deleteUser.get('password')!.value);
    this.users
      .removeUser(this.id, this.deleteUser.get('password')!.value)
      .subscribe();
    this.auth.logout();
    this.router.navigate(['../../']);
  }
}