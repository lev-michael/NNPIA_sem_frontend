import "./Scroller.scss"

const Scroller = ({data, alterImage, redirectHandler}) => {

    return <ol className="scroller">
        {data && data.map((item, index) => <li className="item" key={index} onClick={e => redirectHandler(item.id)}>
            <div>
                <img src={item.img ? ("http://image.tmdb.org/t/p/w154/" + item.img) : alterImage} alt={item.name}></img>
            </div>
            <div className="padding-element--horizontal">
                <p>{item.role}</p>
                <p>{item.name}</p>
            </div>
        </li>)}
    </ol>
}

export default Scroller;