/*
 * http://localhost:3000/api/medicine?limit=1&page=1&sortBy=manufacturer&order=desc&searchText=cet
 */
/**
 *
 * @param {*} model
 * @param {Object} otherParams
 * @param {*} req
 */
const paginatedResults = async (model, otherParams, req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const select = otherParams.select === undefined ? [] : otherParams.select;
  const order = req.query.order;
  const params = buildSearchParameters(
    req.query.searchText,
    otherParams.searchableField,
    otherParams.filterBy
  );
  var sort = {};
  sort[req.query.sortBy] = order;
  var numberOfData = await model.find(params).countDocuments();
  const totalNumberOfPage = Math.ceil(numberOfData / limit);

  const queryResult = await model
    .find(params)
    .skip(startIndex)
    .limit(limit)
    .sort(sort)
    .select(select)
    .exec();
  const results = {};

  if (startIndex > 0) results.prevPage = page - 1;
  results.currentPage = page;
  if (endIndex < numberOfData) results.nextPage = page + 1;

  results.totalNumberOfPage = totalNumberOfPage;
  results.currentPageData = queryResult.length;
  results.totalData = numberOfData;
  results.data = queryResult;
  if (totalNumberOfPage < page) {
    results.data = [];
  }
  return results;
};

const buildSearchParameters = (text, searchableField, filterParams) => {
  const params = {};
  for (const items in filterParams) {
    params[items] = filterParams[items];
  }
  if (!text) {
    return params;
  }
  const searchRegix = new RegExp(text, "i");
  const arr = [];
  searchableField.forEach((el) => {
    let orCondition = {};
    orCondition[el] = searchRegix;
    arr.push(orCondition);
  });
  params.$or = arr;

  return params;
};

module.exports = paginatedResults;
