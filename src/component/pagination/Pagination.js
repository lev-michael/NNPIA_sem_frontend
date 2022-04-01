import { useEffect, useState } from "react";
import "./Pagination.scss"

const Pagination = ({ currentPage, lastPage, setPageHandler }) => {

    const [paginationRange, setPaginationRange] = useState([]);
    
    useEffect(() => {
        const totalPageNumbers = 5;
        if (totalPageNumbers >= lastPage) {
            setPaginationRange(range(1, lastPage));
        }

        const leftSiblingIndex = Math.max(currentPage - 1, 1);
        const rightSiblingIndex = Math.min(
            currentPage + 1,
            lastPage
        );

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < lastPage - 2;

        const firstPageIndex = 1;
        const lastPageIndex = lastPage;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * 1;
            let leftRange = range(1, leftItemCount);
            setPaginationRange([...leftRange, lastPage]);
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * 1;
            let rightRange = range(
                lastPage - rightItemCount + 1,
                lastPage
            );
            setPaginationRange([firstPageIndex, ...rightRange]);
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            setPaginationRange([firstPageIndex, ...middleRange, lastPageIndex]);
        }
    }, [lastPage, currentPage]);

    const range = (start, end) => {
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    };

    return <div className="pagination">
        {paginationRange && paginationRange.map(page => {
            return<button key={page} onClick={e => setPageHandler(page)}
                className={`${currentPage === (page) ? "pagination--active" : ""}`}>
                {page === 1 && currentPage > 3 && "First"}
                {(page !== 1 || currentPage < 4) && (page !== lastPage || currentPage > (lastPage-4)) && page}
                {page === lastPage && currentPage < (lastPage-3) && "Last"}
            </button>
        })}
    </div>
}

export default Pagination;