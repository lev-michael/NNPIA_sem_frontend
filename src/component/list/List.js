import Pagination from "../pagination/Pagination";
import Search from "../search/Search";
import Sort from "../sort/Sort";
import "./List.scss"
import ListItem from "./ListItem";


const List = ({ data, currentPage, totalPages, setPage, sortHandler, sortOptions, redirectToItem, searchHandler, altImage }) => {
    return <div className="list">
        <div className="flex flex--justify-center">
            <Search onChangeHandler={e => searchHandler(e.target.value)}></Search>
            <Sort options={sortOptions} selectedItemHandler={sortHandler}></Sort>
        </div>
        <div className="grid">
            {data && data.map(d => <ListItem onClickHandler={redirectToItem} key={d.id} data={d} altImage={altImage}></ListItem>)}
        </div>
        <Pagination currentPage={currentPage} lastPage={totalPages} setPageHandler={setPage}></Pagination>
    </div>

}

export default List;