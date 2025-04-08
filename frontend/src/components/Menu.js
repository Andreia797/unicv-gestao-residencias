import React from 'react';
import { Link } from 'react-router-dom';

function Menu({ links }) {
  return (
    <nav>
      <ul className="flex space-x-4">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="hover:text-gray-200">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Menu;