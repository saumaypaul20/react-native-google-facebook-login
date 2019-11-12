import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginButton ,GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
const AccessToken = require('react-native-fbsdk/js/FBAccessToken');
export default class FBLoginButton extends Component {
    initUser(token) {
        AccessToken
                       .getCurrentAccessToken()
                       .then((user) => {
                           alert("Facebook accessToken:\n" + user.accessToken + "\n\naccessTokenSource: " + user.accessTokenSource + "\n\nuserID: " + user.userID)
                           console.log(user);
                           return user
                       })
                       .then((user) => {
                           const responseInfoCallback = (error, result) => {
                               if (error) {
                                   console.log(error)
                                   alert('Error fetching data: ' + error.toString());
                               } else {
                                   console.log(result)
                                   alert('id: ' + result.id + '\n\nname: ' + result.name + '\n\nfirst_name: ' + result.first_name + '\n\nlast_name: ' + result.last_name + '\n\nemail: ' + result.email);
                               }
                           }

                           const infoRequest = new GraphRequest('/me', {
                               accessToken: user.accessToken,
                               parameters: {
                                   fields: {
                                       string: 'email,name,first_name,last_name'
                                   }
                               }
                           }, responseInfoCallback);

                           // Start the graph request.
                           new GraphRequestManager()
                               .addRequest(infoRequest)
                               .start()
                       })
      }

      init2(token){
        let req = new GraphRequest('/me', {
            httpMethod: 'GET',
            accessToken: token,
            version: 'v2.5',
            parameters: {
                'fields': {
                    'string' : 'email,name,friends'
                }
            }
        }, (err, res) => {
            console.log(err, res);
        });
        return req
      }
  render() {
    return (
      <View>
        <LoginButton
    //    publishPermissions={["publish_actions"]}
       // publishPermissions={}
        // readPermissions={['public_profile']}
          onLoginFinished={
            (error, result) => {
                console.log(result)
              if (error) {
                alert("Login failed with error: " + error.message);
                console.log(error)
              } else if (result.isCancelled) {
                console.log(result)

                alert("Login was cancelled");
              } else {
                  console.log(result)
                alert("Login was successful with permissions: " + result.grantedPermissions)
                AccessToken.getCurrentAccessToken().then((data) => {
                    const { accessToken } = data
                    this.initUser(accessToken)
                  })
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
};

module.exports = FBLoginButton;