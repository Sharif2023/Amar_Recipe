// API Configuration
export const API_CONFIG = {
  // Base URL for all API calls (ByteHost proxy)
  BASE_URL: 'https://amar-recipe.byethost7.com/api/proxy.php',

  // Recipe endpoints
  RECIPES: {
    GET_ALL: 'get_recipes.php',
    SUBMIT_REQUEST: 'submit_recipe_request.php',
    SUBMIT: 'submit_recipe.php',
    UPDATE: 'update_recipe.php',
    DELETE: 'delete_recipe.php',
    REPORT: 'report_recipe.php',
    RATE: 'rate_recipe.php',
    CHECK_RATING: 'check_user_rating.php',
  },

  // Admin endpoints
  ADMIN: {
    LOGIN: 'admin_login.php',
    SIGNUP: 'admin_signup.php',
    GET_PROFILE: 'admin_login.php',
    UPDATE_PROFILE: 'update_admin_profile.php',
    UPDATE_STATUS: 'update_admin_status.php',
    GET_ACTIVITY_HISTORY: 'get_admin_activity_history.php',
    CHANGE_PASSWORD: 'change_password.php',
    DELETE_ACCOUNT: 'delete_account.php',
  },

  // Admin management endpoints
  ADMIN_MANAGEMENT: {
    GET_REQUESTS: 'admin_requests.php',
    GET_SUBMISSION_REQUESTS: 'get_submission_requests.php',
    APPROVE_SUBMISSION: 'approve_submission.php',
    REJECT_SUBMISSION: 'reject_submission.php',
    GET_SUBMISSION_COUNT: 'get_submission_count.php',
    GET_SUBMISSION_HISTORY: 'get_submission_history.php',
  },

  // Report endpoints
  REPORTS: {
    GET_ALL: 'get_reports.php',
    GET_COUNT: 'get_report_count.php',
    UPDATE_STATUS: 'update_report_status.php',
    DELETE: 'delete_report.php',
  },

  // Admin communication
  MESSAGES: {
    GET_MESSAGES: 'admin_get_messages.php',
    SEND_MESSAGE: 'admin_send_message.php',
  },
};

/**
 * Construct full API endpoint URL via ByteHost proxy
 * @param {string} endpoint - The InfinityFree API file name
 * @returns {string} - Full URL for the API call
 */
export const getApiUrl = (endpoint) => {
  // IMPORTANT: append ?file= to match proxy requirements
  return `${API_CONFIG.BASE_URL}?file=${endpoint}`;
};
