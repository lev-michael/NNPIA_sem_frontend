import './menu.scss'

function Menu({ nav, active }) {
    return <div className="menu">
        {nav?.map(navItem => {
            return <a className={`menu__item`} key={navItem.id} href={navItem.to}>{navItem.title}</a>
        })}
    </div>
}

export default Menu;