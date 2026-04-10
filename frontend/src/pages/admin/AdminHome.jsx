import LayoutAdmin from "../assets/components/LayoutAdmin";
import "../assets/css/admin/AdminHome.css";
import logo from "../assets/images/logo.jpg"; 

function AdminHome() {
  return (
    <LayoutAdmin>
      <div className="admin-center">
        <img src={logo} alt="Logo" className="center-image" />
      </div>
    </LayoutAdmin>
  );
}

export default AdminHome;