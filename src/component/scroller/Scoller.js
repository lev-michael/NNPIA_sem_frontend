import "./Scroller.scss"

const Scroller = ({data, alterImage}) => {

    return <ol className="scroller">
        {data && data.map((a, index) => <li className="item" key={index}>
            <div>
                <img src={a[2] ? ("http://image.tmdb.org/t/p/w92/" + a[2]) : alterImage} alt={a[1]}></img>
            </div>
            <div className="padding-element--horizontal">
                <p>{a[0]}</p>
                <p>{a[1]}</p>
            </div>
        </li>)}
    </ol>
}

export default Scroller;