import { Link } from 'react-router-dom';
import '../index.css';
const Nav = () => {
  return (
    <nav>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/SavedCandidates">Saved Candidates</Link></li>
      </ul>
    </nav>
  );
};

export default Nav;