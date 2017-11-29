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

    refresh(cognitoCallback: CognitoCallback) {
        // Need to provide placeholder keys unless unauthorised user access is enabled for user pool

        class React implements SyncCallback {
            cognitoCallback: CognitoCallback;


            constructor(cognitoCallback: CognitoCallback) {
                this.cognitoCallback = cognitoCallback;
            }

            syncCallback(message: string, loggedIn: boolean): void {
                this.cognitoCallback.cognitoCallback(message, loggedIn)
            }

        }

        this.storage.get("email").then((username) => {

            AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

            let me = this;
            let userPool = this.cUtil.getUserPool();

            console.log("Refreshing the user");
            let refreshing_cognito_user = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
                Username: username != null ? username : "",
                Pool: userPool
            });
            refreshing_cognito_user.setAuthenticationFlowType("REFRESH_TOKEN_AUTH");

            me.storage.get("refresh_token").then((refresh_token) => {
                console.log("refresh_token", refresh_token);
                refreshing_cognito_user.refreshSession(new AWSCognito.CognitoIdentityServiceProvider.CognitoRefreshToken(
                    {
                        RefreshToken: refresh_token == null ? "" : refresh_token
                    }), (err, result) => {
                    if (err) {
                        throw err
                    } else {
                        me.sync(result, new React(cognitoCallback))
                    }
                });
            });
        }).catch((error) => {
            throw error;
        })
    }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        // Need to provide placeholder keys unless unauthorised user access is enabled for user pool

        class React implements SyncCallback {
            cognitoCallback: CognitoCallback;


            constructor(cognitoCallback: CognitoCallback) {
                this.cognitoCallback = cognitoCallback;
            }

            syncCallback(message: string, loggedIn: boolean): void {
                this.cognitoCallback.cognitoCallback(message, loggedIn)
            }

        }

        AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

        let me = this;
        let userPool = this.cUtil.getUserPool();

        console.log("Authenticating the user");
        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
            Username: username,
            Pool: userPool
        });
        cognitoUser.authenticateUser(new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
            Username: username,
            Password: password,
        }), {
            onSuccess: function (result) {
                me.storage.set("refresh_token", result.getRefreshToken().getToken()).then(() => {
                    me.storage.set("email", username).then(() => {
                        me.sync(result, new React(callback))
                    }).catch((error) => {
                        throw error
                    })
                }).catch((error) => {
                    throw error;
                });
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
        });
    }

    sync(result: any, callback: SyncCallback) {
        this.storage.get("email").then((username) => {
            callback.syncCallback(null, result);
            this.eventService.sendLoggedInEvent();

            console.log('Access Token:' + result.getAccessToken().getJwtToken());
            console.log('Refresh Token:' + JSON.stringify(result.getRefreshToken().getToken()));

            var token = result.getIdToken().getJwtToken();

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:cb9e6ded-d4d8-4f07-85cc-47ea011c8c53',
                RoleArn: 'arn:aws:iam::990005713460:role/Cognito_NewsMuteAuth_Role',
                Logins: {
                    'cognito-idp.us-east-1.amazonaws.com/us-east-1_qUg94pB5O': token
                }
                //RoleSessionName: 'web'
            });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

            AWS.config.credentials.get(function () {
                let syncClient = new AWS.CognitoSyncManager();

                console.log(syncClient.getIdentityId());
                // Utility.setHumanId(syncClient.getIdentityId());

                var cognitoidentity = new AWS.CognitoIdentity(AWS.config.credentials);

                var accessKey;
                var secretKey;
                var sessionToken;

                cognitoidentity.getCredentialsForIdentity(
                    {
                        IdentityId: syncClient.getIdentityId(),
                        Logins: {
                            'cognito-idp.us-east-1.amazonaws.com/us-east-1_qUg94pB5O': token
                        }
                    }, function (err, data) {
                        if (!err) {
                            console.log(data);
                            accessKey = data.Credentials.AccessKeyId;
                            secretKey = data.Credentials.SecretKey;
                            sessionToken = data.Credentials.SessionToken;

                            // Utility.setAccessKey(accessKey);
                            // Utility.setSecretKey(secretKey);
                            // Utility.setSessionToken(sessionToken);
                            // Utility.setToken(token);

                            // $rootScope.$broadcast('loading:hide');

                            // successCallback(data);
                        } else {
                            console.log(err, err.stack);
                            // $rootScope.$broadcast('loading:hide');
                            // failureCallback(err.message);
                        }
                    });

                syncClient.openOrCreateDataset('humanId', function (err, dataset) {
                    dataset.put('v1', username, function (err, record) {
                        dataset.synchronize({
                            onSuccess: function (data, newRecords) {
                                console.log("Cognito Sync humanId Complete:onSuccess");
                            },
                            onFailure: function (err) {
                                console.log(err);
                                console.log("Cognito Sync humanId Complete:onFailure");
                            },
                            onConflict: function (dataset, conflicts, callback) {
                                //http://docs.aws.amazon.com/cognito/latest/developerguide/handling-callbacks.html
                                // console.log(dataset);
                                // console.log(conflicts);
                                var resolved = [];
                                for (var i = 0; i < conflicts.length; i++) {
                                    resolved.push(conflicts[i].resolveWithValue(conflicts[i].getLocalRecord().getValue()));
                                }
                                dataset.resolve(resolved, function () {
                                    console.log("Cognito Sync humanId Complete:onConflict");
                                    return callback(true);
                                });
                            },
                            onDatasetDeleted: function (dataset, datasetName, callback) {
                                // console.log(dataset);
                                // console.log(datasetName);
                                console.log("Cognito Sync humanId Complete:onDatasetDeleted");
                            },
                            onDatasetMerged: function (dataset, datasetNames, callback) {
                                // console.log(dataset);
                                // console.log(datasetNames);
                                console.log("Cognito Sync humanId Complete:onDatasetMerged");
                            }
                        });
                    });
                });

                syncClient.openOrCreateDataset('syncTime', function (err, dataset) {
                    dataset.remove('v1', function (err, record) {
                        dataset.put('v1', (new Date).getTime(), function (err, record) {
                            dataset.synchronize({
                                onSuccess: function (data, newRecords) {
                                    console.log("Cognito Sync syncTime Complete");
                                }
                            });
                        });
                    });
                });
            });
        }).catch((error) => {
            throw error;
        });
    }

    forgotPassword(username: string, callback: CognitoCallback) {
        let userData = {
            Username: username,
            Pool: this.cUtil.getUserPool()
        };

        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function (result) {

            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
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