/**
 * Validates review data before submission
 * @param {Object} reviewData - The review data to validate
 * @returns {Object} - Contains validation result and any error messages
 */
export const validateReviewData = (reviewData) => {
  const { rating, title, comment } = reviewData;
  
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
    return { 
      isValid: false, 
      error: "Rating must be between 1 and 5 stars"
    };
  }
  
  if (!title || title.trim() === "") {
    return { 
      isValid: false, 
      error: "Please provide a title for your review"
    };
  }
  
  if (!comment || comment.trim() === "" || comment.length < 5) {
    return { 
      isValid: false, 
      error: "Please provide a comment with at least 5 characters"
    };
  }
  
  if (title.length > 100) {
    return {
      isValid: false,
      error: "Review title should be less than 100 characters"
    };
  }
  
  if (comment.length > 1000) {
    return {
      isValid: false,
      error: "Review comment should be less than 1000 characters"
    };
  }
  
  return { isValid: true };
};
