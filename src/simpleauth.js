/**
 * Created by HP on 10/14/2020.
 */
import React, { useState,useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    TextInput
} from 'react-native';
import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import RNOtpVerify from 'react-native-otp-verify';

const simpleauth: () => React$Node = () => {
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);

    const [code, setCode] = useState('');




    useEffect(() => {
        // docs: https://github.com/faizalshap/react-native-otp-verify
console.log("useEffect called")
        RNOtpVerify.getOtp()
            .then(p =>
                RNOtpVerify.addListener(message => {
                    try {
                        if (message) {
                            const messageArray = message.split('\n');
                            if (messageArray[2]) {
                                const otp = messageArray[2].split(' ')[0];
                                if (otp.length === 4) {
                                    console.log("code is:",otp.split(''))
                                    // setOtpArray(otp.split(''));
                                    //
                                    // // to auto submit otp in 4 secs
                                    // setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
                                    // startAutoSubmitOtpTimer();
                                }
                            }
                        }
                    } catch (error) {

                        console.log( 'RNOtpVerify.getOtp - read message, OtpVerification')

                    }
                }),
            )
            .catch(error => {
                console.log( 'RNOtpVerify.getOtp, OtpVerification')


            });

        // remove listener on unmount
        return () => {
            RNOtpVerify.removeListener();
        };
    }, []);


    // Handle the button press
    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    }

    async function confirmCode() {
        try {
            await confirm.confirm(code).then((res)=>{
                console.log("code verified")
            });
        } catch (error) {
            console.log('Invalid code.');
        }
    }

    if (!confirm) {
        return (
            <Button
                title="Phone Number Sign In"
                onPress={() => signInWithPhoneNumber('+1 650-555-3434')}
            />
        );
    }

    return (

        <View style={{flex:1}}>
            <TextInput style={{marginTop:20}} value={code} onChangeText={text => setCode(text)} />
            <Button title="Confirm Code" onPress={() => confirmCode()} />
        </View>

    );
}
export default simpleauth;
