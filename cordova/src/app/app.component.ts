import {Component, ViewChild} from "@angular/core";
import {Events, MenuController, NavController, Platform} from "ionic-angular";
import {AwsService} from "../providers/aws.service";
import {ControlPanelComponent} from "../pages/controlpanel/controlpanel";
import {SplashScreen} from "@ionic-native/splash-screen";
import {LoginComponent} from "../pages/auth/login.component";
import {LogoutComponent} from "../pages/auth/logout.component";

import {SigninPage} from "../pages/signin/signin";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(NavController) navCtrl;
    readonly loginPage = LoginComponent;
    public splash = new SplashScreen();
    public rootPage: any;

    constructor(readonly platform: Platform,
                readonly events: Events,
                readonly awsUtil: AwsService) {
        console.log("MyApp()");

        this.platform.ready().then(() => {
            this.rootPage = this.loginPage;

            console.log("Hiding splash screen");
            this.splash.hide();
        });
    }
}
