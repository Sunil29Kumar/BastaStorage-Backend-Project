import React, { useContext } from 'react'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI'

function StorageFullMessage() {
    const { storageFullMessage } = useContext(BastaStorageContext);
  return (
    <div className=' absolute bottom-0 left-[50%] translate-x-[-50%] bg-red-500 text-[1vw] rounded-md p-2 ' >{storageFullMessage}</div>
  )
}

export default StorageFullMessage