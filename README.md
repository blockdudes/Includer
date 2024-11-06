# Includer - Web3 Banking System

Welcome to Includer! This repository contains the source code for Includer, a Web3 banking platform built on the Stellar blockchain to provide accessible and secure financial services. The project aims to promote financial inclusion, particularly in underserved regions like the Global South, with a focus on rural areas and households headed by women.

## Project Overview

Includer leverages Stellar’s blockchain infrastructure and integrates with MoneyGram to deliver a decentralized banking system that allows users to:
- Deposit fiat currency, converted into stablecoins for inflation-protected savings.
- Borrow and lend money directly on the platform.
- Transfer money to other users instantly.
- Securely manage private keys without requiring users to handle Web3 complexities.
- Withdraw funds through MoneyGram, converting stablecoins back to fiat.

## Features

- **User-Friendly Web3 Interface:** Simplified onboarding and account management without the need for private key management.
- **Fiat to Stablecoin Conversion:** Protect savings from inflation by converting fiat deposits into stablecoins.
- **Lending and Borrowing:** Earn interest by lending stablecoins or borrow against deposited assets.
- **Seamless Money Transfers:** Transfer funds to other users easily within the platform.
- **Integration with MoneyGram:** Cash deposits and withdrawals are available through MoneyGram's network.

## How to Run Includer Locally

To run the Includer platform locally, follow the steps below to set up both the frontend and backend.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or above)
- [NPM](https://www.npmjs.com/)

### Setting Up the Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the frontend application:**
   Open your browser and navigate to `http://localhost:3000` to see Includer in action.

### Setting Up the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Backend API should now be running.**
   By default, it will be accessible at `http://localhost:5000`.

## Technology Stack

- **Blockchain:** Stellar
- **Programming Language:** JavaScript (Node.js for backend, React for frontend)
- **Frameworks:** Express (Backend), Next.js (Frontend)
- **Database:** MongoDB (or any other preferred database)
- **Integration:** MoneyGram for fiat conversions

## Contribution Guidelines

We welcome contributions! If you'd like to help, please fork the repository, create a new branch, and submit a pull request with your changes. Make sure to follow these guidelines:
1. Use descriptive commit messages.
2. Test your code before submitting.
3. Follow the existing code style and conventions.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

If you have any questions or suggestions, feel free to reach out:
- [Your Name](mailto:your.email@example.com)
- [Project GitHub Issues](https://github.com/your-username/Includer/issues)

Let's make Web3 more accessible together!
