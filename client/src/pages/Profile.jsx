import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]); // this is the condition, if there is a file, call this function.

  const handleFileUpload = (file) => {
    // this below app is comming from firebase file and getStorage is imported from firebase storage
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // this method is createed to show the uploading progress
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        // console.log(`upload is ${progress}% done`);
      },
      // this will show the error, if there is any error accure
      (error) => {
        setUploadError(true);
      },
      // this method is used to get the file from storage
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          // this is done to keep track of our previous data
          setFormData({...formData, avatar: downloadURL});
        } )
      }
    )    
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 '>
        <input 
          onChange={(e) => setFile(e.target.files[0])}
          type="file" 
          ref={fileRef} 
          hidden accept="image/*" 
        />
        <img 
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} 
          alt="profile"
          className="rounded-full h-20 w-20 
          object-cover cursor-pointer 
          self-center mt-2"
        />

        <p className="text-sm self-center">
          {
            uploadError ? 
            <span className="text-red-500">error image upload</span> :
            filePerc > 0 && filePerc < 100 ? 
            <span className="text-slate-500">{`uploading ${filePerc}%`}</span> :
            filePerc === 100 && 
            <span className="text-green-500">uplaod file successfully</span>
          }
        </p>
        
        <input className='p-3 rounded-lg' id="username" type='text' placeholder='username' defaultValue={currentUser.username} />
        <input className='p-3 rounded-lg' id="email" type='email' placeholder='email' defaultValue={currentUser.email}/>
        <input className='p-3 rounded-lg' id="password" type='password' placeholder='password' />
        <button className='bg-slate-600 text-white rounded-lg p-3 hover:opacity-90 uppercase disabled:opacity-80'>update</button>
        <button className='bg-blue-500 text-white hover:opacity-90 uppercase disabled:opacity-70 rounded-lg p-3'>create listing</button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-500 cursor-pointer">Delete account</span>
        <span className="text-red-500 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}
