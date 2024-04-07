import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav-container">
      <h2 className="logo">SafeRoutes</h2>
      <ul className="nav-list">
        <li>
          <Link className="nav-item" to={"/"}>
            Home
          </Link>
        </li>
        <li>
          <Link className="nav-item" to={"/inform-us"}>
            Inform Us
          </Link>
        </li>
      </ul>
    </div>
  );
}
