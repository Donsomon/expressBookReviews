const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
      const bookData = await Promise.resolve(books);
      res.json(bookData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unable to retrieve books");
    }
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {

    try {
        let isbn = req.params.isbn;
        const bookISBNData = await Promise.resolve(books[isbn]);
        res.json(bookISBNData);

      } catch (error) {
        console.error(error);
        res.status(500).send("Unable to retrieve books");
      }
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
    // Retrieve the ISBN parameter from the request URL, match the fetched books's details and buffer it into a variable
    let isbn = req.params.isbn;
    let match = books[isbn];

    res.send(match.reviews || {});
});

module.exports.general = public_users;
