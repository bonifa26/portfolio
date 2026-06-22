import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>Bonifa Niranjani</h2>

      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>        
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>

        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;