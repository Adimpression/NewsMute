import {Component} from "@angular/core";
import {CognitoCallback, LoggedInCallback, RefreshCallback} from "../../providers/cognito.service";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {UserLoginService} from "../../providers/userLogin.service";
import {EventsService} from "../../providers/events.service";
import {ControlPanelComponent} from "../controlpanel/controlpanel";
import {RegisterComponent} from "./register.component";
import {ForgotPasswordStep1Component} from "./forgotPassword1.component";
import {AwsService} from "../../providers/aws.service";
import {HomePage} from "../home/home";

@Component({
    templateUrl: 'login.html'
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, RefreshCallback {
    email: string;
    password: string;

    constructor(readonly nav: NavController,
                readonly navParam: NavParams,
                readonly alertCtrl: AlertController,
                readonly eventService: EventsService,
                readonly awsService: AwsService) {
        console.log("LoginComponent constructor");
        if (navParam != null && navParam.get("email") != null)
            this.email = navParam.get("email");

        console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
        let me: any = this;
        me.awsService.refresh(<CognitoCallback>{
            cognitoCallback(message: string, result: any): void {
                me.rootPage = me.loginComponent;
                if (message != null) {
                    console.log(message)
                } else {
                    me.nav.push(HomePage)
                }
            }
        });
    }


    signMeIn() {
        console.log("in onLogin");
        // if (this.email == null || this.password == null) {
        //     this.doAlert("Error", "All fields are required");
        //     return;
        // }
        this.email = "ravindranathakila@gmail.com";
        this.password = "11111111";
        this.awsService.authenticate(this.email, this.password, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.doAlert("Error", message);
            console.log("result: " + message);
            this.awsService.refresh(this)
        } else { //success
            console.log("Redirect to ControlPanelComponent");
            this.nav.setRoot(ControlPanelComponent);
        }
    }

    refreshCallback(message: string, result: any): void {
        if (message != null) { //error
            this.doAlert("Error", message);
            console.log("result: " + message);
        } else { //success
            console.log("Redirect to ControlPanelComponent");
        }
    }

    isLoggedInCallback(message: string, isLoggedIn: boolean) {
        console.log("The user is logged in: " + isLoggedIn);
        if (isLoggedIn) {
            this.eventService.sendLoggedInEvent();
            this.nav.setRoot(ControlPanelComponent);
        }
    }

    navToRegister() {
        this.nav.push(RegisterComponent);
    }

    navToForgotPassword() {
        this.nav.push(ForgotPasswordStep1Component);
    }

    doAlert(title: string, message: string) {

        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}