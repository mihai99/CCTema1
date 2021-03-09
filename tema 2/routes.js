const bookService = require('./book-service')
const articleService = require('./article-service');
const routes = [
    {
        url: "/books",
        method: "POST",
        action: bookService.createBook
    },
    {
        url: "/books",
        method: "GET",
        action: bookService.getBooks
    },
    {
        url: "/books",
        requiredQueryParams: ["id"],
        method: "PUT",
        action: bookService.updateBook
    },
    {
        url: "/books",
        requiredQueryParams: ["id"],
        method: "DELETE",
        action: bookService.deleteBook
    },
    {
        url: "/article",
        requiredQueryParams: ["bookId"],
        method: "POST",
        action: articleService.createArticle
    },
    {
        url: "/article",
        requiredQueryParams: ["bookId"],
        method: "GET",
        action: articleService.getArticle
    },
    {
        url: "/article",
        requiredQueryParams: ["bookId", "articleId"],
        method: "DELETE",
        action: articleService.deleteArticle
    },
    {
        url: "/article",
        requiredQueryParams: ["bookId", "articleId"],
        method: "PUT",
        action: articleService.updateArticle
    }
]

module.exports.routes = routes;