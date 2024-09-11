# Eko Startup Homework Assignment

This project is a solution for a homework assignment from Eko Startup, developed by **Gal Or**.
It includes a simple web page with an HTML5 Video Element and several key functionalities:
- **Play/Pause Toggle**
- **Progress Indication with Time Labels**
- **Views Counter**
- **Like/Dislike Functionality**
- **Integration with Firebase Realtime Database for Persistence**


## How to Get Set Up
1. **Update Firebase Configuration:**

   Replace the contents of `src/firebaseConfig.js` with the correct Firebase credentials (sended separated).

2. **Install Dependencies:**

   Run the following command to install the required dependencies:
   npm install
   npm start


## Things to Consider
### Framework Choice
I chose **React** for this project due to its efficiency in handling multiple state updates and re-rendering the DOM.

### Single Source of Truth
I utilized **browser local storage** to ensure that view counts and like/dislike votes are correctly handled. 
This approach guarantees that users can vote only once and view the video only once per session. 
This helps maintain data integrity in the database.

### Handling Concurrent Users
To ensure data consistency when multiple users interact with the voting system simultaneously, 
I implemented **Firebase Realtime Database** subscriptions. 
This approach ensures that changes are synchronized in real time and prevents data loss.

### Bundling and Packing
The project uses **Webpack** for bundling and packing. 
Webpack compiles the project's JavaScript, CSS (used Tailwind.css CDN), and other assets into a single bundle that is served to the browser. 
This setup ensures that the application is optimized for performance and easier to deploy.


## Testing cases
1. **Testing Play/Pause Toggle:**
    - Verify that the button text or icon changes between "Play" and "Pause" when clicked.
    - Ensure that the video pauses when the play button is clicked and plays when the pause button is clicked.

2. **Testing Progress Bar:**
    - Check that the progress bar fills correctly as the video plays.
    - Ensure that clicking on the progress bar seeks the video to the correct time.

3. **Testing View Count Increment:**
    - Verify that the view count is incremented by 1 each time the video is viewed.
    - Ensure that the view count is updated correctly in the Firebase Realtime Database.

4. **Testing Like/Dislike Functionality:**
    - Confirm that clicking the like button increments the like counter and clicking the dislike button increments the dislike counter.
    - Ensure that users can only vote once per session and that votes are correctly reflected in Firebase.

## Project Packaging
The project is available in two formats:
    - GitHub Repository: You can access the project repository on GitHub here.
    - ZIP File: The project can also be downloaded as a ZIP file here.

Feel free to reach out if you have any questions or need further assistance!