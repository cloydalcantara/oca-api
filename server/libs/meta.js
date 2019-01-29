module.exports = (
    err, 
    page, 
    count, 
    limit
) => {
    const pageCount = Math.ceil(count / limit)

    if (err) {
        return {
            status: 'ERROR',
            error: err.message
        }
    } else {
        return {
            currentPage: parseInt(page),
            previousPage: (parseInt(page) - 1 <= 0 ? null : parseInt(page) - 1),
            nextPage: (parseInt(count) > 10 && parseInt(page) != pageCount ? parseInt(page) + 1 : null ),
            perPage: limit,
            pageCount: pageCount,
            totalCount: count
        }
    }

}