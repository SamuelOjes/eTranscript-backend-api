const advQueriesResults = (model, populate) => async (req, res, next) => {
    // BUILD QUERY
    // 1) FILTERING
    const queryObj = {
        ...req.query
    };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt|in)\b/g,
        (match) => `$${match}`
    );

    // Finding Query
    let query = model.find(JSON.parse(queryStr));

    // Selecting and Limiting Fields
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
    } else {
        query = query.select("-__v");
    }

    // Sorting Fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //   To Populate
    if (populate) {
        query = query.populate(populate);
    }

    // Query Execution
    const results = await query;

    //  Pagination Result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.advQueriesResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };

    next();
};

module.exports = advQueriesResults;