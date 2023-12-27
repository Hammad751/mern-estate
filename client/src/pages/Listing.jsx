import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'

export default function Listing() {
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async ()=>{
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(`/server/listing/get/${params.listingId}`)
                const data = await res.json();
                setLoading(false);
                if(data.success === false){
                    setError(true);
                    return
                }
                setListing(data)
            } catch (error) {
                setError(true)
                setLoading(false)
            }   
        }
        fetchListing();
    }, [params.listingId])
  return (
    <main>
        {  loading && <p className='text-center text-2xl my-7'>Loading...</p> }
        { error && <p className='text-center text-2xl my-7'>somthing went wrong</p>}
        {   
            listing && 
            (<div>
                <Swiper navigation>
                    {
                        listing.imageURLs.map((url)=>(
                            <SwiperSlide key={url}>
                                <div className='h-[650px]' 
                                style={{background: `url(${url}) center no-repeat, backgroundsize: cover`}}></div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>)
        }
        {/* {listing && listing.name} */}
    </main>
  )
}
