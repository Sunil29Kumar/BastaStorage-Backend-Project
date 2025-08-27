import React, { useContext } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { BastaStorageContext } from '../hooks/Context/ContextAPI';
import { useNavigate } from 'react-router-dom';

function LoginWithGoogle() {

    const navigate = useNavigate();
    const { loginWithGoogle, setIsLoginWithGoogle, isLoginWithGoogle } = useContext(BastaStorageContext)

    return (
        <div className=' ' >

            <GoogleLogin
                onSuccess={async credentialResponse => {
                    const data = await loginWithGoogle(credentialResponse.credential)
                    // if (data.error) {
                    //     console.error("Login failed:", data.error);
                    // }

                    navigate('/')
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
                theme='filled_blue'
                text='icon'

            /></div>
    )
}

export default LoginWithGoogle