const Product = require("../models/Product");
const ITEMS_PER_PAGE = 2;

const renderProductsWithPagination = (req, res, next, route, path, pageTitle) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render(route, {
        products,
        path: path,
        pageTitle: pageTitle,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        // lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.renderProductsWithPagination = renderProductsWithPagination