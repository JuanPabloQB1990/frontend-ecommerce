import AdminProducts from "./pages/AdminProducts";
import { Route, Routes } from "react-router-dom";
import UploadFile from "./components/UploadImagesProduct";
import ClientProducts from "./pages/ClientProducts";
import CartProducts from "./pages/CartProducts";
import AdminClients from "./pages/AdminClients";
import Profile from "./pages/Profile";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRouters from "./security/ProtectedRoutes";
import ProtectedRoutersAdmin from "./security/ProtectedRoutesAdmin";

function App() {

  console.log("render app");
  
  return (
    <Routes>
      <Route path="/" element={<ProtectedRouters><Home/></ProtectedRouters>}/>
      <Route path="/admin-products" element={<ProtectedRoutersAdmin><AdminProducts/></ProtectedRoutersAdmin>}/>
      <Route path="/admin-clients" element={<ProtectedRoutersAdmin><AdminClients/></ProtectedRoutersAdmin>}/>

      <Route path="/upload" element={<UploadFile/>}/>

      <Route path="/client-products/:id" element={<ProtectedRouters><ClientProducts/></ProtectedRouters>}/>
      <Route path="/client-products-cart" element={<ProtectedRouters><CartProducts/></ProtectedRouters>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/profile/:id" element={<ProtectedRouters><Profile/></ProtectedRouters>}/>

    </Routes>
  );
}

export default App;
