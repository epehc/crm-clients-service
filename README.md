# crm-clients-service
 
## Description

The CRM Clients Service is a Node.js application built with Express and TypeScript. It provides a RESTful API for managing client information and client contacts in a CRM system. The application uses Sequelize for database interactions and Swagger for API documentation.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Development](#development)
  - [Production](#production)
  - [Docker](#docker)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Testing](#testing)

## Features

- Manage client information
- API documentation with Swagger
- Database integration with Sequelize
- Logging with Winston

## Prerequisites

- Node.js (version 18 or higher)
- npm (version 7 or higher)
- Docker (optional, for containerization)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/epehc/crm-clients-service.git
   cd crm-clients-service
2. Install dependencies:  
    ```sh
    npm install
3. Create a .env file in the root directory and add your database configuration:  
    ```sh
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    DB_HOST=your_host
    DB_PORT=your_port

## Running the Application

### Development

To run the application in development mode, use the following command:

```sh
npm run dev
```

### Production

To run the application in production mode, use the following command:

```sh
npm run build
npm start
```

### Docker

To run the application using Docker:

1. Build the Docker image:
   ```sh
   docker build -t crm-candidates-service .
2. Run the Docker container:
   ```sh
   docker run -p 4000:4000 --env-file .env crm-candidates-service
   
## API Documentation

The API documentation is available at /docs when the application is running. It is generated using Swagger.

## Environment Variables

The application uses the following environment variables:

- `DB_DATABASE`: The name of the database
- `DB_USERNAME`: The username for the database
- `DB_PASSWORD`: The password for the database
- `DB_HOST`: The host of the database
- `DB_PORT`: The port of the database

## Scripts

- `npm run dev`: Run the application in development mode
- `npm run build`: Build the application
- `npm start`: Run the application in production mode
- `npm run test:unit`: Run unit tests
- `npm run test:integration`: Run integration tests
- `npm run test:all`: Run all tests

## Project Structure

The project structure is as follows:

```
crm-clients-service/
├── src/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
├── test/
├── Dockerfile
├── package.json
```
