const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    return userswithsamename.length > 0;
};

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password,
            username: username
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in " + username);
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  let review = req.query.review;

  if (!isbn || !username || !review) {
    return res.status(400).json({ message: "Error: Invalid request!" });
  }

  if (!books[isbn]) {
    return res.status(400).json({ message: "Error: Invalid ISBN!" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added successfully!"
  });
});
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization.username;

    if(!isbn||!username){
      return res.status(400).json({message: "Error: Invalid request!"});
    }
    if(!isValid(username)){
      return res.status(400).json({message: "Error: Invalid username!"});   
    }
    if(!books[isbn]){
      return res.status(400).json({message: "Error: Invalid ISBN!"});
    }
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully!"
    
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
