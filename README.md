# Ethereum Vulnerabilities Demonstration  

This project implements and demonstrates **three common Ethereum smart contract vulnerabilities**, along with example fixes. All contracts are deployed and tested on a **Hardhat local network**.  

---

## Vulnerabilities Covered  

### 1. Reentrancy Attack  
- **Description:**  
  Occurs when a smart contract updates its state variables **after** making an external call (e.g., sending funds), allowing a malicious contract to repeatedly call the vulnerable function before the balance is updated.  
- **Example:**  
  - `IOUBank.sol` – Banking contract updates balance after sending ETH.  
  - `ReentrancyAttacker.sol` – Malicious contract exploits the reentrancy.  
- **Test Script:** `test.js`  
- **Fix:**  
  Update state variables **before** making external calls (Checks–Effects–Interactions pattern).  

---

### 2. Denial of Service (DoS) Attack  
- **Description:**  
  DoS attacks can freeze contract operations or force excessive gas spending, preventing normal functionality.  
- **Example:**  
  - `DOSAuction.sol` – Auction contract refunds the previous highest bidder **before** updating the current highest bid.  
  - `DOSAuctionCheater.sol` – Malicious contract blocks refunds, freezing the auction and staying as the highest bidder.  
- **Test Script:** `test.js`  
- **Fix:**  
  Use a **withdraw pattern** where users manually withdraw their funds instead of automatic refunds.  

---

### 3. Integer Underflow / Overflow  
- **Description:**  
  Happens when arithmetic exceeds a variable’s maximum or minimum limit, wrapping around unexpectedly.  
- **Example:**  
  - `IOUBank.sol` (with `uint8`) demonstrates integer overflow on small values.  
- **Test Script:** `test.js`  
- **Fix:**  
  Modern Solidity versions include built-in overflow/underflow checks. Use `uint256` and enable compiler safety checks.  

---

## Tech Stack  
- **Language:** Solidity  
- **Framework:** Hardhat  
- **Scripting:** JavaScript (Node.js)  
- **Blockchain:** Ethereum (local testnet)  
