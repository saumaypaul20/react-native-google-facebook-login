import React, { Component } from 'react'
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from 'react-native-google-signin';
import {Text, View, TouchableOpacity} from 'react-native';

export default class GoogleButton extends Component {
    constructor(props){
        super(props);
        this.state={
            userInfo: null,
            gettingLoginStatus: true,
            isSigninInProgress:false,
            signedIn:false
        }
    }

    componentDidMount(){
        GoogleSignin.configure({
            //It is mandatory to call this method before attempting to call signIn()
            scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
            // Repleace with your webClientId generated from Firebase console
            webClientId: 'REPLACE-WITH-YOUR-ID',
          });
          //Check if user is already signed in
          this._isSignedIn();
    }


    signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          this.setState({ userInfo:userInfo,signedIn:true });
          console.log('loggedin')
          console.log(userInfo)
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (f.e. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      };


      _isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          alert('User is already signed in');
          this.setState({signedIn:true})
          //Get the User details as user is already signed in
          this._getCurrentUserInfo();
        } else {
          //alert("Please Login");
          console.log('Please Login');
        }
        this.setState({ gettingLoginStatus: false });
      };
     
      _getCurrentUserInfo = async () => {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          console.log('User Info --> ', userInfo);
          this.setState({ userInfo: userInfo });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            alert('User has not signed in yet');
            console.log('User has not signed in yet');
          } else {
            alert("Something went wrong. Unable to get user's info");
            console.log("Something went wrong. Unable to get user's info");
          }
        }
      };
     
      _signIn = async () => {
        //Prompts a modal to let the user sign in into your application.
        try {
          await GoogleSignin.hasPlayServices({
            //Check if device has Google Play Services installed.
            //Always resolves to true on iOS.
            showPlayServicesUpdateDialog: true,
          });
          const userInfo = await GoogleSignin.signIn();
          console.log('User Info --> ', userInfo);
          this.setState({ userInfo:userInfo,signedIn:true });
        } catch (error) {
          console.log('Message', error.message);
          console.log(error);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User Cancelled the Login Flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Signing In');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services Not Available or Outdated');
          } else {
            console.log('Some Other Error Happened');
          }
        }
      };
     
      _signOut = async () => {
        //Remove user session from the device.
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.setState({ userInfo: null, signedIn:false }); // Remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };


    render() {
        if(!this.state.signedIn){

            return (
                <>
                    <GoogleSigninButton
                        style={{ width: 192, height: 48 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={this._signIn}
                        disabled={this.state.isSigninInProgress} />

                 </>
                )
            }else if(this.state.signedIn){
                return(
                    <View>

                        <TouchableOpacity onPress={this._signOut}>
                        <Text style={{padding:20, fontSize:18, color:'green' }}>Logout from Google</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
    }
}
