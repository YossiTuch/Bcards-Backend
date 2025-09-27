# Bcards Backend

A comprehensive Node.js/Express backend API for a Business Cards management application. This project provides a robust foundation for managing business cards with user authentication, card CRUD operations, and data persistence using MongoDB.

## 🚀 Features

- **User Management**: Complete user registration, authentication, and profile management
- **Business Card Management**: Full CRUD operations for business cards
- **JWT Authentication**: Secure token-based authentication system
- **Database Support**: MongoDB with both local and Atlas cloud support
- **Request Logging**: Comprehensive request logging using Morgan
- **Data Validation**: Joi-based validation for all inputs
- **Error Handling**: Centralized error handling and response management
- **CORS Support**: Cross-origin resource sharing configuration
- **Data Seeding**: Automatic initial data generation for development
- **Environment Configuration**: Flexible configuration management for different environments

## 📋 Requirements
- Node.js 18+
- npm 9+
- MongoDB (optional for local dev)

## 📦 Dependencies

### Core Dependencies
- **express** (^5.1.0): Web framework for Node.js
- **mongoose** (^8.17.1): MongoDB object modeling for Node.js
- **jsonwebtoken** (^9.0.2): JWT token generation and verification
- **bcryptjs** (^3.0.2): Password hashing and comparison
- **joi** (^18.0.0): Data validation and schema validation
- **cors** (^2.8.5): Cross-Origin Resource Sharing middleware
- **morgan** (^1.10.1): HTTP request logger middleware
- **config** (^4.1.1): Configuration management
- **dotenv** (^17.2.2): Environment variable loader
- **lodash** (^4.17.21): Utility library
- **chalk** (^4.1.1): Terminal string styling

### Development Dependencies
- **nodemon** (^3.1.10): Development server with auto-restart

## 🏗️ Project Structure
The application code and `package.json` are located under the `src/` directory.

```
Bcards Backend/
├── README.md
└── src/
    ├── server.js                 # Main application entry point
    ├── package.json              # Dependencies and scripts
    ├── router/
    │   └── router.js             # Main router configuration
    ├── config/                   # Environment-specific configurations
    │   ├── default.json
    │   ├── development.json
    │   └── production.json
    ├── DB/                       # Database connection services
    │   ├── dbService.js
    │   └── mongoDB/
    │       ├── connectLocally.js
    │       └── connectToAtlasDb.js
    ├── auth/                     # Authentication services
    │   ├── authService.js
    │   └── Providers/
    │       └── jwt.js
    ├── users/                    # User management module
    │   ├── models/
    │   │   ├── mongodb/
    │   │   │   ├── User.js
    │   │   │   ├── Name.js
    │   │   │   ├── Address.js
    │   │   │   └── Image.js
    │   │   └── usersAccessDataService.js
    │   ├── routes/
    │   │   └── usersController.js
    │   ├── services/
    │   │   └── usersService.js
    │   ├── validations/
    │   │   ├── userValidationService.js
    │   │   └── Joi/
    │   │       ├── loginValidation.js
    │   │       ├── registerValidation.js
    │   │       └── userUpdateValidation.js
    │   └── helpers/
    │       ├── bcrypt.js
    │       ├── MongooseValidators.js
    │       └── normalizeUser.js
    ├── cards/                    # Business cards management module
    │   ├── models/
    │   │   ├── mongodb/
    │   │   │   ├── Card.js
    │   │   │   ├── Address.js
    │   │   │   └── Image.js
    │   │   └── cardsDataAccessService.js
    │   ├── routes/
    │   │   └── cardController.js
    │   ├── services/
    │   │   └── cardService.js
    │   ├── validations/
    │   │   ├── cardValidationService.js
    │   │   └── Joi/
    │   │       └── validateCardWithJoi.js
    │   └── helpers/
    │       ├── generateBizNumber.js
    │       ├── mongooseValidators.js
    │       └── normalizeCard.js
    ├── initialData/              # Data seeding services
    │   ├── initialData.json
    │   └── initialDataService.js
    ├── logger/                   # Logging services
    │   ├── loggerService.js
    │   └── loggers/
    │       └── morganLogger.js
    ├── middlewares/              # Custom middleware
    │   └── cors.js
    └── utils/                    # Utility functions
        ├── dateTimeStr.js
        └── errorHandler.js
```

## Installation
Run all commands from the `src` directory.

```bash
cd src
npm install
```

## Configuration

- App config is in `src/config/*.json` and is selected by `NODE_ENV`.
  - `development.json`: default for local development (connects to local MongoDB).
  - `production.json`: used when `NODE_ENV=production` (connects to Atlas).

- Environment variables (create a `.env` file in `src/`):

```bash
# For Atlas (recommended)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority

# OR if you prefer separate pieces (optional)
DB_USER=<atlasUser>
DB_PASS=<atlasPassword>
DB_HOST=<cluster-host>
DB_NAME=<database>
```

Notes:
- If your Atlas password contains special characters, URL-encode it before placing in the URI.
- By default, the app seeds initial users/cards on startup.

## Git ignore of secrets
Make sure your `.env` is not committed. If you keep `.env` under `src/`, ensure `src/.gitignore` includes:

```gitignore
.env
.env.*
!.env.example
```

If your `.env` is at the repository root, create a root `.gitignore` with the same rules.

If a `.env` was already committed, untrack it:

```bash
git rm --cached .env
git commit -m "Stop tracking .env"
```

## Running the app

All commands are from `src/`.

### Development (local MongoDB)
This uses `src/DB/mongoDB/connectLocally.js` and `development.json`.

```bash
cd src
npm run dev
```

- Exposes: `http://localhost:8181` (from `development.json`).
- Requires a local MongoDB instance at `mongodb://localhost:27017/business_card_app`.

### Production (Atlas)
This uses `src/DB/mongoDB/connectToAtlasDb.js` and `production.json`.

1) Ensure your `.env` contains a working `MONGODB_URI` (or the separate vars).
2) Whitelist your current IP in Atlas (Project → Network Access → Add IP Address). For testing you can temporarily allow `0.0.0.0/0`.
3) Start the server:

```bash
cd src
npm start
```

- Exposes: `http://localhost:9191` (from `production.json`).

## 🔧 Troubleshooting

### MongoDB Atlas Connection Issues

#### Common Error: `MongooseServerSelectionError: Could not connect to any servers...`

**Causes and Solutions:**

1. **IP Address Not Whitelisted**
   - Add your current public IP to Atlas Network Access
   - Go to Project → Network Access → Add IP Address
   - For testing, you can temporarily allow `0.0.0.0/0` (not recommended for production)

2. **DNS Resolution Issues**
   - Verify the SRV host resolves:
     ```bash
     nslookup -type=SRV _mongodb._tcp.<cluster-host>
     nslookup <cluster-host>
     ```
   - Try switching DNS servers (8.8.8.8, 1.1.1.1)
   - Temporarily disable VPN or antivirus software

3. **Authentication Problems**
   - Test connection with mongosh:
     ```bash
     mongosh "${MONGODB_URI}"
     ```
   - If password contains special characters, URL-encode them
   - Verify username and password are correct

4. **Network/Firewall Issues**
   - Check if your firewall blocks MongoDB ports (27017)
   - Try from a different network
   - Contact your IT department if on corporate network

### Application Issues

#### Server Won't Start
- **Port Already in Use**: Change port in config files or kill existing process
- **Missing Dependencies**: Run `npm install` in the `src/` directory
- **Invalid Configuration**: Check JSON syntax in config files

#### Authentication Errors
- **Invalid JWT Token**: Ensure token is included in Authorization header
- **Expired Token**: Re-login to get new token
- **Wrong Format**: Use `Bearer <token>` format

#### Database Connection Errors
- **Local MongoDB Not Running**: Start MongoDB service
- **Wrong Database Name**: Check config files for correct database name
- **Connection String Issues**: Verify MONGODB_URI format

### Development Issues

#### Nodemon Not Working
- Ensure nodemon is installed: `npm install -g nodemon`
- Check if file changes are being detected
- Try restarting the development server

#### Environment Variables Not Loading
- Ensure `.env` file is in the correct location (`src/` directory)
- Check `.env` file syntax (no spaces around `=`)
- Restart the application after changing environment variables

### Performance Issues

#### Slow Database Queries
- Check MongoDB indexes
- Use MongoDB Compass to analyze query performance
- Consider adding database indexes for frequently queried fields

#### Memory Issues
- Monitor Node.js memory usage
- Consider increasing Node.js heap size: `node --max-old-space-size=4096 server.js`

## Available npm scripts

```json
{
  "dev": "set NODE_ENV=development&& nodemon .",
  "start": "set NODE_ENV=production&& node server.js"
}
```

Windows note: scripts use Windows-friendly `set`. Run them via `npm run ...` from `cmd`, PowerShell, or Git Bash (npm handles the shell). If you need cross-platform `NODE_ENV`, consider `cross-env`.

## 🔌 API Documentation

The API provides endpoints for user management and business card operations. All routes are registered via `src/router/router.js`.

**Base URL**: `http://localhost:<PORT>` where `<PORT>` is from the active config (8181 for development, 9191 for production)

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Endpoints (`/users`)

#### Register User
- **POST** `/users`
- **Description**: Register a new user
- **Authentication**: None required
- **Body**:
  ```json
  {
    "name": {
      "first": "John",
      "last": "Doe"
    },
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "address": {
      "state": "CA",
      "country": "USA",
      "city": "San Francisco",
      "street": "123 Main St",
      "houseNumber": 123,
      "zip": "94105"
    }
  }
  ```

#### Login User
- **POST** `/users/login`
- **Description**: Authenticate user and receive JWT token
- **Authentication**: None required
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Get All Users
- **GET** `/users`
- **Description**: Retrieve all users (admin only)
- **Authentication**: Required (admin)

#### Get User by ID
- **GET** `/users/:id`
- **Description**: Retrieve specific user
- **Authentication**: Required (admin or own account)

#### Update User
- **PUT** `/users/:id`
- **Description**: Update user information
- **Authentication**: Required (admin or own account)

#### Toggle Business Status
- **PATCH** `/users/:id`
- **Description**: Toggle user's business account status
- **Authentication**: Required (admin or own account)

#### Delete User
- **DELETE** `/users/:id`
- **Description**: Delete user account
- **Authentication**: Required (admin or own account)

### Business Card Endpoints (`/cards`)

#### Get All Cards
- **GET** `/cards`
- **Description**: Retrieve all business cards
- **Authentication**: None required

#### Get Card by ID
- **GET** `/cards/:id`
- **Description**: Retrieve specific business card
- **Authentication**: None required

#### Get My Cards
- **GET** `/cards/my-cards`
- **Description**: Retrieve cards created by authenticated user
- **Authentication**: Required (business account only)

#### Get Liked Cards
- **GET** `/cards/liked-cards`
- **Description**: Retrieve cards liked by authenticated user
- **Authentication**: Required

#### Create Card
- **POST** `/cards`
- **Description**: Create new business card
- **Authentication**: Required (business account only)
- **Body**:
  ```json
  {
    "title": "Software Engineer",
    "subtitle": "Full Stack Developer",
    "description": "Experienced developer with 5+ years",
    "phone": "+1234567890",
    "email": "john@example.com",
    "web": "https://johndoe.com",
    "address": {
      "state": "CA",
      "country": "USA",
      "city": "San Francisco",
      "street": "123 Main St",
      "houseNumber": 123,
      "zip": "94105"
    }
  }
  ```

#### Update Card
- **PUT** `/cards/:id`
- **Description**: Update business card
- **Authentication**: Required (card owner only)

#### Like/Unlike Card
- **PATCH** `/cards/:id`
- **Description**: Toggle like status for a card
- **Authentication**: Required

#### Delete Card
- **DELETE** `/cards/:id`
- **Description**: Delete business card
- **Authentication**: Required (card owner or admin)

### Error Responses
All endpoints return consistent error responses:
```json
{
  "error": "Error message",
  "status": 400
}
```

### Success Responses
- **200**: Success with data
- **201**: Created successfully
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## 🌱 Data Seeding
On startup, the server automatically invokes initial data generators in `src/initialData/initialDataService.js` to create sample users and cards if the database is empty. This helps with development and testing.

## 👨‍💻 Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Project Structure
- **Models**: Database schemas and data access layers
- **Services**: Business logic and data processing
- **Controllers**: Request/response handling
- **Validations**: Input validation using Joi
- **Helpers**: Utility functions and common operations
- **Routes**: API endpoint definitions

### Adding New Features
1. Create appropriate model in the relevant module
2. Add validation schemas in the `validations/` directory
3. Implement business logic in the `services/` directory
4. Create controller endpoints in the `routes/` directory
5. Update the main router if needed
6. Add proper error handling

### Database Changes
- Always create migrations for schema changes
- Test with both local and Atlas databases
- Update initial data if needed
- Document any breaking changes

### Testing
- Test all endpoints with different user roles
- Verify authentication and authorization
- Test error scenarios and edge cases
- Use tools like Postman or curl for API testing

### Environment Management
- Never commit sensitive data (passwords, API keys)
- Use environment variables for configuration
- Test in both development and production environments
- Document any new environment variables

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the development guidelines**
4. **Test your changes thoroughly**
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Pull Request Guidelines
- Provide a clear description of changes
- Include screenshots for UI changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed

## 📝 License
ISC

## 📞 Support
For support and questions, please open an issue in the repository or contact the development team.


