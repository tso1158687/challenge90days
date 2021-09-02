import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NbThemeModule,
  NbLayoutModule,
  NbIconModule,
  NbButtonModule,
  NbToastrModule,
  NbToggleModule,
  NbMenuModule,
  NbCalendarModule,
  NbDatepickerModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { NbAuthModule } from '@nebular/auth';
import {
  NbFirebaseAuthModule,
  NbFirebasePasswordStrategy,
  NbFirebaseGoogleStrategy,
} from '@nebular/firebase-auth';
import { environment } from '../environments/environment';
import { FireworkModule } from '../../../../libs/firework/src/lib/firework.module';
import { FooterModule } from './modules/footer/footer.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NbCalendarModule,
    FormsModule,
    FooterModule,
    BrowserAnimationsModule,
    FireworkModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbButtonModule,
    NbToggleModule,
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule.enablePersistence(),
    NbFirebaseAuthModule,
    NbDatepickerModule.forRoot(),
    NbAuthModule.forRoot({
      forms: {
        login: {
          strategy: 'password',
          rememberMe: false,
          socialLinks: [],
        },
        register: {
          redirectDelay: 500,
          strategy: 'password',
          showMessages: {
            success: true,
            error: true,
          },
          terms: false,
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
              failure: null,
            },
          },
          register: {
            redirect: {
              success: '/',
              failure: null,
            },
          },
        }),
        NbFirebaseGoogleStrategy.setup({
          name: 'google',
        }),
      ],
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
