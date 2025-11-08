import React, { useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BastaStorageContext } from '../hooks/Context/ContextAPI'
import { useNavigate } from 'react-router-dom';

function Breadcrumb() {
    const { directoriesList, currentDirPath, } = useContext(BastaStorageContext)
    const currentLocation = useLocation()

    const navigate = useNavigate()


    return (
        <div className='text-white text-lg  py-1 px-3 '>
            {currentLocation.pathname === '/' ? (
                <Link to="/" className='text-4xl font-bold'>My Drive</Link>
            ) : (

                <div >
                    <Link to="/" className='font-semibold text-blue-400 hover:underline'>My Drive</Link>

                    {currentDirPath.map((path, index) => (
                        <span key={index}>
                            {console.log(path.dirPathId)}
                            <span className='mx-1'> / </span>
                            <Link 
                            to={`/directory/${path.dirPathId}`}
                                className='text-blue-400 hover:underline'
                                onClick={() => {
                                    currentDirPath(currentLocation);
                                    console.log("currentlocation = ",currentLocation);
                                }}
                            >
                                {path.dirName}
                            </Link>

                        </span >
                    ))}

                    <span className='mx-1'> / </span>

                </div>


            )}
        </div>
    )
}

export default Breadcrumb
