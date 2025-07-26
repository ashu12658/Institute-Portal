
// import { createContext, useContext, useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';

// export const StudentAuthContext = createContext();

// export const StudentAuthProvider = ({ children }) => {
//   const [student, setStudent] = useState(null);

//   useEffect(() => {
//     const token = sessionStorage.getItem('studentToken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setStudent({ id: decoded.id });
//       } catch (err) {
//         console.error('Invalid token:', err);
//         setStudent(null);
//       }
//     }
//   }, []);

//   const login = (token) => {
//     sessionStorage.setItem('studentToken', token);
//     const decoded = jwtDecode(token);
//     setStudent({ id: decoded.id });
//   };

//   const logout = () => {
//     sessionStorage.removeItem('studentToken');
//     setStudent(null);
//   };

//   return (
//     <StudentAuthContext.Provider value={{ student, login, logout }}>
//       {children}
//     </StudentAuthContext.Provider>
//   );
// };

// // ✅ Custom Hook
// export const useStudentAuth = () => {
//   const context = useContext(StudentAuthContext);
//   if (!context) {
//     throw new Error('useStudentAuth must be used within a StudentAuthProvider');
//   }
//   return context;
// };


import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data (student, admin, tpo)
  const [loading, setLoading] = useState(true); // To handle initial loading

  useEffect(() => {
    const token = sessionStorage.getItem('authToken'); // Get the token from sessionStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to get user info
        setUser({ id: decoded.id, role: decoded.role, email: decoded.email });
      } catch (err) {
        console.error('Invalid token:', err);
        setUser(null); // Invalid token, clear the user data
      }
    }
    setLoading(false); // Set loading to false once the check is done
  }, []);

  const login = (token) => {
    sessionStorage.setItem('authToken', token); // Store token in sessionStorage
    const decoded = jwtDecode(token); // Decode the token to extract user data
    setUser({ id: decoded.id, role: decoded.role, email: decoded.email }); // Set user data
  };

  const logout = () => {
    sessionStorage.removeItem('authToken'); // Remove token from sessionStorage
    setUser(null); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthProvider;