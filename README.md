# Auction Website

## Overview
This project is an auction website designed to monitor bids, display the highest bid, and allow a host to deduct points from the highest bidder every 30 seconds. It consists of two separate websites: one for users and another for admins. Firebase is used as the backend-as-a-service (BaaS) provider.

## Features
### User Website
- Place bids on available items.
- View real-time updates on the highest bid.
- Track remaining points and bidding history.

### Admin Website
- Monitor all ongoing auctions.
- Deduct points from the highest bidder at set intervals.
- Manage auction items and bidding rules.

## Technologies Used
- **Frontend:** React.js
- **Backend:** Firebase (Firestore, Authentication, Hosting)
- **Real-time Updates:** Firebase Realtime Database / Firestore
- **Hosting:** Firebase Hosting

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/auction-website.git
   cd auction-website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project.
   - Enable Firestore and Realtime Database.
   - Configure Authentication (Google, Email/Password, etc.).
   - Add Firebase config to `.env` or `firebaseConfig.js`.
4. Run the development server:
   ```bash
   npm start
   ```

## Usage
1. **User Side:**
   - Register/Login using Firebase authentication.
   - Browse available items and place bids.
   - Track bid status in real-time.
2. **Admin Side:**
   - Log in to the admin dashboard.
   - Monitor and manage auctions.
   - Deduct points from the highest bidder at regular intervals.

## Future Enhancements
- Add payment gateway integration.
- Implement auction timers and automatic closing.
- Improve UI/UX for better usability.
- Introduce different bidding types (sealed-bid, Dutch auction, etc.).

## Contributing
Feel free to fork the repository and create pull requests for enhancements and bug fixes.

## License
This project is licensed under the MIT License.
