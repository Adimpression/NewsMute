import {Component, ViewChild} from "@angular/core";
import {Events, MenuController, NavController, Platform} from "ionic-angular";
import {AwsUtil} from "../providers/aws.service";
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
    public loginPage = LoginComponent;
    public splash = new SplashScreen();
    public rootPage: any;


    constructor(public platform: Platform,
                public events: Events,
                public awsUtil: AwsUtil) {
        console.log("In MyApp constructor");

        this.platform.ready().then(() => {
            this.awsUtil.initAwsService();

            this.rootPage = this.loginPage;

            console.log("Hiding splash screen");
            this.splash.hide();
        });
    }
}
