const dbConnection = require('./mongodb');
const erros = require('./errors');
const { ObjectId } = require('mongodb')

const createArticle = async (res, req) => {
    const data = req.body;
    if (!data.title || !data.content || !data.pages) {
        throw new erros.BadRequestError('Wrong fields or field types');
    }
    const connection = await dbConnection.connect();
    const query = { _id: ObjectId(req.queryParams.bookId) };
    const newArticle = {
        _id: new ObjectId(),
        title: data.title,
        content: data.content,
        pages: Number(data.pages),
    }
    connection.collection('books').findOneAndUpdate(query, { $push: { articles: newArticle } }, function (err, result) {
        if (err) {
            throw new erros.InternalServerError('cound not create article');
        }
        if (result.ok) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newArticle));
        } else {
            res.statusCode = 204;
            res.setHeader('Content-Type', 'application/json');
            res.end();
        }
    })
}


const getArticle = async (res, req) => {
    console.log("get article");
    console.log(req.queryParams);
    const connection = await dbConnection.connect();
    const query = { _id: ObjectId(req.queryParams.bookId) };
    connection.collection('books').findOne(query, function (err, result) {
        if (err) {
            throw new erros.InternalServerError('cound not get all the book');
        } else {
            const response = req.queryParams.articleId ? result.articles.filter(x => x._id == req.queryParams.articleId) : result.articles
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        }
    })
}


const deleteArticle = async (res, req) => {
    const connection = await dbConnection.connect();
    const query = { _id: ObjectId(req.queryParams.bookId) };
    const newValues = { $pull: { articles: { _id: ObjectId(req.queryParams.articleId) } } }
    connection.collection('books').updateOne(query, newValues, function (err, response) {
        if (err) {
            throw new erros.InternalServerError('cound not create article');
        }
        res.statusCode = 204;
        res.setHeader('Content-Type', 'application/json');
        res.end();

    })
}

const updateArticle = async (res, req) => {
    const connection = await dbConnection.connect();
    const query = { _id: ObjectId(req.queryParams.bookId), "articles._id": ObjectId(req.queryParams.articleId) };
    const newValues = { $set: { "articles.$.title": "test" } }
    if (req.body.title) { newValues.$set["articles.$.title"] = req.body.title; }
    if (req.body.content) { newValues.$set["articles.$.content"] = req.body.content }
    if (req.body.pages) { newValues.$set["articles.$.pages"] = req.body.pages; }
    connection.collection('books').updateOne(query, newValues, function (err, response) {
        if (err) {
            throw new erros.InternalServerError('cound not update the article');
        }
        if (response.matchedCount) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end("updated");
        } else {
            res.statusCode = 204;
            res.setHeader('Content-Type', 'text/plain');
            res.end();
        }
    })
}

module.exports.createArticle = createArticle
module.exports.getArticle = getArticle
module.exports.deleteArticle = deleteArticle
module.exports.updateArticle = updateArticle