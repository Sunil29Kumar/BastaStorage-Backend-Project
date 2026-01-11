import React, { useContext } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { BastaStorageContext } from '../hooks/Context/ContextAPI';
import { useNavigate } from 'react-router-dom';

function LoginWithGoogle() {

    const navigate = useNavigate();
    const { loginWithGoogle, setIsLoginWithGoogle, isLoginWithGoogle } = useContext(BastaStorageContext)

    return (
        < >

            <GoogleLogin
                onSuccess={async credentialResponse => {
                    const data = await loginWithGoogle(credentialResponse.credential)
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
                theme='filled_blue'
                text='icon'

            /></>
    )
}

export default LoginWithGoogle