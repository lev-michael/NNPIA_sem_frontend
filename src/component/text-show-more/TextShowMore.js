import { useState } from 'react';
import "./TextShowMore.scss"

function TextShowMore({ text, limit = 250 }) {
    const [showMore, setShowMore] = useState(false);

    return <div className='text text--small'>
        {text && <div>
            {showMore || text.length < limit ? text : `${text.substring(0, limit)}...`}
        </div>}
        {text && text.length > limit && <span className="show-more-button" onClick={e => setShowMore(prev => !prev)}>(Show {showMore ? "less" : "more"})</span>}
    </div>;
}

export default TextShowMore;