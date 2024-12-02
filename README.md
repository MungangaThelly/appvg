# appvg
Lägg till en frontend som interagerar med ditt API.


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