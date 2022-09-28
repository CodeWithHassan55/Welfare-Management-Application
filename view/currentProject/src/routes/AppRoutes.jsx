import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AdminPanel, Dashboard, Donars, Login, Sheet, Voucher } from '../screens'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
        <Route path="/AdminPanel" element={<AdminPanel />}></Route>
        <Route path="/Sheet" element={<Sheet />}></Route>
        <Route path="/Voucher" element={<Voucher />}></Route>
        <Route path="/Donars" element={<Donars />}></Route>
    </Routes>
  )
}

export default AppRoutes
