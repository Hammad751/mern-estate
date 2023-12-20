import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase';

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageURLs: []
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    console.log("formData: ", formData);
    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageURLs.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for(let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls)=>{
                setFormData(
                    {
                        ...formData,
                        imageURLs: formData.imageURLs.concat(urls)
                    }
                );
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => { 
                setImageUploadError('image upload failed (2 mb max)');
                setUploading(false);
            })
        }
        else{
            setImageUploadError('you can upload only 6 images');
            setUploading(false);
        }
    }
    const storeImage = async (file) => {
        return new Promise((res, rej) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
            (snapshot)=>{},
            (error)=> {rej(error)},
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    res(downloadURL);
                });
            }
            );
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageURLs: formData.imageURLs.filter((_,i) => i !== index),
        });
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a list</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input 
                    type='text' placeholder='Name' 
                    className='border p-3 rounded-lg' 
                    id='name'
                    maxLength='62'
                    minLength='10'
                    required
                />
                <textarea 
                    type='text' placeholder='Description' 
                    className='border p-3 rounded-lg' 
                    id='description'
                    required
                />
                <input 
                    type='text' placeholder='Address' 
                    className='border p-3 rounded-lg' 
                    id='address'
                    required
                />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-4' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-4' />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-4' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-4' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-4' />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-4 my-4 flex-wrap'>
                    <div className='flex gap-2 items-center'>
                        <input type='number' id='beds' min='1' max='10' required className='w-15 p-2 rounded-lg'/>
                        <p>Beds</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type='number' id='baths' min='1' max='10' required className='w-15 p-2 rounded-lg'/>
                        <p>Baths</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type='number' id='regPrice' min='1' max='10' required className='p-3 w-20 border rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>($/months)</span>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input type='number' id='discPrice' min='1' max='10' required className=' p-3 w-20 border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p>Discounted Price</p>
                            <span className='text-xs'>($/months)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                    <span className='font-normal text-gray-500 ml-2'>the first image will be the cover (masx 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input 
                        onChange={(e) => setFiles(e.target.files)} 
                        type='file' id='images' accept='image/*' multiple 
                        className='p-3 border border-gray-400 rounded w-full' 
                    />
                    <button 
                        disabled={uploading}
                        type='button'
                        onClick={handleImageSubmit}
                        className='px-3 uppercase border 
                        border-green-800 text-green-600 
                        rounded hover:shadow-lg disabled:opacity-80'
                    >
                        {uploading ? "uploading..." : "upload"}
                    </button>
                </div>
                <p className='text-red-500 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageURLs.length && formData.imageURLs.map((url, index)=>(
                        <div key={url} className='flex justify-between items-center p-3 border border-gray-200 rounded-lg'>
                            <img src={url} alt='image' className='w-20 h-20 boreder border-gray-200 rounded-lg object-contain' />
                            <button 
                                onClick={() => handleRemoveImage(index)} 
                                type='button' 
                                className='uppercase text-red-500 rounded-lg hover:opacity-70' 
                            >delete</button>
                        </div>
                    ))
                }

                <button 
                    className='p-3 bg-slate-600 text-white rounded-lg
                    uppercase hover:opacity-95 disabled:opacity-80'>
                create listing</button>
            </div>
        </form>
    </main>
  )
}
