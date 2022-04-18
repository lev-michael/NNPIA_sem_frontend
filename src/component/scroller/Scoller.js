import "./Scroller.scss"
import moment from "moment"
import "react-sweet-progress/lib/style.css";
import ProgressCircle from "../progress-circle/ProgressCircle";
import { useState } from "react";
import AddActorModal from "../actor/add-person-modal/AddActorModal";
import AddCrewModal from "../actor/add-person-modal/AddCrewModal";
import AddMovieActorModal from "../movie/add-movie-modal/AddMovieActorModal";
import AddMovieCrewModal from "../movie/add-movie-modal/AddMovieCrewModal";
import { useAuth } from "../AuthContext";

const Scroller = ({ data, alterImage, redirectHandler, addActorHandler, addCrewHandler, addMovieActorHandler, addMovieCrewHandler, removeHandler }) => {
    const [actorModalIsOpen, setActorModalIsOpen] = useState(false);
    const [crewModalIsOpen, setCrewModalIsOpen] = useState(false);
    const [movieActorModalIsOpen, setMovieActorModalIsOpen] = useState(false);
    const [movieCrewModalIsOpen, setMovieCrewModalIsOpen] = useState(false);
    const { userDetail } = useAuth()


    const openModal = () => {
        if (addActorHandler)
            setActorModalIsOpen(true);
        if (addCrewHandler)
            setCrewModalIsOpen(true);
        if (addMovieActorHandler)
            setMovieActorModalIsOpen(true);
        if (addMovieCrewHandler)
            setMovieCrewModalIsOpen(true);
    }

    const closeModal = () => {
        if (addActorHandler)
            setActorModalIsOpen(false);
        if (addCrewHandler)
            setCrewModalIsOpen(false);
        if (addMovieActorHandler)
            setMovieActorModalIsOpen(false);
        if (addMovieCrewHandler)
            setMovieCrewModalIsOpen(false);
    }

    const remove = (event, id) =>{
        event.stopPropagation();
        event.preventDefault();
        removeHandler(id);
    }

    return <ol className="scroller">
        {(addActorHandler || addCrewHandler || addMovieActorHandler || addMovieCrewHandler) &&  userDetail && userDetail.role === "ADMIN" &&<li className="item">
            <div className="item--add flex flex--centered" onClick={openModal}>
                <div className="circle"></div>
            </div>
        </li>}
        {addActorHandler && <AddActorModal addHandler={addActorHandler} closeModal={closeModal} modalIsOpen={actorModalIsOpen}></AddActorModal>}
        {addCrewHandler && <AddCrewModal addHandler={addCrewHandler} closeModal={closeModal} modalIsOpen={crewModalIsOpen}></AddCrewModal>}
        {addMovieActorHandler && <AddMovieActorModal addHandler={addMovieActorHandler} closeModal={closeModal} modalIsOpen={movieActorModalIsOpen}></AddMovieActorModal>}
        {addMovieCrewHandler && <AddMovieCrewModal addHandler={addMovieCrewHandler} closeModal={closeModal} modalIsOpen={movieCrewModalIsOpen}></AddMovieCrewModal>}
        {data && data.map((item, index) =>
            <li className="item" key={index} onClick={e => redirectHandler(item.id)}>
                <div>
                    <img src={item.img ? ("http://image.tmdb.org/t/p/w300/" + item.img) : alterImage} alt={item.name}></img>
                </div>
                <div className="flex flex--space-between">
                    <div className="margin-element--left-small">
                        {item.role !== undefined && <p className="text text--label">{item.role}</p>}
                        {item.name !== undefined && <p className="text text--label">{item.name}</p>}
                        {item.title !== undefined && <p className="text text--label">{item.title}</p>}
                        {item.release_date !== undefined && <p className="text text--label">{moment(item.release_date).format("DD. MM. YYYY")}</p>}
                    </div>
                    <div className="margin-element--top-small">
                        {removeHandler && userDetail && userDetail.role === "ADMIN" && <div className="button button--small button--red" onClick={e => remove(e, item.id)}>X</div>}
                        {item.avgScore && <ProgressCircle score={item.avgScore} />}
                    </div>
                </div>
            </li>
        )}
    </ol>
}

export default Scroller;