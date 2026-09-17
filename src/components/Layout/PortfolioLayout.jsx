import { Outlet } from "react-router-dom";
import Navbar from "../portfolio/main/Navbar";
import Footer from "../../components/Footer";


export default function PortfolioLayout() {
    return (
        <div>
            <Navbar />    
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
