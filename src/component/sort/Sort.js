import "../themes/select.scss"

const Sort = ({options, selectedItemHandler}) => {
    return <div className="flex flex--centered">
        <span className="margin-element">Sort by: </span>
        <select  onChange={e => selectedItemHandler(e.target.value)}>
            {options.map(o =><option key={o.id} value={o.value}>{o.name}</option>)}
        </select>
    </div>
}
export default Sort;

export const movieSortOptions = [
    { id: 1, name: "Title A-Z", value: "title,asc" },
    { id: 2, name: "Title Z-A", value: "title,desc" },
    { id: 3, name: "Newest release date", value: "release_date,desc" },
    { id: 4, name: "Oldest realease date", value: "release_date,asc" },
    { id: 5, name: "Longest runtime", value: "runtime,desc" },
    { id: 6, name: "Shortest runtime", value: "runtime,asc" },
]