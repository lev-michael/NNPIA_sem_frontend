import moment from "moment";
import ProgressCircle from "../progress-circle/ProgressCircle";
import "./Card.scss"

function Card({ data, onClickHandler, altImage }) {
    return <div className="list-item">
        <div className="image-container" onClick={e => onClickHandler(data.id)}>
            <img src={data.img ? ("http://image.tmdb.org/t/p/w300/" + data.img) : altImage} alt={data.title}></img>
            <div className='overlay flex flex--justify-center'>
                {data && data.title}
                {data && data.name}
            </div>
        </div>
        <div className="card-label flex flex--centered flex--space-between">
            <div style={{textAlign: "left"}}>
                {data && data.title !== undefined && <div className="text--label">{data.title}</div>}
                {data && data.release_date !== undefined && <div className="text--label">{moment(data.release_date).format("DD. MM. YYYY")}</div  >}
                {data && data.name !== undefined && <div className="text--label">{data.name}</div>}
                {data && data.birthday !== undefined && <div className="text--label">{moment(data.birthday).format("DD. MM. YYYY")}</div  >}
            </div>
            {data.title && <div>
                <ProgressCircle score={data.avgScore} />
            </div>}
        </div>
    </div>
}
export default Card;