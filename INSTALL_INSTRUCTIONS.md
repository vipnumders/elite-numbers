# Installation Guide for Global Elite Number Next.js App

To see the sign-up page and use the application, follow these steps:

## 1. Install Node.js and npm

First, you need to install Node.js and npm (Node Package Manager):

1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the instructions
4. After installation, restart your computer

## 2. Verify Installation

Open a new command prompt or PowerShell window and run:

```
node -v
npm -v
```

Both commands should display version numbers if installation was successful.

## 3. Run the Next.js App

1. Open a command prompt or PowerShell
2. Navigate to your project folder:
   ```
   cd "C:\Users\dell\Desktop\web Development\New folder (2)"
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## 4. Sign-Up Page Access

You should now be able to see and access the sign-up page by:

- Clicking the "Sign Up" button in the header (top-right)
- Clicking the "Sign Up Now" button on the homepage
- Clicking the "Create Your Account" button in the sign-up section
- Directly visiting: http://localhost:3000/auth/sign-up

## Alternative: Use the Original HTML Files

If you prefer to use your original HTML files without setting up Next.js:

1. Simply open the `signup.html` file directly in your browser:
   - Double-click on the file in File Explorer
   - Or right-click and select "Open with" and choose your browser

The original HTML version doesn't require Node.js or npm to be installed.

## Need Help?

If you're having trouble:
1. Make sure Node.js is properly installed
2. Check that you're in the correct project directory
3. Ensure all dependencies are installed by running `npm install` 