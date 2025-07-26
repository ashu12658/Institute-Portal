// import { createContext, useContext, useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';

// export const AdminTpoAuthContext = createContext();

// export const AdminTpoAuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { id, role }

//   useEffect(() => {
//     const token = sessionStorage.getItem('adminTpoToken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser({ id: decoded.id, role: decoded.role });
//       } catch (err) {
//         console.error('Invalid token:', err);
//         setUser(null);
//       }
//     }
//   }, []);

//   const login = (token) => {
//     sessionStorage.setItem('adminTpoToken', token);
//     const decoded = jwtDecode(token);
//     setUser({ id: decoded.id, role: decoded.role });
//   };

//   const logout = () => {
//     sessionStorage.removeItem('adminTpoToken');
//     setUser(null);
//   };

//   return (
//     <AdminTpoAuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AdminTpoAuthContext.Provider>
//   );
// };

// export const useAdminTpoAuth = () => {
//   const context = useContext(AdminTpoAuthContext);
//   if (!context) {
//     throw new Error('useAdminTpoAuth must be used within an AdminTpoAuthProvider');
//   }
//   return context;
// };
// context/adminAuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          setAdmin({ id: decoded.id, email: decoded.email });
        }
      } catch (err) {
        console.error('Invalid admin token:', err);
        setAdmin(null);
      }
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem('adminToken', token);
    const decoded = jwtDecode(token);
    setAdmin({ id: decoded.id, email: decoded.email });
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
