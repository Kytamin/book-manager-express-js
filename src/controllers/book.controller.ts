import { Publisher } from "../models/schemas/publisher.model";
import { Category } from "../models/schemas/category.model";
import { Book } from "../models/schemas/book.model";

export class BookController {
    static async getCreatePage(req, res) {
        try {
            const categories = await Category.find();
            const publishers = await Publisher.find();
            res.render('create', { categories: categories, publishers: publishers });
        } catch (err) {
            console.log(err.message);
        }
    }

    static async createNewBook(req, res) {
        try {
            const { name, categoryID, author, keyword, publisherID } = req.body;
            let bookSearch = await Book.findOne({ name: name });
            if (!bookSearch) {
                let avatarUrl = '/upload/avatar.jpg';
                if (req.files) {
                    let avatar = req.files.avatar;
                    avatar.mv('./src/public/upload/' + avatar.name);
                    avatarUrl = '/upload/' + avatar.name;
                }
                let bookNew = new Book({
                    avatar: avatarUrl,
                    name: name,
                    author: author,
                    category: categoryID,
                    publisher: publisherID
                })
                         
                bookNew.keywords.push({ keyword: keyword });
                await bookNew.save();
            } else console.log('Book was existed!');
            res.redirect('/book')
        } catch (err) {
            console.log(err.message);
        }
    }

    static async getAllBook(req, res) {
        try {
            let size = 3;
            let page = req.query.page ? +req.query.page : 1;

            if (req.body.size) {
                size = +req.body.size;
            } else if (req.query.limit) {
                size = +req.query.limit;
            }
            let query = {};
            if (req.query.keyword && req.query.keyword !== "") {
                let keywordSearch = req.query.keyword || "";
                query = {
                    "keywords.keyword": { $regex: keywordSearch }
                }
            }
            if (req.query.publisher && req.query.publisher !== "") {
                let publisherdFind = req.query.publisher || "";
                let publisher = await Publisher.findOne({ name: { $regex: publisherdFind } })
                query = {
                    ...query,
                    publisher: publisher
                }
            }
            const allBook = await Book.find(query).populate(
                [
                    { path: "category", select: "name" },
                    { path: "publisher", select: "name" }
                ]
            );

            let totalPage = Math.ceil(allBook.length / size);
            let offset = (page - 1) * size;
            const books = await Book.find(query).populate(
                [
                    { path: "category", select: "name" },
                    { path: "publisher", select: "name" }
                ]
            ).limit(size).skip(offset);
            res.render("list", { books: books, totalPage: totalPage, pageCurrent: page, limit: size, totalItem: allBook.length });
        } catch (err) {
            res.render(err.message);
        }
    }

    static async getUpdatePage(req: any, res: any) {
        try {
            let { page, limit } = req.query;
            if (page && limit) {
                const categories = await Category.find();
                const publishers = await Publisher.find();
                const book = await Book.findOne({ _id: req.params.id }).populate(
                    [
                        { path: "category", select: "name" },
                        { path: "publisher", select: "name" }
                    ]
                );
                if (book) {
                    res.render("update", { book: book, categories: categories, publishers: publishers, pageCurrent: page, limit: limit })
                } else res.render('error');
            }
        } catch (err) {
            res.render(err.message);
        }
    }

    static async updateBook(req: any, res: any) {
        try {
            let { page, limit } = req.query;
            if (page && limit) {
                const book = await Book.findOne({ _id: req.params.id }).populate(
                    [
                        { path: "category", select: "name" },
                        { path: "publisher", select: "name" }
                    ]
                );

                book.name = req.body.name;
                book.author = req.body.author;
                book.keywords[0].keyword = req.body.keyword;
                book.category = req.body.categoryID;
                book.publisher = req.body.publisherID;
                if (req.files) {
                    let avatar = req.files.avatar;
                    avatar.mv('./src/public/upload/' + avatar.name);
                    book.avatar = '/upload/' + avatar.name;
                }
                await book.save();
                if (book) res.redirect(`/book?page=${page}&limit=${limit}`);
                else res.render('error');
            }
        } catch (err) {
            res.render(err.message);
        }
    }

    static async deleteBook(req: any, res: any) {
        try {
            let { page, limit } = req.query;
            if (page && limit && req.params.id) {
                await Book.deleteOne({ _id: req.params.id });
                res.redirect(`/book?page=${page}&limit=${limit}`)
            } else {
                res.render("error");
            }
        } catch (err) {
            res.render(err.message);
        }
    }
}