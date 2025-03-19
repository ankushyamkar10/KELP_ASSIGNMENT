# CSV to JSON Converter API

## Overview

This project is a CSV to JSON converter API built using Node.js and Express.js. The API reads a CSV file from a configurable location, converts it into JSON, and uploads the data into a PostgreSQL database. Additionally, it calculates the age distribution of users and prints a report on the console.

## Features

- Read CSV file and convert it into JSON.
- Extract mandatory properties: `name.firstName`, `name.lastName`, and `age`.
- Store other properties as `additional_info` in a JSONB column.
- Upload processed data into a PostgreSQL database.
- Compute age distribution and print a report.

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL (v15 recommended)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/ankushyamkar10/KELP_ASSIGNMENT.git
   cd KELP_ASSIGNMENT
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
    PORT=0000
    DB_HOST=******
    DB_PORT=****
    DB_USER=****
    DB_PASSWORD=********
    DB_NAME=****
   ```

## Usage

### Start the Application

```sh
npm start
```

### Endpoints

- **Upload CSV Data** (Triggers CSV processing and DB upload)
  ```
  POST /api/users
  ```

### Database Schema

```sql
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INT NOT NULL,
    address JSONB,
    additional_info JSONB
);
```

## Age Distribution Report

Once the data is uploaded, the system calculates and prints the age distribution:

```
Age-Group % Distribution
< 20    20%
20-40   45%
40-60   25%
> 60    10%
```

## Assumptions

- CSV headers will always be present.
- The firstName and lastName are concatenated to form the `name` column.
- Any property beyond `name.firstName`, `name.lastName`, and `age` is stored in `additional_info`.
- The number of records in the file can exceed 50,000.
- Infinite depth properties will be handled by flattening.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- TypeScript

## License

This project is licensed under the MIT License.
