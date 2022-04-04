import "./Scroller.scss"

const Scroller = ({data, alterImage}) => {

    return <ol className="scroller">
        {data && data.map((obj, index) => <li className="item" key={index}>
            <div>
                <img src={obj.img ? ("http://image.tmdb.org/t/p/w154/" + obj.img) : alterImage} alt={obj.name}></img>
            </div>
            <div className="padding-element--horizontal">
                <p>{obj.role}</p>
                <p>{obj.name}</p>
            </div>
        </li>)}
    </ol>
}

export default Scroller;