import { Routes } from '@angular/router';
import { LoginComponent } from './connect-container/login/login.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NewPostComponent } from './main-container/new-post/new-post.component';
import { AuthGuard } from './services/auth-guard.service';
import { SignupComponent } from './connect-container/signup/signup.component';
import { ConnectContainerComponent } from './connect-container/connect-container.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: ConnectContainerComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
  {
    path: 'home',
    component: MainContainerComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'new', component: NewPostComponent }],
  },
];
