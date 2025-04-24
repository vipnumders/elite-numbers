# Troubleshooting Clerk Authentication

If you're experiencing issues with Clerk authentication not working properly, follow these troubleshooting steps:

## 1. Check Your Publishable Key

Make sure you're using a valid publishable key from your Clerk dashboard:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "API Keys" section
4. Copy your Frontend API key (publishable key)
5. Update it in your `index.html` and any other pages:

```html
<script>
    window.Clerk = window.Clerk || {};
    window.Clerk.publishableKey = 'pk_live_your_actual_key_here';
</script>
```

## 2. Check Browser Console for Errors

Open your browser developer tools (F12) and check the console for any errors:

- Look for 401/403 errors related to Clerk API calls
- Check for JavaScript errors in your auth.js file

## 3. Complete Implementation Steps

Make sure you've completed all necessary implementation steps:

1. Add the Clerk script and publishable key in `<head>`:
```html
<script src="https://cdn.clerk.dev/clerk.js"></script>
<script>
    window.Clerk = window.Clerk || {};
    window.Clerk.publishableKey = 'YOUR_PUBLISHABLE_KEY';
</script>
```

2. Add user button element:
```html
<div id="user-button"></div>
```

3. Add sign-in and sign-up buttons:
```html
<div class="auth-buttons">
    <button class="btn btn-signin">Sign In</button>
    <button class="btn btn-login">Sign Up</button>
</div>
```

4. Include auth.js and ensure it's loaded after Clerk script:
```html
<script src="auth.js"></script>
```

## 4. Try Direct Authentication Links

If the buttons aren't working, try using direct authentication URLs:

- Sign In: `https://<your-clerk-frontend-api>.clerk.accounts.dev/sign-in`
- Sign Up: `https://<your-clerk-frontend-api>.clerk.accounts.dev/sign-up`

You can create links to these URLs as a temporary workaround.

## 5. Verify Clerk Account Configuration

Check your Clerk account settings:

1. Ensure you have at least one authentication method enabled (email/password, social, etc.)
2. Add your website domain to the allowed origins in Clerk settings
3. Make sure your application instance is active

## 6. Test with a Minimal Implementation

Create a simple test page with only Clerk implementation to isolate any issues:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Clerk Test</title>
    <script src="https://cdn.clerk.dev/clerk.js"></script>
    <script>
        window.Clerk = window.Clerk || {};
        window.Clerk.publishableKey = 'YOUR_KEY';
    </script>
</head>
<body>
    <div id="user-button"></div>
    <button id="signin">Sign In</button>
    <button id="signup">Sign Up</button>

    <script>
        document.addEventListener('DOMContentLoaded', async function() {
            await Clerk.load();
            
            Clerk.mountUserButton(document.getElementById('user-button'));
            
            document.getElementById('signin').addEventListener('click', function() {
                Clerk.openSignIn();
            });
            
            document.getElementById('signup').addEventListener('click', function() {
                Clerk.openSignUp();
            });
        });
    </script>
</body>
</html>
```

If this works, then gradually add back your custom implementation.

## 7. Contact Clerk Support

If you've tried all the above steps and still have issues, contact Clerk support:

- Visit [help.clerk.com](https://help.clerk.com)
- Email: support@clerk.com 