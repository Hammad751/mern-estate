import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { signinSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogle = async () => {
        try {
            // here we get the provider from firebase as well
            const provider = new GoogleAuthProvider();
            // here we get the auth from firebse as well
            const auth = getAuth(app);

            // now we will show the popup for signin with google
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/server/auth/google',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        name: result.user.displayName, 
                        email: result.user.email, 
                        photo: result.user.photoURL,
                    }),
            });
            const data = await res.json();
            dispatch(signinSuccess(data));
            navigate('/')
        } catch (error) {
            console.log("google error",error);
        }
    }
  return (
    <button 
        onClick={handleGoogle} 
        type='button' 
        className='bg-red-600 text-white p-3 
        rounded uppercase hover:opacity-95'>
        Continue with google
    </button>
  )
}
