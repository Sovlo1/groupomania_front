import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    this.users.getUserInfos(this.id).subscribe((user) => {
      this.user = user;
      this.changePassword = this.formBuilder.group({
        password: ['', Validators.required],
        newPassword: ['', Validators.required],
      });
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
    console.log('pouet');
  }
}
