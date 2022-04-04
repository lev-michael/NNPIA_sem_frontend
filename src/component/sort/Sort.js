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