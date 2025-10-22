// File: js/user-utils.js

/**
 * Format a number as currency (₦)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return `₦${amount.toLocaleString()}`;
}

/**
 * Filter users by email or name
 * @param {Array} users - array of user objects
 * @param {string} query - search term
 * @returns {Array}
 */
export function filterUsers(users, query) {
  const lowerQuery = query.toLowerCase();
  return users.filter(
    (user) =>
      user.email.toLowerCase().includes(lowerQuery) ||
      user.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter users by date range
 * @param {Array} users
 * @param {Date} start
 * @param {Date} end
 * @returns {Array}
 */
export function filterUsersByDate(users, start, end) {
  return users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= start && createdAt <= end;
  });
}

/**
 * Animate a panel or modal to show full user details
 * @param {HTMLElement} panel
 */
export function animateOpen(panel) {
  panel.style.display = "block";
  panel.style.opacity = 0;
  panel.style.transform = "translateY(-20px)";
  let opacity = 0;
  const interval = setInterval(() => {
    opacity += 0.1;
    panel.style.opacity = opacity;
    panel.style.transform = `translateY(${20 - opacity * 20}px)`;
    if (opacity >= 1) clearInterval(interval);
  }, 20);
}

/**
 * Animate closing a panel or modal
 * @param {HTMLElement} panel
 */
export function animateClose(panel) {
  let opacity = 1;
  const interval = setInterval(() => {
    opacity -= 0.1;
    panel.style.opacity = opacity;
    panel.style.transform = `translateY(${20 - opacity * 20}px)`;
    if (opacity <= 0) {
      clearInterval(interval);
      panel.style.display = "none";
    }
  }, 20);
}