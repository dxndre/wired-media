# WP Quickcheck

A simple, secure WordPress plugin that lets users submit text entries via a shortcode form, stores them in a custom database table, and displays the last 5 entries with live character count and AJAX animations.

## Features

### 1. Security-aware Form + Shortcode
- Use `[qc_form]` shortcode to display a text input and submit button.
- Form submission is handled via AJAX with proper sanitization, escaping, and nonce verification.

### 2. Custom Database Table
- On plugin activation, creates `{prefix}_qc_entries` table:
  - `id` (INT, auto-increment, primary key)
  - `content` (VARCHAR 255)
  - `created_at` (datetime)

### 3. JS/jQuery Features
- Live character counter for the input field.
- Submit button disabled until at least 3 characters are entered.
- Success or error messages displayed dynamically.
- Fade-in animations for entries.

### 4. AJAX Endpoints
- Fetches last 5 entries as JSON.
- Only accessible to logged-in users.
- Includes capability checks and nonce verification.

### 5. Clean CSS Styling
- Modern, responsive styling for form, messages, and entries.
- Success, warning, and error messages with fading animations.
- Guest users see a prompt to log in instead of entries.

---

## Installation

1. Upload the plugin folder to `/wp-content/plugins/wp-quickcheck/`.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Use the `[qc_form]` shortcode on any page or post to display the form.

---

## Flow

1. User visits page with `[qc_form]`.
2. If user is not logged in, they see:

Want to see entries? Please Sign In to view them.

3. Logged-in users see the form with:
- Input field
- Live character counter
- Disabled submit button (until 3+ characters)
4. As the user types:
- Character count updates in real time.
5. On clicking submit:
- If fewer than 3 characters, a warning appears: 
  > "You need to add X more characters before you can submit."
- If valid, AJAX submits the entry securely to the database.
- Success message appears and fades out gracefully:
  > "Successfully added entry!"
6. Last 5 entries are fetched via AJAX and displayed with fade-in animation, newest first.
7. Older entries beyond 5 are removed from the display automatically.

---

## Screenshots

1. Form with live character counter and disabled submit button.  
2. Success message after submission.  
3. Last 5 entries fading in dynamically.  
4. Guest message prompting login.  

---

## Frequently Asked Questions

**Q:** Can guest users submit entries?  
**A:** No. Submissions and viewing entries are restricted to logged-in users. Guests see a login prompt.

**Q:** How many entries are displayed?  
**A:** The last 5 entries are displayed, newest first. Older entries are removed automatically as new ones are added.

**Q:** Does this plugin sanitize user input?  
**A:** Yes, all input is sanitized and escaped using WordPress functions before storing in the database.

**Q:** Can I style the form and messages?  
**A:** Yes, the plugin comes with SCSS/CSS classes that can be customized:
- `.qc-message` – success/error messages
- `.qc-entry` – individual entries
- `.quickcheck-form` – the form wrapper
- `.count-number` – live character counter

---

## Changelog

**1.0.0**
- Initial release
- Security-aware form with nonce
- AJAX-based submission and retrieval
- Custom database table for entries
- Live character counter with minimum character validation
- Success and error messages with fade-in/out animations
- Display last 5 entries for logged-in users
- Responsive SCSS/CSS styling
