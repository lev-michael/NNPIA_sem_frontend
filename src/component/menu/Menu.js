import { Link } from 'react-router-dom';
import './menu.scss'

function Menu({ nav, userNav }) {
    return <div className="menu">
        {nav?.map((navItem) => {
            return <Link className={`menu__item`}
                key={navItem.id} to={navItem.to}>{navItem.title}</Link>
        })}
        <div className='flex--full-width'></div>
        {userNav?.map((navItem) => {
            return <Link className={`menu__item`}
                key={navItem.id} to={navItem.to}>{navItem.title}</Link>
        })}
    </div>
}

export default Menu;