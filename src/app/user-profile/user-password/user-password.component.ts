import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss'],
})
export class UserPasswordComponent implements OnInit {
  public users$!: Observable<User>;
  public id?: string;
  public user!: User;
  public changePassword!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private users: UsersService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.users$ = this.users.users$;
    this.id = this.auth.getUserId();
    this.changePassword = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
    this.users.getUserInfos(this.id).subscribe((user) => {
      this.user = user;
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
    const updatedPassword = {
      password: this.changePassword.get('password')!.value,
      newPassword: this.changePassword.get('newPassword')!.value,
    };
    this.users
      .changePassword(updatedPassword, this.id!)
      .pipe(
        tap(async () => {
          this.router.navigate(['../profile/' + this.id]);
          this.users.getUserInfos(this.id!).subscribe((user) => {
            this.user = user;
          });
        })
      )
      .subscribe();
  }
}
