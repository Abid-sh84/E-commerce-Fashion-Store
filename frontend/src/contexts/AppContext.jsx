// import React, { createContext, useContext } from 'react';

// const AppContext = createContext();

// export const useApp = () => useContext(AppContext);

// export const AppProvider = ({ children }) => {
//   // Reliable image fallbacks by category
//   const imageFallbacks = {
//     dc: [
//       "https://m.media-amazon.com/images/I/81j5XT1+IwL._AC_UX679_.jpg",
//       "https://m.media-amazon.com/images/I/61oVPMPQVWL._AC_UX679_.jpg",
//       "https://m.media-amazon.com/images/I/71TfJRkiwdL._AC_UX679_.jpg"
//     ],
//     marvel: [
//       "https://m.media-amazon.com/images/I/71jlppwpjPL._AC_UX679_.jpg",
//       "https://m.media-amazon.com/images/I/61l7aBj17hL._AC_UX679_.jpg"
//     ],
//     anime: [
//       "https://m.media-amazon.com/images/I/71jiGaGzHsL._AC_UX679_.jpg"
//     ]
//   };

//   // Function to handle image errors
//   const handleImageError = (e, category) => {
//     e.target.onerror = null; // Prevent infinite loop

//     if (category && imageFallbacks[category] && imageFallbacks[category].length > 0) {
//       // Use category fallback
//       e.target.src = imageFallbacks[category][0];
//     } else {
//       // Use general fallback
//       e.target.src = "/placeholder.svg";
//     }
//   };

//   const value = {
//     imageFallbacks,
//     handleImageError
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export default AppProvider;
