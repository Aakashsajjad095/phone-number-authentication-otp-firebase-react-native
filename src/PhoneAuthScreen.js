/**
 * Created by HP on 10/14/2020.
 */
import React, { Component } from 'react'
import {
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    DeviceEventEmitter,
    View,
    Text,
    TextInput
} from 'react-native'
import auth from '@react-native-firebase/auth';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import RNOtpVerify from 'react-native-otp-verify';

class PhoneAuthScreen extends Component {
    state = {
        phone: '',
        confirmResult: null,
        verificationCode: '',
        userId: ''
    }
    validatePhoneNumber = () => {
        var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
        return regexp.test(this.state.phone)
    };
    componentDidMount() {
        RNOtpVerify.getOtp()
            .then(p => RNOtpVerify.addListener(this.otpHandler))
            .catch(p => console.log(p));
    }

    otpHandler = (message: string) => {
        console.log('SMS :: ',message)
        const otp = /(\d{6})/g.exec(message)[1];
        console.log(otp);
        this.setState({verificationCode: otp });
        // RNOtpVerify.removeListener();
        // Keyboard.dismiss();
    }
    componentWillUnmount() {
        RNOtpVerify.removeListener();
    }

    onChangeText = (value)=> {
        this.setState({
            verificationCode: value
        })
    }

    handleSendCode = async() => {
        // Request to send OTP
        if (this.validatePhoneNumber()) {
            await auth().signInWithPhoneNumber(this.state.phone)
                .then(confirmResult => {
                    this.setState({ confirmResult })
                    console.log("confirm Result is:",confirmResult)
                })
                .catch(error => {
                    alert(error.message)

                    console.log(error)
                })
        } else {
            alert('Invalid Phone Number')
        }
    }

    changePhoneNumber = () => {
        this.setState({ confirmResult: null, verificationCode: '' })
    }

    handleVerifyCode = () => {

        // let credential = auth().AuthProvider.credential(this.state.confirmResult.verificationId, code);
        // auth().signInWithCredential(credential).then((auth) => {
        //     console.log(auth)
        // }).catch(err => { console.log(err)})


        this.unsubscribe = auth().onAuthStateChanged((usernew) => {
            // alert(JSON.stringify(user))
            if (usernew) {

                console.log('data check',usernew.uid)
                //hit Api
            } else {
                // User has been signed out, reset the state
                console.log("user seassion has to be failed")

            }
        });


       // get user id for ios

        // Request for OTP verification
        // const { confirmResult, verificationCode } = this.state
        // if (verificationCode.length == 6) {
        //     confirmResult
        //         .confirm(verificationCode)
        //         .then(user => {
        //
        //
        //             this.unsubscribe = auth().onAuthStateChanged((usernew) => {
        //                 // alert(JSON.stringify(user))
        //                 if (usernew) {
        //
        //                     console.log('data check',usernew.uid)
        //                     //hit Api
        //                 } else {
        //                     // User has been signed out, reset the state
        //
        //                 }
        //             });
        //             // console.log("user Data is :",user)
        //             // // this.setState({ userId: user.uid })
        //             // // alert(`Verified! ${user.uid}`)
        //         })
        //         .catch(error => {
        //             alert(error.message)
        //             console.log(error)
        //         })
        // } else {
        //     alert('Please enter a 6 digit OTP code.')
        // }
    }

    renderConfirmationCodeView = () => {
        return (
            <OTPInputView
                style={{width: '80%', height: 200}}
                pinCount={6}
                //code={this.state.verificationCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
               // onCodeChanged = {code => { this.setState({verificationCode:code})}}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled = {(code => {
                    console.log(`Code is ${code}, you are good to go!`);

                    this.unsubscribe = auth().onAuthStateChanged((usernew) => {
                        // alert(JSON.stringify(user))
                        if (usernew) {

                            console.log('data check',usernew.uid)
                            //hit Api
                        } else {
                            // User has been signed out, reset the state
                            console.log("user seassion has to be failed")

                        }
                    });
                })}
            />
        )
    }

    render() {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#333' }]}>
                <View style={styles.page}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Phone Number with country code'
                        placeholderTextColor='#eee'
                        keyboardType='phone-pad'
                        value={this.state.phone}
                        onChangeText={phone => {
                            this.setState({ phone })
                        }}
                        maxLength={15}
                        editable={this.state.confirmResult ? false : true}
                    />

                    <TouchableOpacity
                        style={[styles.themeButton, { marginTop: 20 }]}
                        onPress={
                            this.state.confirmResult
                                ? this.changePhoneNumber
                                : this.handleSendCode
                        }>
                        <Text style={styles.themeButtonTitle}>
                            {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
                        </Text>
                    </TouchableOpacity>

                    {!this.state.confirmResult ? this.renderConfirmationCodeView() : null}
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#aaa'
    },
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        marginTop: 20,
        width: '90%',
        height: 40,
        borderColor: '#555',
        borderWidth: 2,
        borderRadius: 5,
        paddingLeft: 10,
        color: '#fff',
        fontSize: 16
    },
    themeButton: {
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#888',
        borderColor: '#555',
        borderWidth: 2,
        borderRadius: 5
    },
    themeButtonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },
    verificationView: {
        width: '100%',
        alignItems: 'center',
        marginTop: 50
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
})

export default PhoneAuthScreen