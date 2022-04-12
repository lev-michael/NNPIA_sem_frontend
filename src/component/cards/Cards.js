import Loader from "../loader/Loader";
import Pagination from "../pagination/Pagination";
import Search from "../search/Search";
import Sort from "../sort/Sort";
import "./Card.scss"
import Card from "./Card";


const Cards = ({ data, currentPage, totalPages, setPage, sortHandler, sortOptions, redirectToItem, searchHandler, altImage, isPending }) => {
    return <div className="list">
        <div className="flex flex--justify-center flex--wrap">
            <Search onChangeHandler={e => searchHandler(e.target.value)}></Search>
            <Sort options={sortOptions} selectedItemHandler={sortHandler}></Sort>
        </div>
        {isPending && <Loader/>}
        <div className="grid">
            {data && data.map(d => <Card onClickHandler={redirectToItem} key={d.id} data={d} altImage={altImage}></Card>)}
        </div>
        <Pagination currentPage={currentPage} lastPage={totalPages} setPageHandler={setPage}></Pagination>
    </div>

}

export default Cards;