// to make a profile private, we will use use selector
import { useSelector } from "react-redux"
// to show the child route, we use outlet
import { Navigate, Outlet } from "react-router-dom";
export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to='/signin' />
}
