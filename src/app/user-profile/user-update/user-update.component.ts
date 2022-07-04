import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, Observable, tap } from 'rxjs';
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
  public id!: string;
  public modifyUserInfos!: FormGroup;
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public image?: string;
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
    this.modifyUserInfos = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bio: [''],
      file: [null],
    });
    this.activatedRoute.parent!.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')!;
      this.users$ = this.users.users$;
      this.users.getUserInfos(this.id).subscribe((user) => {
        this.modifyUserInfos = this.formBuilder.group({
          firstName: [user.firstName, Validators.required],
          lastName: [user.lastName, Validators.required],
          bio: [user.bio],
          file: [null],
        });
      });
    });
  }

  newFile(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.modifyUserInfos.get('file')!.setValue(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
    };
    reader.readAsDataURL(file);
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
    updatedUser.bio = this.modifyUserInfos.get('bio')!.value;
    this.users
      .modifyUser(
        updatedUser,
        this.modifyUserInfos.get('file')!.value,
        this.id!
      )
      .pipe(
        tap(async () => {
          this.router.navigate(['../profile/' + this.id]);
          this.users.getUserInfos(this.id!).subscribe();
        }),
        catchError((error): any => {
          this.error = true;
          this.errorLog = error.error.error;
        })
      )
      .subscribe();
  }
}
