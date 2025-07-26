const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const User = require('../models/User'); // Assuming you have a User model for TPO/Admin

// const protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
            
//             // Decode the token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             // Get student data from DB and attach it to the request object
//             req.student = await Student.findById(decoded.id).select('-password');
//             next(); // Proceed to the next middleware or route handler
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

const protect = async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        req.student = await Student.findById(decoded.id).select('-password');
  
        if (!req.student) {
          return res.status(401).json({ message: 'Student not found' });
        }
  
        next();
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    } else {
      return res.status(401).json({ message: 'Not authorized, no token' }); // ✅ this was missing
    }
  };

// TPO Protect
const protectTPO = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if (!user || user.role !== 'tpo') {
                return res.status(403).json({ message: 'Access denied, not a TPO' });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized as TPO, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized as TPO, no token' });
    }
};

// Admin Protect
const protectAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied, not an Admin' });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized as Admin, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized as Admin, no token' });
    }
};
// // Role-based Protection Middleware for Admin and TPO (both can access)
// const protectAdminOrTPO = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
//             const user = await User.findById(decoded.id).select('-password');

//             if (!user || (user.role !== 'admin' && user.role !== 'tpo')) {
//                 return res.status(403).json({ message: 'Access denied, not an Admin or TPO' });
//             }

//             req.user = user;
//             next();
//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized as Admin or TPO, token failed' });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized as Admin or TPO, no token' });
//     }
// };

const protectAdminOrTPO = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await User.findById(decoded.id).select('-password');

            if (!user || (user.role !== 'admin' && user.role !== 'tpo')) {
                return res.status(403).json({ message: 'Access denied, not an Admin or TPO' });
            }

            req.user = user;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized as Admin or TPO, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized as Admin or TPO, no token' });
    }
};

module.exports = { protect,protectTPO, protectAdmin,protectAdminOrTPO };
