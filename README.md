# Startup Network Finder Application

## Overview

The Startup Network Finder Application is a full-stack platform designed to help startup founders connect with investors or mentors based on specific criteria. Leveraging AI-powered search through the Gemini API, the platform matches user queries with relevant entries from our database. It also includes a robust credit system to manage search requests and an automated email-based recharge mechanism.

## Features

- **User Authentication:**  
  Users log in using their Gmail account via Google OAuth.

- **AI-Powered Search:**  
  After logging in, users can enter queries into a search box. The backend then forwards the user query along with investor/mentor data from the database to the Gemini API. The API processes the information and returns the best matching response.

- **Credit System:**  
  - Every new user starts with 5 credits.
  - Each search request consumes 1 credit.
  - When a user’s credits drop to 0, an error message is returned:
    > "Your credits are exhausted. Please check your email to recharge."
  - An automated email is sent to the user prompting them to send an email for a recharge.

- **Recharge System:**  
  - Users can recharge credits by sending an email with the subject "recharge 5 credits".
  - The backend uses the Gmail API to detect such emails and adds 5 credits to the user's account.
  - If a user attempts to recharge more than once while having some credits, they receive an email stating:
    > "Sorry, we are not offering additional credits at this time."

## Database Structure

### Investors & Mentors Table (Example Data)

| Name   | Category   | Type     |
|--------|------------|----------|
| Ria    | AI         | Investor |
| Martin | Blockchain | Mentor   |
| Leo    | EV         | Mentor   |
| Zack   | Ecommerce  | Mentor   |
| Honia  | Video      | Investor |
| ...    | ...        | ...      |

### Users Table

| Email               | Credits | Timestamp               |
|---------------------|---------|-------------------------|
| Georgie@gmail.com   | 5       | 2025-02-02T00:02:02     |
| Hash@gmail.com      | 5       | 2025-02-03T05:28:27     |

## Tech Stack

- **Frontend:** React.js or Next.js
- **Backend:** Node.js (Express/Nest.js)
- **Database:** MongoDB (or PostgreSQL)
- **APIs:** Gemini API for AI-powered search, Gmail API for detecting recharge emails
- **Authentication:** Google OAuth

## How It Works

1. **User Login:**  
   Users sign in using their Gmail account. After a successful login, a session is established and the user is credited with 5 search credits.

2. **Search Functionality:**  
   - Users enter a query in the search box.
   - The frontend sends the query to the backend.
   - The backend forwards the query along with relevant database entries to the Gemini API.
   - The Gemini API analyzes the data and returns a matching response, which is then displayed to the user.

3. **Credit Deduction:**  
   Each search request deducts 1 credit from the user’s balance. If credits reach 0, the system prompts the user to recharge via email.

4. **Credit Recharge:**  
   - When a user sends an email with the subject "Recharge 5 credits," the backend detects it using the Gmail API and adds 5 credits to the user’s account.The backend run a cronjob every 10 minutes to detect the new emails with the given subject
   - If a user attempts a second recharge, an appropriate message is returned.

## Installation & Setup

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/farhankhan0511/Startup-Network-Finder.git
   cd Startup-Network-Finder/backend
