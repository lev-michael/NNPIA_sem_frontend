import "./Card.scss"

function Card({ data, onClickHandler, altImage }) {
    return <div className="list-item">
        <div className="image-container" onClick={e => onClickHandler(data.id)}>
            <img src={data.img ? ("http://image.tmdb.org/t/p/w185/" + data.img) : altImage} alt={data.title}></img>
            <div className='overlay flex flex--justify-center'>
                {data && data.title}
                {data && data.name}
            </div>
        </div>
    </div>
}
export default Card;