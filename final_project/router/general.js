const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	// Send JSON response with formatted books data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the ISBN parameter from the request URL and send the corresponding <VAR>'s details
    let isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let match = [];

    let keys = Object.keys(books);

    keys.forEach(function (key) {
        if (books[key].author === author) {
            match.push(books[key]);
        }
    });

    res.send(JSON.stringify(match));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let match = [];

    let keys = Object.keys(books);

    keys.forEach(function (key) {
        if (books[key].title === title) {
            match.push(books[key]);
        }
    });

    res.send(JSON.stringify(match));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the ISBN parameter from the request URL and send the corresponding <VAR>'s details
    let isbn = req.params.isbn;
    let match = books[isbn];

    res.send(match.reviews || {});
});

module.exports.general = public_users;
