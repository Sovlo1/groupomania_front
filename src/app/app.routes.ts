import { Routes } from '@angular/router';
import { LoginComponent } from './connect-container/login/login.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NewPostComponent } from './main-container/new-post/new-post.component';
import { SignupComponent } from './connect-container/signup/signup.component';
import { ConnectContainerComponent } from './connect-container/connect-container.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserUpdateComponent } from './user-profile/user-update/user-update.component';
import { UserRemoveComponent } from './user-profile/user-remove/user-remove.component';
import { UserPasswordComponent } from './user-profile/user-password/user-password.component';
import { EditPostComponent } from './main-container/edit-post/edit-post.component';
import { DataGuardGuard } from './services/data-guard.guard';
import { PostImageComponent } from './main-container/post-image/post-image.component';
import { CommentImageComponent } from './main-container/comment-image/comment-image.component';

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
    canActivate: [DataGuardGuard],
    children: [
      { path: 'new', component: NewPostComponent },
      { path: 'edit/:id', component: EditPostComponent },
      { path: 'post/image/:id', component: PostImageComponent },
      { path: 'comment/image/:id', component: CommentImageComponent },
    ],
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    canActivate: [DataGuardGuard],
    children: [
      { path: 'updateinfos', component: UserUpdateComponent },
      { path: 'delete', component: UserRemoveComponent },
      { path: 'updatepassword', component: UserPasswordComponent },
    ],
  },
];
