import React from 'react'

export default function CreateListing() {
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
                    <input type='file' id='images' accept='image/*' className='p-3 border border-gray-400 rounded w-full' />
                    <button 
                        className='px-3 uppercase border 
                        border-green-800 text-green-600 
                        rounded hover:shadow-lg disabled:opacity-80'
                    >upload</button>
                </div>
                <button 
                    className='p-3 bg-slate-600 text-white rounded-lg
                    uppercase hover:opacity-95 disabled:opacity-80'>
                create listing</button>
            </div>
        </form>
    </main>
  )
}
