const dbConnection = require('./mongodb');
const erros = require('./errors');
const { ObjectId } = require('mongodb');

const createBook = async (res, req) => {
    const data = req.body;
    if (!data.name || !data.authorName || !data.genere || !Date.parse(data.releaseDate)) {
        throw new erros.BadRequestError('Wrong fields or field types');
    }
    const connection = await dbConnection.connect();
    const bookToInsert = { name: data.name, releaseDate: data.releaseDate, authorName: data.authorName, genere: data.genere }
    connection.collection('books').insertOne(bookToInsert).then(result => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.ops));
    }).catch(err => {
        console.error(err)
        throw new erros.InternalServerError('cound not save book');
    });
}

const getBooks = async (res, req) => {
    const connection = await dbConnection.connect();
    const query = {}
    if (req.queryParams.id) {
        query._id = ObjectId(req.queryParams.id);
    }
    connection.collection('books').find(query).toArray(function (err, result) {
        if (err) {
            throw new erros.InternalServerError('cound not get all the book');
        }
        if (!result) {
            throw new erros.NotFoundError('no books available')
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
        })
}

const updateBook = async (res, req) => {
    if (req.body.releaseDate && !Date.parse(req.body.releaseDate)) {
        throw new erros.BadRequestError("Wrong date format")
    } else {
        if (!req.body.name || !req.body.authorName || !req.body.genere || !Date.parse(req.body.releaseDate)) {
            throw new erros.BadRequestError('Wrong fields or field types');
        }
        const connection = await dbConnection.connect();
        const query = { _id: ObjectId(req.queryParams.id) };
        const newValues = { $set: {
            name: req.body.name,
            releaseDate: Date.parse(req.body.releaseDate),
            authorName: req.body.authorName,
            genere: req.body.genere,
        } }
        connection.collection('books').updateOne(query, newValues, function (err, response) {
            if (err) {
                throw new erros.InternalServerError('cound not update the book');
            }
            if (response.matchedCount) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end("updated");
            } else {
                throw new erros.NotFoundError('book not found')
            }
        });
    }
}


const deleteBook = async (res, req) => {
    const connection = await dbConnection.connect();
    const query = { _id: ObjectId(req.queryParams.id) };
    connection.collection('books').deleteOne(query, function (err, response) {
        if (err) {
            throw new erros.InternalServerError('cound not update the book');
        }
        if (response.deletedCount) {
            res.statusCode = 204;
            res.setHeader('Content-Type', 'application/json');
            res.end();
        } else {
            throw new erros.NotFoundError()
        }
    });
}


module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.updateBook = updateBook
module.exports.deleteBook = deleteBook