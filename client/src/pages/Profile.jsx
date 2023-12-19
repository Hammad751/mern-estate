import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom'
import { 
  updateUserStart, 
  updateUserFailure, 
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure
 } from "../redux/user/userSlice";

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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
  };

  const handleChange = (e) =>{
    // here we are setting the values through id which we set in the input field
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if(data.success == false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };

  const handleDelete = async (e) =>{
    // e.preventDefault();

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, 
      { method: 'DELETE', });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/signup');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }

  }

  const handleSignOut = async () => {
    try {
      dispatch(signoutStart());
      const res = await fetch('/server/auth/signout');
      const data = await res.json();

      if(data.success === false){
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess(data));
    } catch (error) {
      dispatch(signoutFailure(error));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
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
        
        <input onChange={handleChange} className='p-3 rounded-lg' id="username" type='text' placeholder='username' defaultValue={currentUser.username} />
        <input onChange={handleChange} className='p-3 rounded-lg' id="email" type='email' placeholder='email' defaultValue={currentUser.email}/>
        <input onChange={handleChange} className='p-3 rounded-lg' id="password" type='password' placeholder='password' />
        <button disabled={loading} className='bg-slate-600 text-white rounded-lg p-3 hover:opacity-90 uppercase disabled:opacity-80'>
          {loading ? "Loading..." : "update"}
          </button>
        <button className='bg-blue-500 text-white hover:opacity-90 uppercase disabled:opacity-70 rounded-lg p-3'>create listing</button>
      </form>
      <div className="flex justify-between mt-3">
        <span onClick={handleDelete} className="text-red-500 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">Sign out</span>
      </div>
      <p className="text-green-500">{updateSuccess && "updated successfully"}</p> 
      <p className="text-red-500 mt-3">{error && error}</p>
    </div>
  )
}
