# Booking API

A simple RESTful booking API built with **Node.js**, **Express**, **SQLite**, and **JWT authentication**.  
Includes user registration & login, services, and appointment booking.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/abd1rahmann/booking-api.git
cd booking-api
2. Install dependencies
npm install
3. Environment setup
Copy the example environment file and edit it:

copy .env.example .env   # Windows
# or
cp .env.example .env     # macOS/Linux
Fill in your .env:

PORT=3000
JWT_SECRET=your_super_secret_key
NODE_ENV=development
4. Initialize the database
Kopiera
npm run db:reset
This will create data.sqlite and seed it with example services.

5. Run the server
npm run dev
The API will start on:

http://localhost:3000
