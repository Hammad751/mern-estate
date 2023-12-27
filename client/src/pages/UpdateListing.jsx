import { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
    const [files, setFiles] = useState([]);
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [formData, setFormData] = useState({
        imageURLs: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchListing = async () =>{
            const listingId = params.listingId;
            const res = await fetch(`/server/listing/get/${listingId}`, {method: "GET"});
            const data = await res.json();
            if(data.success === false){
                console.log(data.message);
                return;
            }
            setFormData(data);
        }
        fetchListing();
    }, [])
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

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent')
        {
            setFormData({
                    ...formData,
                    type: e.target.id
                })
        }

        if(
            e.target.id === 'parking' || 
            e.target.id === 'furnished' || 
            e.target.id === 'offer'
        )
        {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            })
        }

        if(
            e.target.type === 'number' || 
            e.target.type === 'text' || 
            e.target.type === 'textarea')
        {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(formData.imageURLs.length < 1) return setError("you must have atleast one image");
            if(+formData.regularPrice < +formData.discountPrice) return setError("discount must be less than regular price")
            setLoading(true);
            setError(false);

            const res = await fetch(`/server/listing/update/${params.listingId}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser.rest._id
                })
            });
            const data = await res.json();
            setLoading(false);

            if(data.success === false){
                setError(data.message);
                return;
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a list</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input
                    onChange={handleChange}
                    type='text' placeholder='Name' 
                    className='border p-3 rounded-lg' 
                    id='name'
                    minLength='1'
                    maxLength='62'
                    required
                    value={formData.name}
                />
                <textarea 
                    onChange={handleChange}
                    type='textarea' placeholder='Description' 
                    className='border p-3 rounded-lg' 
                    id='description'
                    required
                    value={formData.description}
                />
                <input 
                    onChange={handleChange}
                    type='text' placeholder='Address' 
                    className='border p-3 rounded-lg' 
                    id='address'
                    required
                    value={formData.address}
                />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input 
                            onChange={handleChange} 
                            type='checkbox' id='sale' className='w-4' 
                            checked={formData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            onChange={handleChange} 
                            type='checkbox' id='rent' className='w-4'
                            checked={formData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            onChange={handleChange} 
                            type='checkbox' id='parking' className='w-4'
                            checked={formData.parking} 
                        />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            onChange={handleChange} 
                            type='checkbox' id='furnished' className='w-4' 
                            checked={formData.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            onChange={handleChange} 
                            type='checkbox' id='offer' className='w-4' 
                            checked={formData.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-4 my-4 flex-wrap'>
                    <div className='flex gap-2 items-center'>
                        <input 
                            onChange={handleChange} 
                            type='number' id='beds' min='1' max='10' required className='w-15 p-2 rounded-lg'
                            defaultValue={formData.bedrooms}
                        />
                        <p>Beds</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input 
                            onChange={handleChange} 
                            type='number' id='baths' min='1' max='10' 
                            required className='w-15 p-2 rounded-lg'
                            defaultValue={formData.bathrooms}
                        />
                        <p>Baths</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input 
                            onChange={handleChange} 
                            type='number' id='regularPrice' min='50' max='10000000' 
                            required className='p-3 w-20 border rounded-lg'
                            defaultValue={formData.regularPrice}
                        />
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            {formData.type !== 'sale' && <span className='text-xs'>($/months)</span>}
                        </div>
                    </div>
                    {
                    formData.offer &&  
                        <div className='flex gap-2 items-center'>
                            <input 
                                onChange={handleChange} 
                                type='number' id='discountPrice' min='0' max='10000000' 
                                required className=' p-3 w-20 border-gray-300 rounded-lg'
                                defaultValue={formData.discountPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                {formData.type !== 'sale' && <span className='text-xs'>($/months)</span>}
                            </div>
                        </div>
                    }
                   
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
                    disabled={loading || uploading}
                    className='p-3 bg-slate-600 text-white rounded-lg
                    uppercase hover:opacity-95 disabled:opacity-80'>
                {loading ? "updating..." : "update listing"}
                </button>
                {error && <p className='text-red-500 text-sm'>{error}</p>}
            </div>
        </form>
    </main>
  )
}
