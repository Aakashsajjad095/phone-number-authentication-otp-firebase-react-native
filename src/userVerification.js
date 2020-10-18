/**
 * Created by HP on 10/19/2020.
 */
import React,{Component} from 'react';
import { StyleSheet, Text, View,Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';

export default class userVerification extends Component {
    smsListener;

    async componentDidMount() {
        if (Platform.OS === 'android') {
            // await this.requestReadSmsPermission();
            this.handleSmsVerificationCode();
        }
    }
    /** requesting android sms permission */
    async requestReadSmsPermission() {
        try {
            var granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS, {
                    title: 'Auto Verification OTP',
                    message: 'need access to read sms, to verify OTP'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                alert('READ_SMS permissions granted', granted);
                console.log('READ_SMS permissions granted', granted);
                granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
                        title: 'Receive SMS',
                        message: 'Need access to receive sms, to verify OTP'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.handleSmsVerificationCode();
                }
            }
                // else
                //     {
            //         alert('RECEIVE_SMS permissions denied');
            //         console.log('RECEIVE_SMS permissions denied');
            //     }
            // }
            // else {
            //     alert('READ_SMS permissions denied');
            //     console.log('READ_SMS permissions denied');
            // }
        } catch (err) {
            alert(err);
        }
    }

    handleSmsVerificationCode() {

        console.log("verification code is detected:")

     // var   message="Welcome to AwsomeProject. Your verification code is 584366."

      var  subscription = this.smsListener = SmsListener.addListener(message => { //invoke sms listener
            verificationMessage = message.body;
            rgx = this.handleRegularExpression();
            matches = rgx.exec(verificationMessage);
            verificationCode = (matches[1]);  //Convert to int
            console.log("verification code is detected:",verificationCode)
            if (message.originatingAddress === '1234567890') {
                this.handleVerifcationCodeAutomatically(verificationCode);
            }});
        subscription.remove();
    }

    handleRegularExpression() {
        rgx = /Code is ([\d]{6})/;
        return rgx;
    }
    handleVerifcationCodeAutomatically(code) {
        console.log(code);
    }

    render() {
        return (
            <View><Text>User Verification</Text></View>
        );
    }
}