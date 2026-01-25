/**
 * AUTH GUARD
 * Include this script at the TOP of protected pages (dashboard.html, profile.html).
 * It immediately redirects unauthenticated users to signin.html.
 */
(function () {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
        // Not logged in -> Redirect to Sign In
        window.location.href = 'signin.html';
    } else {
        // Logged in -> Ensure user object is valid (basic check)
        try {
            const user = JSON.parse(userStr);
            if (!user.regNo) throw new Error("Invalid User");
        } catch (e) {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'signin.html';
        }
    }
})();
