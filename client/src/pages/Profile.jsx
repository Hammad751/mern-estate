import { useSelector } from "react-redux"

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4 '>
        <img className="rounded-full h-20 w-20 object-cover cursor-pointer self-center mt-2" src={currentUser.avatar} alt="profile" />
        
        <input className='p-3 rounded-lg' id="username" type='text' placeholder='username' />
        <input className='p-3 rounded-lg' id="email" type='email' placeholder='email' />
        <input className='p-3 rounded-lg' id="password" type='password' placeholder='password' />
        <button className='bg-slate-600 text-white rounded-lg p-3 hover:opacity-90 uppercase disabled:opacity-80'>update</button>
        <button className='bg-blue-500 text-white hover:opacity-90 uppercase disabled:opacity-70 rounded-lg p-3'>create listing</button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-500" >Delete Account</span>
        <span className="text-red-500" >Sign out</span>
      </div>
    </div>
  )
}
