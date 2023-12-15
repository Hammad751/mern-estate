import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>{
    setFormData({
      ...formData, // we have to keep track the changes, so we use spread operator
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // we use this to prevent the page to be reload again and again
    try {
      // fetch the data from api and add API request method
      const res = await fetch('/server/auth/signin', {
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      // conver the data into string
      const data = await res.json();
      // console.log(data);
      if(data.success == false){
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='email' className='border p-3 rounded' id='email' onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded' id='password' onChange={handleChange} />

        <button disabled={loading} className='bg-slate-600 text-white 
        p-3 rounded
        uppercase hover:opacity-95
        disabled:opacity-80'
        >{loading ? "loading..." : "Sign In"}</button>
      </form>
      <div className='flex gap-3'>
          <p>Dont have an account?</p>
          <Link to={"/signup"}>
            <span className='text-blue-600'>Sign up</span>
          </Link>
      </div>

      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
