import { Link } from 'react-router-dom';
import './menu.scss'

function Menu({ nav, active }) {
    return <div className="menu">
        {nav?.map(navItem => {
            return <Link className={`menu__item`} key={navItem.id} to={navItem.to}>{navItem.title}</Link>
        })}
    </div>
}

export default Menu;