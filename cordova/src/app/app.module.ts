import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from "./app.component";
import {CognitoUtil} from "../providers/cognito.service";
import {AwsUtil} from "../providers/aws.service";
import {ControlPanelComponent} from "../pages/controlpanel/controlpanel";
import {EventsService} from "../providers/events.service";
import {LoginComponent} from "../pages/auth/login.component";
import {RegisterComponent} from "../pages/auth/register.component";
import {ConfirmRegistrationComponent} from "../pages/auth/confirmRegistration.component";
import {ResendCodeComponent} from "../pages/auth/resendCode.component";
import {ForgotPasswordStep1Component} from "../pages/auth/forgotPassword1.component";
import {ForgotPasswordStep2Component} from "../pages/auth/forgotPassword2.component";
import {UserLoginService} from "../providers/userLogin.service";
import {UserParametersService} from "../providers/userParameters.service";
import {UserRegistrationService} from "../providers/userRegistration.service";
import {LogoutComponent} from "../pages/auth/logout.component";

import {HomePage} from '../pages/home/home';
import {SigninPage} from "../pages/signin/signin";
import {SettingsPage} from "../pages/settings/settings";
import {SignupPage} from "../pages/signup/signup";
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
    declarations: [
        MyApp,
        SigninPage,
        SignupPage,
        HomePage,
        SettingsPage,
        LoginComponent,
        LogoutComponent,
        RegisterComponent,
        ConfirmRegistrationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPasswordStep2Component,
        ControlPanelComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        SigninPage,
        SignupPage,
        HomePage,
        SettingsPage,
        LoginComponent,
        LogoutComponent,
        RegisterComponent,
        ConfirmRegistrationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPasswordStep2Component,
        ControlPanelComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        CognitoUtil,
        AwsUtil,
        UserLoginService,
        UserParametersService,
        UserRegistrationService,
        EventsService]
})

export class AppModule {
}
