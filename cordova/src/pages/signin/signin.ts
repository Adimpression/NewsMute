import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {SignupPage} from "../signup/signup";

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-signin',
    templateUrl: 'signin.html',
})
export class SigninPage {

    public signupPage = SignupPage;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SigninPage');
    }

    go(page) {
        this.navCtrl.push(page).catch(
            e => {
                console.error(e.message);
            })
    }


    awsCognitoLoginNewsMute() {
        let alert = this.alertCtrl.create({
            title: 'Login',
            inputs: [
                {
                    name: 'username',
                    placeholder: 'Username'
                },
                {
                    name: 'password',
                    placeholder: 'Password',
                    type: 'password'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Login',
                    handler: data => {
                        // if (User.isValid(data.username, data.password)) {
                        //     // logged in!
                        // } else {
                        //     // invalid login
                        //     return false;
                        // }
                    }
                }
            ]
        });
        alert.present();
    }
}
