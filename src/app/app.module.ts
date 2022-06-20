import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './connect-container/login/login.component';
import { SignupComponent } from './connect-container/signup/signup.component';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainContainerComponent } from './main-container/main-container.component';
import { UserInfoComponent } from './main-container/user-info/user-info.component';
import { NewPostComponent } from './main-container/new-post/new-post.component';
import { Interceptor } from './http.interceptor';
import { AuthGuard } from './services/auth-guard.service';
import { ConnectContainerComponent } from './connect-container/connect-container.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserUpdateComponent } from './user-profile/user-update/user-update.component';
import { UserRemoveComponent } from './user-profile/user-remove/user-remove.component';
import { UserPasswordComponent } from './user-profile/user-password/user-password.component';
import { PostListComponent } from './main-container/post-list/post-list.component';
import { EditPostComponent } from './main-container/edit-post/edit-post.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    MainContainerComponent,
    PostListComponent,
    UserInfoComponent,
    NewPostComponent,
    ConnectContainerComponent,
    UserProfileComponent,
    UserUpdateComponent,
    UserRemoveComponent,
    UserPasswordComponent,
    EditPostComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
