import "../themes/input.scss"
import "./Search.scss"

const Search = ({onChangeHandler}) => {
    return <div className="search flex flex--centered">
        <span className="margin-element">Search: </span>
        <input type="text" onChange={onChangeHandler}></input>
    </div>
}

export default Search;