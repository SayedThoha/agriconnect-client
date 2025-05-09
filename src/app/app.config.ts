import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { userReducer } from './core/store/user/user.reducer';
import { UserEffects } from './core/store/user/user.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { expertReducer } from './core/store/expert/expert.reducer';
import { expertEffects } from './core/store/expert/expert.effects';
import { adminReducer } from './features/admin/store/admin.reducer';
import { adminEffects } from './features/admin/store/admin.effects';

import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
// const config: SocketIoConfig = { url: environment.apiUrl, options: {} };
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  provideAppCheck,
} from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCh53c6v1p-h_J_eqagtap_led9LP-XSuA',
  authDomain: 'agriconnect-6517e.firebaseapp.com',
  projectId: 'agriconnect-6517e',
  storageBucket: 'agriconnect-6517e.firebasestorage.app',
  messagingSenderId: '261747620554',
  appId: '1:261747620554:web:9f63b8c6b9db543d2dd233',
  measurementId: 'G-VH44W75R20',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
        },
      },
      ripple: true,
    }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStore({
      user: userReducer,
      expert: expertReducer,
      Admin: adminReducer,
    }),
    provideEffects([UserEffects, expertEffects, adminEffects]),
    provideToastr(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideOAuthClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    importProvidersFrom(SocketIoModule.forRoot(config)),
  ],
};
