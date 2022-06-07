import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
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
  public file!: File;
  public id?: string;
  public user!: User;
  public modifyUserInfos!: FormGroup;
  public firstName?: string;
  public lastName?: string;
  public email?: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private users: UsersService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.modifyUserInfos = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      file: [null],
    });
    this.users$ = this.users.users$;
    this.id = this.auth.getUserId();
    this.users.getUserInfos(this.id).subscribe((user) => {
      this.user = user;
      this.modifyUserInfos = this.formBuilder.group({
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        email: [this.user.email, Validators.required],
        file: [null],
      });
    });
    // this.modifyUserInfos = this.formBuilder.group({
    //   firstName: [this.user.firstName, Validators.required],
    //   lastName: [this.user.lastName, Validators.required],
    //   email: [this.user.email, Validators.required],
    // });
  }

  newFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.modifyUserInfos.get('file')!.setValue(file);
  }

  leaveForm(): void {
    this.router.navigate(['../profile/' + this.id]);
  }

  stayOnForm($event: Event) {
    $event.stopPropagation();
  }

  submit(): void {
    const updatedUser = new User();
    updatedUser.firstName = this.modifyUserInfos.get('firstName')!.value;
    updatedUser.lastName = this.modifyUserInfos.get('lastName')!.value;
    updatedUser.email = this.modifyUserInfos.get('email')!.value;
    this.users
      .modifyUser(
        updatedUser,
        this.modifyUserInfos.get('file')!.value,
        this.id!
      )
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
