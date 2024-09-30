import { Main } from 'components/Layout'
import Billing from 'pages/Billing'
import Home from 'pages/Home'
import Profile from 'pages/Profile'
import Tables from 'pages/Tables'
import SignIn from 'pages/signIn'
import Signup from 'pages/signUp'
import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/sign-up" element={<Signup />} />
        <Route
          path="/sign-in"
          element={<SignIn setAuthenticated={setAuthenticated} />}
        />
        <Route
          path="/"
          element={authenticated ? <Main /> : <Navigate to="/sign-in" />}
        >
          <Route path="dashboard" element={<Home />} />
          <Route path="tables" element={<Tables />} />
          <Route path="billing" element={<Billing />} />
          <Route path="rtl" element={<Home />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}
