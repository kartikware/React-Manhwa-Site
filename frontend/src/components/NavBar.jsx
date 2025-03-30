import { Link } from "react-router-dom";
import "../css/NavBar.css";

function NavBar({ onHomeClick }) {
    return (
        <nav className="Navbar">
            <div className="Navbar-brand">
                <Link to="/" onClick={onHomeClick}>Manhwa App</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link" onClick={onHomeClick}>Home</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
            </div>
        </nav>
    );
}

export default NavBar;