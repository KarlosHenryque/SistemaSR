import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LayoutAdmin from "../assets/components/LayoutAdmin";
import "../assets/css/AdminHome.css"

function AdminHome() {

  return (
   <LayoutAdmin>
      <h1>Ola seja bem vindo</h1>
   </LayoutAdmin>
  )
}

export default AdminHome