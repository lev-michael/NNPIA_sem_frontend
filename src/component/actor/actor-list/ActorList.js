import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cards from "../../cards/Cards";
import altImage from "../../../img/person.jpg"

const ActorList = () => {
    const [actors, setActors] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchedText, setSearchedText] = useState("");
    const [sort, setSort] = useState("name,asc");

    const history = useHistory();

    const options = [
        { id: 1, name: "Name A-Z", value: "name,asc" },
        { id: 2, name: "Name Z-A", value: "name,desc" },
        { id: 3, name: "Youngest", value: "birthday,desc" },
        { id: 4, name: "Oldest", value: "birthday,asc" },
    ]

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/person/actors/list?page=${currentPage - 1}&size=20&sort=${sort}&query=${searchedText}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(res => {
                setTotalPages(res.result.totalPages)
                setActors(res.result.content)
                setError(null)
                window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                })
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, [currentPage, searchedText, sort])


    const searchHandler = (text) => {
        setSearchedText(text);
    }

    const setPage = (page) => {
        if (page > totalPages) {
            setCurrentPage(totalPages);
        }
        if (page < 0) {
            setCurrentPage(0);
        }
        setCurrentPage(page);
    }

    const sortHandler = (value) => {
        setSort(value)
    }

    const redirectToActorHandler = (personId) => {
        history.push("/actors/" + personId);
    };
    const redirectToAddActorHandler = () => {
        history.push("/actor/add");
    };

    return <div className="actor-detail">
        <div className="error">{error}</div>
        <h2 cl>Actor list</h2>
        <Cards data={actors} currentPage={currentPage} totalPages={totalPages} setPage={setPage}
            sortOptions={options} sortHandler={sortHandler} redirectToItem={redirectToActorHandler}
            searchHandler={searchHandler} altImage={altImage} isPending={isPending} addNewHandler={redirectToAddActorHandler}></Cards>
    </div> 
} 
export default ActorList;