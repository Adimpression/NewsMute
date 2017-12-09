import {Injectable} from "@angular/core";
import {CognitoCallback, CognitoUtil, LoggedInCallback, SyncCallback} from "./cognito.service";
import {EventsService} from "./events.service";
import {Storage} from '@ionic/storage';


declare let AWS: any;
declare let AWSCognito: any;

@Injectable()
export class UserLoginService {

    constructor(public cUtil: CognitoUtil, public eventService: EventsService, public storage: Storage) {
        console.log("eventservice1: " + eventService);
    }


    forgotPassword(username: string, callback: CognitoCallback) {
        console.log("forgotPassword()");
        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
            Username: username,
            Pool: this.cUtil.getUserPool()
        });

        cognitoUser.forgotPassword({
            onSuccess: function (result) {
                console.log(JSON.stringify(result));
            },
            onFailure: function (err) {
                console.log(JSON.stringify(err));
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                console.log(JSON.stringify("inputVerificationCode()"));
                callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        let userData = {
            Username: email,
            Pool: this.cUtil.getUserPool()
        };

        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }

    logout() {
        console.log("Logging out");
        this.cUtil.getCurrentUser().signOut();
        this.eventService.sendLogoutEvent();
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw("Callback in isAuthenticated() cannot be null");

        console.log("Getting the current user");
        let cognitoUser = this.cUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Couldn't get the session: " + err, err.stack);
                    callback.isLoggedInCallback(err, false);
                }
                else {
                    console.log("Session is valid: " + session.isValid());
                    callback.isLoggedInCallback(err, session.isValid());
                }
            });
        } else {
            callback.isLoggedInCallback("Can't retrieve the CurrentUser", false);
        }
    }
}