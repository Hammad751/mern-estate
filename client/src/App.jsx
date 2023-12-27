import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'

export default function App() {
  return (
    <BrowserRouter className="text-red-500">
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/createlisting' element={<CreateListing />} />
          <Route path='/updatelisting/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
