import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, Observable, tap } from 'rxjs';
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
  public error: boolean = false;
  public errorLog?: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private users: UsersService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.users$ = this.users.users$;
    this.activatedRoute.parent!.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
      this.changePassword = this.formBuilder.group({
        password: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
      });
      this.users.getUserInfos(this.id).subscribe((user) => {
        this.user = user;
      });
    });
  }

  leaveForm(): void {
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
        }),
        catchError((error): any => {
          this.error = true;
          this.errorLog = error.error.error;
        })
      )
      .subscribe();
  }
}
