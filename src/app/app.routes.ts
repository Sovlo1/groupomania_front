import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NewPostComponent } from './main-container/new-post/new-post.component';
import { SignupComponent } from './signup/signup.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'home',
    component: MainContainerComponent,
    children: [{ path: 'new', component: NewPostComponent }],
  },
];
