import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  public userId?: string;
  public id?: string;
  public user!: User;
  public deleteUser!: FormGroup;
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
    this.userId = this.auth.getUserId();
    this.users$ = this.users.users$;
    this.activatedRoute.parent!.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
      this.users.getUserInfos(this.id).subscribe((user) => {
        this.user = user;
      });
      this.deleteUser = this.formBuilder.group({
        password: ['', Validators.required],
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
    this.users
      .removeUser(this.id!, this.deleteUser.get('password')!.value)
      .pipe(
        catchError((error): any => {
          this.error = true;
          this.errorLog = error.error.error;
        })
      )
      .pipe(
        tap(() => {
          if (this.userId == this.id) {
            this.auth.logout();
            this.router.navigate(['../../']);
          } else {
            this.router.navigate(['../home']);
          }
        })
      )
      .subscribe();
  }
}
