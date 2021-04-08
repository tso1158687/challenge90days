import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { NbAuthModule } from '@nebular/auth';
import { NbFirebaseAuthModule, NbFirebasePasswordStrategy, NbFirebaseGoogleStrategy } from '@nebular/firebase-auth';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    NbFirebaseAuthModule,
    
    NbAuthModule.forRoot({
      forms: {
        login: {
          strategy: 'password',
          rememberMe: false,
          socialLinks: [],
        },
        validation: {
          password: {
            required: true,
            minLength: 6,
            maxLength: 50,
          },
          email: {
            required: true,
          },
        },
      },
      strategies: [
        NbFirebasePasswordStrategy.setup({
          name: 'password',
          login: {
            redirect: {
              success: '/',
              failure: null
            },
          },
        }),
        NbFirebaseGoogleStrategy.setup({
          name: 'google',
        }),
      ],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
