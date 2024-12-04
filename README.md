# appvg
Lägg till en frontend som interagerar med ditt API.

<<<<<<< HEAD
Express Authentication API
This is a simple Express API for user authentication and management. It includes functionality for creating users, logging in, fetching user data, and accessing protected routes with JWT-based authentication.

Features
User Creation: Create a new user with a hashed password.
Login: Log in using a username and password, with JWT token generation.
Get User by ID: Fetch user details by their unique ID.
Protected Route: Access a protected route only with a valid JWT token.
Requirements
Node.js
MongoDB (MongoDB Atlas or a local MongoDB instance)
dotenv to manage environment variables
Installation
Step 1: Clone the repository
bash
Kopiera kod
git clone https://github.com/yourusername/express-auth-api.git
cd express-auth-api
Step 2: Install dependencies
bash
Kopiera kod
npm install
Step 3: Set up environment variables
Create a .env file in the root directory of the project and define the necessary environment variables:

env
Kopiera kod
MONGO_URI=mongodb://localhost:27017/yourdbname  # Or MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_here
Step 4: Start the server
bash
Kopiera kod
npm start
The server will be running on http://localhost:5000.

Endpoints
1. Create User
URL: /users
Method: POST
Request Body:
json
Kopiera kod
{
  "username": "user1",
  "password": "password123"
}
Response:
Success: 201 Created with the new user details.
Failure: 400 Bad Request with a message indicating the error (e.g., "User already exists").
2. Login
URL: /login
Method: POST
Request Body:
json
Kopiera kod
{
  "username": "user1",
  "password": "password123"
}
Response:
Success: 200 OK with a JWT token:
json
Kopiera kod
{
  "token": "your_jwt_token"
}
Failure: 400 Bad Request with the message "Invalid credentials".
3. Get User by ID
URL: /users/:id
Method: GET
Response:
Success: 200 OK with the user details.
Failure: 404 Not Found if the user doesn't exist.
4. Protected Route
URL: /protected
Method: GET
Request Header:
bash
Kopiera kod
Authorization: Bearer your_jwt_token
Response:
Success: 200 OK with secret data:
json
Kopiera kod
{
  "secretData": "This is some secret data",
  "user": { ...userDetails }
}
Failure: 401 Unauthorized if no token is provided or 400 Bad Request if the token is invalid.
MongoDB Setup
Ensure that MongoDB is running locally or use MongoDB Atlas for cloud storage. The database will automatically be created once the server starts, if it doesn't already exist.

Example Usage (Postman)
Create a User:
Open Postman.
Send a POST request to http://localhost:5000/users.
In the body, send:
json
Kopiera kod
{
  "username": "john_doe",
  "password": "password123"
}
You should receive a response with the created user.
Login:
Send a POST request to http://localhost:5000/login.
In the body, send the login details:
json
Kopiera kod
{
  "username": "john_doe",
  "password": "password123"
}
On success, you will receive a token. Copy this token.
Access Protected Route:
Send a GET request to http://localhost:5000/protected.
In the Authorization tab in Postman, select Bearer Token and paste the JWT token.
You should receive a response with the secret data if the token is valid.
Error Handling
400 Bad Request: This is returned when required parameters are missing or if the credentials are incorrect.
401 Unauthorized: This is returned if the provided token is missing or invalid.
404 Not Found: This is returned when trying to access a user by ID that doesn't exist.
500 Internal Server Error: This is returned for unexpected server errors.
Technologies Used
Express.js: Web framework for Node.js
MongoDB: Database
Mongoose: ODM (Object Data Modeling) for MongoDB
bcryptjs: Password hashing
jsonwebtoken (JWT): For creating JSON Web Tokens to secure routes
dotenv: For loading environment variables
CORS: To handle Cross-Origin Resource Sharing
License
This project is licensed under the MIT License.

=======

Here's a `README.md` file for your project:

---

# User Authentication API

This is a Node.js application built with Express that provides basic user authentication functionality, including user creation, login, token-based authentication, and access to protected routes.

## Features

- **User Creation**: Allows users to register with a username and password.
- **Login**: Users can log in using their credentials to receive a JWT token.
- **Protected Routes**: Secured routes that can only be accessed with a valid JWT token.
- **MongoDB Integration**: Uses MongoDB to store user information.
- **Password Hashing**: Passwords are hashed using `bcryptjs` for security.

## Requirements

- **Node.js**: v14 or higher
- **MongoDB**: A MongoDB instance or MongoDB Atlas account for cloud-based database.
- **.env file**: To store sensitive environment variables such as JWT secret.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
```

### 2. Install dependencies

Navigate to the project folder and install the required packages.

```bash
cd your-repository
npm install
```

### 3. Setup `.env` file

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret
```

### 4. Run the application

Start the server by running:

```bash
npm start
```

The server will run on port `5000` or the port specified in the `.env` file.

## File Structure

```
/project-root
  ├── src/
  │   ├── config/
  │   │   └── db.js            # MongoDB connection logic
  │   ├── models/
  │   │   └── User.js           # User model schema
  ├── .env                      # Environment variables
  ├── server.js                 # Main server file (the one provided in the code)
  ├── package.json              # Project dependencies and scripts
  └── README.md                 # Project documentation
```

## Routes

- **POST** `/users`: Creates a new user with a username and password.
  - Request Body:
    ```json
    {
      "username": "newuser",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "_id": "userId",
      "username": "newuser",
      "password": "hashedPassword"
    }
    ```

- **POST** `/login`: Logs in a user and returns a JWT token.
  - Request Body:
    ```json
    {
      "username": "existinguser",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "jwtToken"
    }
    ```

- **GET** `/users/:id`: Retrieves the user by ID.
  - Response:
    ```json
    {
      "_id": "userId",
      "username": "existinguser",
      "password": "hashedPassword"
    }
    ```

- **GET** `/protected`: A protected route that requires a valid JWT token in the `Authorization` header.
  - Request Header:
    ```bash
    Authorization: Bearer <your-jwt-token>
    ```
  - Response:
    ```json
    {
      "secretData": "This is some secret data",
      "user": {
        "_id": "userId",
        "username": "existinguser",
        "password": "hashedPassword"
      }
    }
    ```

## Security

- **JWT Token**: The application uses JSON Web Tokens (JWT) for user authentication and session management. The JWT secret key is stored in the `.env` file and should be kept confidential.
- **Password Hashing**: User passwords are hashed with `bcryptjs` before being saved to the database, ensuring they are not stored in plaintext.

## Contributing

Feel free to fork the repository and submit a pull request with improvements or bug fixes.

## License

This project is licensed under the MIT License.
>>>>>>> a8c2d9620371f0d63a8fe0579228ec49553d0350
