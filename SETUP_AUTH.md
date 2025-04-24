# Setting Up Clerk Authentication

Follow these steps to implement Sign-in and Login functionality using Clerk.com:

## 1. Create a Clerk.com Account

1. Go to [clerk.com](https://clerk.com) and sign up for an account
2. Create a new application (e.g., "NumberElite")
3. Configure your authentication methods (email/password, social logins, etc.)
4. Get your publishable key from the Clerk Dashboard

## 2. Update Your Code

### Step 1: Update `index.html`

Replace the placeholder publishable key with your actual key:

```html
<script>
    // Initialize Clerk with your publishable key
    window.Clerk = window.Clerk || {};
    window.Clerk.publishableKey = 'YOUR_ACTUAL_PUBLISHABLE_KEY';
</script>
```

### Step 2: Make Sure to Include Both JavaScript Files

Ensure both JavaScript files are included at the bottom of your HTML:

```html
<!-- Load JavaScript files -->
<script src="auth.js"></script>
<script src="script.js"></script>
```

## 3. Test the Authentication

1. Open your website
2. Click on the "Sign In" or "Sign Up" buttons
3. Complete the authentication flow
4. Verify that premium numbers become accessible after signing in

## 4. Additional Customization

You can customize the appearance of the Clerk components by modifying the following in `auth.js`:

```javascript
Clerk.mountUserButton(userButtonElement, {
    afterSignOutUrl: window.location.href,
    appearance: {
        elements: {
            rootBox: {
                boxShadow: 'none',
            },
            avatarBox: {
                width: '2.5rem',
                height: '2.5rem',
            }
            // Add more customization here
        }
    }
});
```

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify your publishable key is correct
3. Ensure all JavaScript files are loaded in the correct order
4. Check Clerk Dashboard for any authentication issues

## Features Included

- Sign-in and Sign-up functionality
- User profile management via Clerk's user button
- Protected premium content only for authenticated users
- User-specific shopping carts
- Welcome notifications for users