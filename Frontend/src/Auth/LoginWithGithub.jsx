import React from 'react'
import { useContext } from 'react'
import { BastaStorageContext } from '../hooks/Context/ContextAPI'

function LoginWithGithub() {

    const { loginWithGithub } = useContext(BastaStorageContext);
    return (
        <>
            <button onClick={loginWithGithub} className=' cursor-pointer  ' ><i className="ri-github-fill text-[2vw] hover:text-gray-300"></i></button>
        </>
    )
}

export default LoginWithGithub