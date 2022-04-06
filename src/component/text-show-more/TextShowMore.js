import { useState } from 'react';

function TextShowMore({text}) {
    const [showMore, setShowMore] = useState(false);

    return <div>
        {showMore ? text : `${text.substring(0, 250)+"..."}`}
        <button className="button" style={{display: "inline-block"}} onClick={e=>setShowMore(prev=>!prev)}>Show {showMore? "less":"more"}</button>
    </div>;
}

export default TextShowMore;