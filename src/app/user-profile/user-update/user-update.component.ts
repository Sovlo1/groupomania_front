import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent implements OnInit {
  public users$!: Observable<User>;
  public id?: string;
  public user!: User;
  public modifyUserInfos!: FormGroup;

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
      this.modifyUserInfos = this.formBuilder.group({
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        email: [this.user.email, Validators.required],
      });
    });
  }

  leaveForm(): void {
    this.router.navigate(['../profile']);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }

  submit(): void {
    console.log('pouet');
  }
}
