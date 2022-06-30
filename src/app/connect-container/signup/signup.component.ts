import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public signupForm!: FormGroup;
  public error: boolean = false;
  public errorLog?: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      lastName: [null, Validators.required],
      firstName: [null, Validators.required],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  submit(): void {
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    const lastName = this.signupForm.get('lastName')!.value;
    const firstName = this.signupForm.get('firstName')!.value;
    this.auth
      .addUser(email, password, lastName, firstName)
      .pipe(
        switchMap(() => this.auth.logUser(email, password)),
        tap(() => {
          this.router.navigate(['../home/']);
        }),
        catchError((error): any => {
          this.error = true;
          this.errorLog = error.error.error;
        })
      )
      .subscribe();
  }
}
