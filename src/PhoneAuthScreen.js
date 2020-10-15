/**
 * Created by HP on 10/14/2020.
 */
import React, { Component } from 'react'
import {
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    View,
    Text,
    TextInput
} from 'react-native'
import auth from '@react-native-firebase/auth';

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
        // Request for OTP verification
        const { confirmResult, verificationCode } = this.state
        if (verificationCode.length == 6) {
            confirmResult
                .confirm(verificationCode)
                .then(user => {
                    console.log("user Data is :",user.user)
                    this.setState({ userId: user.user.uid })
                    alert(`Verified! ${user.user.uid}`)
                })
                .catch(error => {
                    alert(error.message)
                    console.log(error)
                })
        } else {
            alert('Please enter a 6 digit OTP code.')
        }
    }

    renderConfirmationCodeView = () => {
        return (
            <View style={styles.verificationView}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Verification code'
                    placeholderTextColor='#eee'
                    value={this.state.verificationCode}
                    keyboardType='numeric'
                    onChangeText={verificationCode => {
                        this.setState({ verificationCode })
                    }}
                    maxLength={6}
                />
                <TouchableOpacity
                    style={[styles.themeButton, { marginTop: 20 }]}
                    onPress={this.handleVerifyCode}>
                    <Text style={styles.themeButtonTitle}>Verify Code</Text>
                </TouchableOpacity>
            </View>
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

                    {this.state.confirmResult ? this.renderConfirmationCodeView() : null}
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
    }
})

export default PhoneAuthScreen