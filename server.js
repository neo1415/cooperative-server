const express = require('express');
const admin = require('firebase-admin');
// const cookieParser = require('cookie-parser'); 
// const csurf = require('csurf');
const cors = require('cors'); 
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
// const nodemailer = require('nodemailer');
const helmet = require('helmet');
const { body, param,validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const app = express();
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer(); // This will store files in memory for processing



// const axios = require('axios');
// const bcrypt = require('bcrypt'); 
// const session = require('express-session');
// const crypto = require('crypto');


let config = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// const firebaseAPIKey = process.env.REACT_APP_FIREBASE_KEY;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:3001',
//   // 'https://nem-server-rhdb.onrender.com',
//   // 'https://nemfeedback.com'
// ];

const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
'https://cooperative-server.onrender.com',
"https://icmscooperative.vercel.app"
]; // Frontend origin

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials if needed
}));


// Middleware setup
app.use(morgan('combined', { stream: accessLogStream }));
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true,
  preload: true
}));
// app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'"],
//     styleSrc: ["'self'"],
//     imgSrc: ["'self'", "data:"],
//     connectSrc: ["'self'"],
//     fontSrc: ["'self'"],
//     objectSrc: ["'none'"],
//     frameAncestors: ["'none'"],
//     baseUri: ["'self'"],
//     formAction: ["'self'"]
//   }
// }));

// app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(hpp());
app.use(mongoSanitize());
app.use(xss());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(csurf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Only secure in production
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Cross-site cookie policy
//   }
// }));


// Initialize CSRF protection middleware
// const csrfProtection = csurf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Only secure in production
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Cross-site cookie policy
//   }
// });

// Nonce implementation middleware
// const generateNonce = () => {
//   return uuidv4();
// };

// app.use((req, res, next) => {
//   res.locals.nonce = generateNonce();
//   next();
// });


const db = admin.firestore();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('<h1>Server is running!</h1>');
});

// Rate limiter middleware to limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again later.'
});

// Timestamp validation middleware
// app.use((req, res, next) => {
//   if (req.path === '/csrf-token' || req.path === '/listenForUpdates') {
//     return next(); // Skip timestamp validation for these routes
//   }

//   const timestamp = req.headers['x-timestamp'];
//   if (!timestamp) {
//     return res.status(400).send({ error: 'Timestamp is required' });
//   }

//   const requestTime = new Date(parseInt(timestamp, 10));
//   const currentTime = new Date();

//   const timeDiff = currentTime - requestTime;
//   const maxAllowedTime = 5 * 60 * 1000; // 5 minutes

//   if (timeDiff > maxAllowedTime) {
//     return res.status(400).send({ error: 'Request too old' });
//   }

//   next();
// });

// Apply CSRF protection middleware conditionally
// app.use((req, res, next) => {
//   if (req.path === '/listenForUpdates') {
//     return next(); // Skip CSRF for this route
//   }
//   csrfProtection(req, res, next); // Apply CSRF protection
// });

// Log the CSRF token when validating
// app.use((req, res, next) => {
//   // console.log('Received CSRF Token:', req.headers['csrf-token']);
//   next();
// });

// Endpoint to get CSRF token
// app.get('/csrf-token', (req, res) => {
//   const csrfToken = req.csrfToken();
//   // console.log('Generated CSRF Token:', csrfToken); // Log the generated CSRF token
//   res.status(200).json({ csrfToken });
// });


// const createCustomToken = async (email) => {
//   try {
//     // Attempt to get the user by email
//     const userRecord = await admin.auth().getUserByEmail(email);
//     console.log(`Successfully fetched user: ${userRecord.uid}`);

//     // Attempt to create a custom token for the user
//     const customToken = await admin.auth().createCustomToken(userRecord.uid);
//     console.log(`Custom token created successfully for user: ${userRecord.uid}`);
    
//     return customToken;
//   } catch (error) {
//     // Log specific error messages to understand the failure
//     if (error.code === 'auth/user-not-found') {
//       console.error(`User not found for email: ${email}`);
//     } else {
//       console.error('Error creating custom token:', error.message);
//     }

//     throw new Error('Failed to create custom token');
//   }
// };

// async function createSuperAdmin() {
//   const email = 'admin@admin.com';
//   const password = 'administrator';
//   const role = 'admin';

//   try {
//     // Create Firebase user with admin role
//     const userRecord = await admin.auth().createUser({
//       email: email,
//       password: password,
//       displayName: 'Super Admin',
//     });


//     // Set custom claims to define the role
//     await admin.auth().setCustomUserClaims(userRecord.uid, {
//       role: role,
//       kycIncomplete: false,  // Super admin doesn't need KYC
//     });

//     console.log('Super admin account created:', userRecord.uid);

//     return {
//       message: 'Super admin account created successfully',
//       uid: userRecord.uid,
//     };
//   } catch (error) {
//     console.error('Error creating super admin account:', error);
//     throw new Error(`Failed to create super admin: ${error.message}`);
//   }
// }

// // // Call the function on server startup
// createSuperAdmin()
//   .then((result) => {
//     console.log(result.message);  // Logs success message
//   })
//   .catch((error) => {
//     console.error('Error initializing super admin:', error);
//   });

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "kyc_images" },  // Specify the Cloudinary folder
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer); // End the stream with the buffer to upload
  });
};



// Middleware to verify Firebase token and fetch cooperativeId if missing
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("401 Unauthorized: No token provided");
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded token:", decodedToken);

    req.user = {
      uid: decodedToken.uid,
      role: decodedToken.role || null,
      cooperativeId: decodedToken.cooperativeId || null,
      memberId: decodedToken.memberId || null,
    };

    console.log("User data from token:", req.user);

    if (req.user.role === 'cooperative-admin' && !req.user.cooperativeId) {
      console.log("Searching for cooperative in database...");
      const cooperative = await prisma.cooperative.findUnique({
        where: { id: req.user.uid },
        select: { id: true },
      });

      if (cooperative) {
        console.log("Cooperative found:", cooperative);
        req.user.cooperativeId = cooperative.id;
      } else {
        console.log("403 Forbidden: Cooperative admin not found in database");
        return res.status(403).json({ error: 'Unauthorized: Cooperative admin not found' });
      }
    }

    if (req.user.role === 'member' && !req.user.memberId) {
      console.log("Searching for member in database...");
      const member = await prisma.member.findUnique({
        where: { id: req.user.uid },
        select: { id: true, cooperativeId: true },
      });

      if (member) {
        console.log("Member found:", member);
        req.user.memberId = member.id;
        req.user.cooperativeId = member.cooperativeId;
      } else {
        console.log("403 Forbidden: Member not found in database");
        return res.status(403).json({ error: 'Unauthorized: Member not found' });
      }
    }

    if (!req.user.role) {
      console.log("403 Forbidden: Missing role claim");
      return res.status(403).json({ error: 'Unauthorized: Missing role claim' });
    }

    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}


// Backend route to verify ID token and create a custom token
app.post('/verify-token', loginLimiter, async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).send({ error: 'ID token is required' });
  }

  try {
    // Verify the ID token received from the frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Fetch the user by UID (optional step to retrieve roles, etc.)
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    // Create a custom token for the user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    // Return the custom token and any other data like role
    res.status(200).json({ customToken, role: userRecord.customClaims?.role || 'user' });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(500).send({ error: 'Authentication failed' });
  }
});


// Password reset route
app.post('/resetpassword', loginLimiter, [
  body('uid').isString().notEmpty(),
  body('newPassword').isString().notEmpty().isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { uid, newPassword } = req.body;

  try {
    await admin.auth().updateUser(uid, { password: newPassword });
    await admin.auth().setCustomUserClaims(uid, { forcePasswordReset: null });
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

async function fetchUsersFromFirestore() {
  try {
    const usersSnapshot = await admin
      .firestore()
      .collection('userroles')
      // .orderBy('timestamp', 'desc') // Order by timestamp in descending order (latest first)
      .get();

    const userList = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      role: doc.data().role,
      // Add more user properties  later
    }));

    return userList;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}



// Modify the '/get-users' endpoint to simply fetch and return user data
app.get('/get-users',loginLimiter, async (req, res) => {
  try {
    const users = await fetchUsersFromFirestore();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/clear-password-reset-claims', async (req, res) => {
  const { uid } = req.body;

  // console.log('Request received to clear custom claims for UID:', uid);

  try {
    const user = await admin.auth().getUser(uid);
    // console.log('User retrieved:', user);

    const claims = user.customClaims || {}; // Handle the case where customClaims is undefined

    if ('forcePasswordReset' in claims) {
      delete claims.forcePasswordReset;
      await admin.auth().setCustomUserClaims(uid, claims);
      console.log('User claims updated successfully for UID:');
      res.status(200).json({ message: 'User claims updated successfully' });
    } else {
      console.log('No forcePasswordReset claim found for UID:');
      res.status(200).json({ message: 'No forcePasswordReset claim to remove' });
    }

  } catch (error) {
    console.error('Error updating user claims:', error);
    res.status(500).json({ error: 'Failed to update user claims' });
  }
});

// Backend route to handle login securely
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password are required' });
  }

  try {
    const idToken = await authenticateUser(email, password);
    const customToken = await createCustomToken(email);

    res.status(200).json({ customToken, role: 'user' });  // Example response

  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Authentication failed' });
  }
});

// User registration route

// Route for user registration
const generateCooperativeRegistrationNumber = () => {
  const randomString = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `RG-${randomString}C`;
};

app.post('/register', async (req, res) => {
  const { email, cooperativeName, password } = req.body;

  try {
    console.log('Received data:', { email, cooperativeName, password });
    if (!email || !cooperativeName || !password) {
      return res.status(400).json({ error: 'Missing required fields: email, cooperativeName, or password' });
    }

    // Create a Firebase user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: cooperativeName,
    });

    console.log('Firebase user created with UID:', userRecord.uid);

    // Generate registration number
    const registrationNumber = generateCooperativeRegistrationNumber();
    console.log('Generated registration number:', registrationNumber);

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'cooperative-admin',
      kycIncomplete: true,
    });

    console.log('Custom claims set for user:', userRecord.uid);

    // Save cooperative data in Prisma with registration number
    const cooperative = await prisma.cooperative.create({
      data: {
        cooperativeName: cooperativeName,
        email: email,
        registrationNumber, // Save the registration number
        id: userRecord.uid, // Use the Firebase user ID as the cooperativeId
      },
    });

    console.log('Cooperative saved in database:', cooperative);

    // Create default admin settings for the cooperative
    const defaultAdminSettings = await prisma.cooperativeAdminSettings.create({
      data: {
        cooperativeId: cooperative.id, // Link the settings to the cooperative
        loanFormPrice: 0,
        shareCapital: 0,
        entranceFee: 0,
        loanUpperLimit: 0,
        monthsToLoan: 0,
        gracePeriod: 0, // Default value for grace period
        increaseRate: 0,
      },
    });

    console.log('Default admin settings created for cooperative:', defaultAdminSettings);

    res.status(201).json({
      message: 'User created, verification email sent',
      cooperativeId: userRecord.uid,
      cooperative,
      adminSettings: defaultAdminSettings,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      // Handle Firebase duplicate email error
      return res.status(400).json({ error: 'The email address is already in use by another account.' });
    }

    if (error.code === 'P2002' && error.meta && error.meta.target.includes('cooperativeName')) {
      // Handle Prisma unique constraint violation for cooperativeName
      return res.status(400).json({ error: 'The cooperative name is already in use. Please choose a different name.' });
    }

    // Handle general errors
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});


app.post('/cooperative-kyc', verifyFirebaseToken, upload.single('img'), async (req, res) => {
  try {
    const { cooperativeId, ...cooperativeKycData } = req.body;

    // Validate cooperativeId
    if (!cooperativeId || !cooperativeId.trim()) {
      return res.status(400).json({ error: 'Invalid or missing cooperative ID' });
    }

    // Fetch cooperative details
    const cooperative = await prisma.cooperative.findUnique({
      where: { id: cooperativeId },
    });

    if (!cooperative) {
      return res.status(404).json({ error: 'Cooperative not found' });
    }

    const { cooperativeName, email, registrationNumber } = cooperative;

    // Handle image upload if file exists
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadImageToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    }

    // Save cooperative KYC details in Prisma
    const cooperativeDetails = await prisma.cooperativeDetails.create({
      data: {
        cooperative: { connect: { id: cooperativeId } },
        img: imageUrl || null,
        cooperativeName,
        email,
        registrationNumber, // Use existing registration number
        dateOfIncorporation: new Date(cooperativeKycData.dateOfIncorporation).toISOString(),
        address: cooperativeKycData.address,
        phoneNumber: cooperativeKycData.phoneNumber,
        totalSavings: parseFloat(cooperativeKycData.totalSavings) || 0,
        totalDebt: parseFloat(cooperativeKycData.totalDebt) || 0,
        totalLoansRequested: parseFloat(cooperativeKycData.totalLoansRequested) || 0,
        totalLoansApproved: parseFloat(cooperativeKycData.totalLoansApproved) || 0,
        totalMembers: cooperativeKycData.totalMembers || '',
        totalDebtors: cooperativeKycData.totalDebtors || '',
        totalProfit: parseFloat(cooperativeKycData.totalProfit) || 0,
        directorName: cooperativeKycData.directorName,
        directorPosition: cooperativeKycData.directorPosition,
        directorEmail: cooperativeKycData.directorEmail,
        directorPhoneNumber: cooperativeKycData.directorPhoneNumber,
        directorDateOfBirth: new Date(cooperativeKycData.directorDateOfBirth).toISOString(),
        directorPlaceOfBirth: cooperativeKycData.directorPlaceOfBirth,
        directorNationality: cooperativeKycData.directorNationality,
        directorOccupation: cooperativeKycData.directorOccupation,
        directorBVNNumber: cooperativeKycData.directorBVNNumber,
        directorIDType: cooperativeKycData.directorIDType,
        directorIDNumber: cooperativeKycData.directorIDNumber,
        directorIssuedDate: cooperativeKycData.directorIssuedDate,
        directorExpiryDate: cooperativeKycData.directorExpiryDate,
        directorSourceOfIncome: cooperativeKycData.directorSourceOfIncome,
      },
    });

    // Update Firebase claims
    const firebaseUser = await admin.auth().getUser(cooperativeId);
    const currentClaims = firebaseUser.customClaims || {};

    await admin.auth().setCustomUserClaims(firebaseUser.uid, {
      ...currentClaims,
      kycIncomplete: false,
    });

    res.status(200).json({
      message: 'KYC completed successfully',
      cooperativeDetails,
    });
  } catch (error) {
    console.error('Error saving to Prisma:', error);
    res.status(500).json({
      error: 'Error saving to Prisma',
      details: error.message,
    });
  }
});


app.get('/cooperatives', async (req, res) => {
  try {
    const cooperatives = await prisma.cooperative.findMany({
      select: { id: true, cooperativeName: true },
    });
    res.status(200).json(cooperatives); // Ensure this is always an array
  } catch (error) {
    console.error('Error fetching cooperatives:', error);
    res.status(500).json({ error: 'Failed to fetch cooperatives' });
  }
});


app.get('/get-cooperatives',verifyFirebaseToken, async (req, res) => {
  try {
    const cooperatives = await prisma.cooperative.findMany({
      include: {
        cooperativeDetails: true,  // Includes the related KYC details (may be null)
      },
    });
    cooperatives.forEach(cooperative => {
      console.log('Cooperative:', cooperative.cooperativeName);
      console.log('Details:', cooperative.cooperativeDetails);
    });
    res.status(200).json(cooperatives);
  } catch (error) {
    console.error('Error fetching cooperatives', error);
    res.status(500).json({ error: 'Failed to fetch cooperatives' });
  }
});


// Cooperative profile route
app.get('/cooperative/profileSettings',verifyFirebaseToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const cooperativeId = decodedToken.uid;

    // Fetch cooperative and all related data
    const cooperative = await prisma.cooperative.findUnique({
      where: { id: cooperativeId },
      include: {
        cooperativeDetails: true,
        members: {
          include: {
            memberSavings: true,
            loansRequested: true,
            loansApproved: true,
          },
        },
      },
    });

    if (!cooperative) {
      return res.status(404).json({ error: 'Cooperative not found' });
    }

    // Calculate totals for display
    const totals = cooperative.members.reduce(
      (acc, member) => {
        acc.totalSavings += member.memberSavings.reduce((sum, s) => sum + s.amount, 0);
        acc.totalLoansRequested += member.loansRequested.reduce((sum, lr) => sum + lr.amount, 0);
        acc.totalLoansApproved += member.loansApproved.reduce((sum, la) => sum + la.amount, 0);
        acc.totalSavingsCount += member.memberSavings.length;
        acc.totalLoansRequestedCount += member.loansRequested.length;
        acc.totalLoansApprovedCount += member.loansApproved.length;
        return acc;
      },
      {
        totalSavings: 0,
        totalLoansRequested: 0,
        totalLoansApproved: 0,
        totalSavingsCount: 0,
        totalLoansRequestedCount: 0,
        totalLoansApprovedCount: 0,
      }
    );

    totals.totalMembers = cooperative.members.length;

    // Return the cooperative data and totals
    res.status(200).json({ ...cooperative, totals });
    console.log({ ...cooperative, totals });

  } catch (error) {
    console.error('Error fetching cooperative profile:', error);
    res.status(500).json({ error: 'Failed to fetch cooperative profile', details: error.message });
  }
});



app.post('/register-member', async (req, res) => {
  const { email, firstName, surname, cooperativeId, password } = req.body;

  try {
    // Validate inputs
    if (!email || !firstName || !surname || !cooperativeId || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate a unique registration number
    const registrationNumber = `RG${Date.now()}${Math.random().toString().slice(2, 10)}M`;

    // Create Firebase user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: `${firstName} ${surname}`,
    });

    // Set custom claims for the member
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'member',
      kycCompleted: false, // Set KYC to false initially
    });

    // Save the member in the Prisma database under the chosen cooperative
    const member = await prisma.member.create({
      data: {
        firstName,
        surname,
        email,
        cooperativeId,
        registrationNumber, // Save the generated registration number
        id: userRecord.uid, // Use Firebase user ID as member ID
      },
    });

    res.status(201).json({
      message: 'Member registered successfully',
      memberId: userRecord.uid,
      member,
      registrationNumber,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ error: 'The email address is already in use.' });
    } else {
      console.error('Error during member registration:', error);
      res.status(500).json({ error: 'Failed to register member', details: error.message });
    }
  }
});


// KYC submission route: /member-kyc


app.post('/member-kyc', verifyFirebaseToken, upload.single('img'), async (req, res) => {

  try {

     const { memberId, ...memberKycData } = req.body;

  console.log("Received memberId:", memberId);
  console.log("Received KYC data:", memberKycData);
  console.log("Received image file:", req.file);

  if (!memberId || Object.keys(memberKycData).length === 0) {
    return res.status(400).json({ error: "Member ID or KYC data is missing." });
  }

  let imageUrl = null;
  if (req.file) {
    try {
      console.log("Uploading image to Cloudinary...");
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res.status(500).json({ error: "Failed to upload image" });
    }
  }
    // Fetch the member's registration number
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { registrationNumber: true },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const membersDetails = await prisma.membersDetails.create({
      data: {
        member: { connect: { id: memberId } },
        registrationNumber: member.registrationNumber, // Use the fetched registration number
        img: imageUrl || null,
        middleName: memberKycData.middleName,
        dateOfEntry: new Date(memberKycData.dateOfEntry).toISOString(),
        telephone1: memberKycData.telephone1,
        telephone2: memberKycData.telephone2,
        bvn: memberKycData.bvn,
        dateOfBirth: new Date(memberKycData.dateOfBirth).toISOString(),
        sex: memberKycData.sex,
        maritalStatus: memberKycData.maritalStatus,
        occupation: memberKycData.occupation,
        business: memberKycData.business,
        residentialAddress: memberKycData.residentialAddress,
        lga: memberKycData.lga,
        state: memberKycData.state,
        permanentHomeAddress: memberKycData.permanentHomeAddress,
        stateOfOrigin: memberKycData.stateOfOrigin,
        lga2: memberKycData.lga2,
        amountPaid: memberKycData.amountPaid,
        accountNumber: memberKycData.accountNumber,
        bankName: memberKycData.bankName,
        nextOfKinName: memberKycData.nextOfKinName,
        nextOfKinPhone: memberKycData.nextOfKinPhone,
        nextOfKinPhone2: memberKycData.nextOfKinPhone2,
        sponsor: memberKycData.sponsor,
      },
    });

    // Update Firebase custom claims
    const firebaseUser = await admin.auth().getUser(memberId);
    const currentClaims = firebaseUser.customClaims || {};

    await admin.auth().setCustomUserClaims(firebaseUser.uid, {
      ...currentClaims,
      kycCompleted: true,
    });

    res.status(200).json({
      message: "KYC completed successfully",
      membersDetails,
    });
  } catch (error) {
    console.error("Error processing KYC:", error);
    res.status(500).json({ error: "Error during KYC processing", details: error.message });
  }
});

app.get('/get-member-cooperative/:memberId',verifyFirebaseToken, async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { cooperativeId: true }, // Only select cooperativeId
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json({ cooperativeId: member.cooperativeId });
  } catch (error) {
    console.error('Error fetching cooperativeId for member:', error);
    res.status(500).json({ error: 'Failed to fetch cooperativeId', details: error.message });
  }
});


// Helper function to validate authorization header and return memberId
async function getMemberIdFromAuth(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized. No token provided.');
  }

  const token = authHeader.split(' ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken.uid; // Return Firebase UID (which is memberId)
}

// Helper function to find member by ID
async function findMemberById(memberId) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: { memberDetails: true },
  });
  console.log("Submitting memberId in payload:", memberId);
  if (!member) {
    console.error("Member ID not found in the database:", memberId);
    return res.status(404).json({ error: 'MemberId not found' });
  }

  return member;
}

// Helper function to find cooperative by ID
async function findCooperativeById(cooperativeId) {
  
  const cooperative = await prisma.cooperative.findUnique({
    where: { id: cooperativeId },
  });
  console.log("Received cooperativeId:", cooperativeId);

  if (!cooperative) {
    console.error("Cooperative ID not found in the database:", cooperativeId);
    return res.status(404).json({ error: 'Cooperative not found' });
  }

  return cooperative;
}

// Main route handler for loan request creation
// Utility function to format a date as dd.mm.yyyy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

app.post('/loan-request', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, role, memberId, cooperativeId } = req.user;
    const {
      amountRequired,
      purposeOfLoan,
      durationOfLoan,
      bvn,
      nameOfSurety1,
      surety1MembersNo,
      surety1telePhone,
      nameOfSurety2,
      surety2MembersNo,
      surety2telePhone,
      loanInterest,
    } = req.body;

    // Authorization checks
    if (role !== 'member' && role !== 'cooperative-admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (!cooperativeId || !memberId || !amountRequired || !purposeOfLoan || !durationOfLoan || !bvn) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse request body values
    const parsedAmountRequired = parseInt(amountRequired, 10);
    const parsedDurationOfLoan = parseInt(durationOfLoan, 10);
    const formattedLoanInterest = parseFloat(loanInterest.toFixed(2));

    // Fetch admin settings for the cooperative
    const adminSettings = await prisma.cooperativeAdminSettings.findFirst({
      where: { cooperativeId },
    });

    if (!adminSettings) {
      return res.status(404).json({ error: 'No admin settings found for this cooperative.' });
    }

    const loanFormPrice = adminSettings.loanFormPrice ?? 0; // Default to 0 if loanFormPrice is null/undefined

    // Calculate the expected amount to be paid back
    const interestAmount = parsedAmountRequired * (formattedLoanInterest / 100) * (parsedDurationOfLoan / 12);
    const expectedAmountToBePaidBack = parsedAmountRequired + interestAmount + loanFormPrice;

    // Calculate the reimbursement date
    const reimbursementDate = new Date();
    reimbursementDate.setMonth(reimbursementDate.getMonth() + parsedDurationOfLoan);
    const formattedReimbursementDate = reimbursementDate.toISOString(); // Ensure ISO-8601 format

    // Current application date
    const dateOfApplication = new Date();
    const formattedDateOfApplication = dateOfApplication.toISOString(); // Ensure ISO-8601 format

    // Save loan request to the database
    const loansRequested = await prisma.loansRequested.create({
      data: {
        cooperative: { connect: { id: cooperativeId } },
        member: { connect: { id: memberId } },
        amountRequired: parsedAmountRequired,
        purposeOfLoan,
        durationOfLoan: parsedDurationOfLoan,
        bvn,
        nameOfSurety1,
        surety1MembersNo,
        surety1telePhone,
        nameOfSurety2,
        surety2MembersNo,
        surety2telePhone,
        amountGranted: parsedAmountRequired,
        loanInterest: formattedLoanInterest,
        expectedAmountToBePaidBack: parseFloat(expectedAmountToBePaidBack.toFixed(2)),
        expectedReimbursementDate: formattedReimbursementDate,
        dateOfApplication: formattedDateOfApplication,
        pending: true,
      },
    });

    res.status(200).json({
      message: 'Loan requested successfully',
      loansRequested,
    });
  } catch (error) {
    console.error('Error processing loan request:', error.message);
    res.status(500).json({ error: 'Failed to process loan request', details: error.message });
  }
});



// app.get('/loan-requests/:loanId/individual') - Refactored Route
app.get('/loan-requests/:loanId/individual', verifyFirebaseToken, async (req, res) => {
  try {
    const loanId = req.params.loanId;

    const loanRequest = await prisma.loansRequested.findUnique({
      where: { id: loanId },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
            memberDetails: { select: { telephone1: true } },
          },
        },
      },
    });

    if (!loanRequest) {
      return res.status(404).json({ error: 'Individual loan request not found.' });
    }

    const transactions = await prisma.memberSavings.findMany({
      where: { memberId: loanRequest.member.id },
      orderBy: { dateOfEntry: 'desc' },
      select: {
        id: true,
        savingsBalance: true,
        savingsDeposits: true,
        dateOfEntry: true,
      },
    });

    const grandTotal = transactions.reduce((total, txn) => total + txn.savingsDeposits - (txn.withdrawals || 0), 0);
    const lastSavings = transactions[0]?.savingsDeposits || 0;
    const savingsFrequency = transactions.length;

    const individualData = {
      ...loanRequest,
      loanInterest: loanRequest.loanInterest || 0, // Ensure loanInterest is included
      expectedAmountToBePaidBack: loanRequest.expectedAmountToBePaidBack, // Add expected amount to be paid back
      grandTotal,
      lastSavings,
      savingsFrequency,
      member: {
        ...loanRequest.member,
        transactions,
      },
    };

    res.status(200).json(individualData);
  } catch (error) {
    console.error('Error fetching individual loan request:', error);
    res.status(500).json({ error: 'Failed to fetch individual loan request', details: error.message });
  }
});



// Fetch loan requests for a cooperative and member
app.get('/loan-requests', verifyFirebaseToken, async (req, res) => {
  const { role, cooperativeId, memberId } = req.user;

  console.log("Role:", role);
  console.log("Cooperative ID:", cooperativeId);
  console.log("Member ID:", memberId);
  try {
    let filter = {};
    if (role === 'cooperative-admin' && cooperativeId) {
      filter = { cooperativeId };
    } else if (role === 'member' && memberId) {
      filter = { memberId };
    } else {
      console.log("403 Forbidden: Unauthorized role or missing ID");
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const loanRequests = await prisma.loansRequested.findMany({
      where: filter,
      include: {
        member: {
          include: {
            memberDetails: true,
            memberSavings: true,
            loansApproved:true,
          },
        },
        cooperative: true,
      },
    });

    if (!loanRequests.length) {
      return res.status(404).json({ error: 'No loan requests found.' });
    }

    res.status(200).json(loanRequests);
  } catch (error) {
    console.error('Error fetching loan requests:', error.message);
    res.status(500).json({ error: 'Failed to fetch loan requests', details: error.message });
  }
});

app.get('/loan-stats', verifyFirebaseToken, async (req, res) => {
  try {
    const { role, memberId, cooperativeId } = req.user;

    console.log('Request received for loan stats');
    console.log('User Role:', role);
    console.log('Member ID:', memberId);
    console.log('Cooperative ID:', cooperativeId);

    let filter = {};
    if (role === 'cooperative-admin' && cooperativeId) {
      filter.cooperativeId = cooperativeId;
    } else if (role === 'member' && memberId) {
      filter.memberId = memberId;
    } else {
      console.warn('Unauthorized access attempt');
      return res.status(403).json({ error: 'Unauthorized' });
    }

    console.log('Filter applied:', filter);

    // Fetch loans
    const allLoans = await prisma.loansRequested.findMany({
      where: filter,
      include: { member: { select: { firstName: true, surname: true, email: true } } },
    });

    console.log('All Loans Fetched:', allLoans);

    // Helper functions for calculations
    const calculateTotalAmount = (records, field) =>
      records.reduce((sum, record) => sum + (record[field] || 0), 0);

    const calculateMonthlyStats = (records) => {
      const stats = {};
      records.forEach((record) => {
        const month = record.dateOfApplication.toISOString().slice(0, 7); // "YYYY-MM"
        if (!stats[month]) stats[month] = { count: 0, total: 0 };
        stats[month].count += 1;
        stats[month].total += record.expectedAmountToBePaidBack || 0;
      });
      return stats;
    };

    const calculateYearlyStats = (records) => {
      const stats = {};
      records.forEach((record) => {
        const year = record.dateOfApplication.toISOString().slice(0, 4); // "YYYY"
        if (!stats[year]) stats[year] = { count: 0, total: 0 };
        stats[year].count += 1;
        stats[year].total += record.expectedAmountToBePaidBack || 0;
      });
      return stats;
    };

    // Calculate stats
    const monthlyStats = calculateMonthlyStats(allLoans);
    const yearlyStats = calculateYearlyStats(allLoans);
    const totalAmountRequested = calculateTotalAmount(allLoans, 'amountRequired');
    const totalAmountGranted = calculateTotalAmount(allLoans, 'amountGranted');
    const totalLoans = allLoans.length;

    // Defaulter logic
    const now = new Date();
    const defaulters = [];
    for (const loan of allLoans) {
      if (new Date(loan.expectedReimbursementDate) < now && !loan.repaid) {
        const savingsDuringLoanPeriod = await prisma.memberSavings.findMany({
          where: {
            memberId: loan.memberId,
            dateOfEntry: {
              gte: new Date(loan.dateOfApplication),
              lte: new Date(loan.expectedReimbursementDate),
            },
          },
        });

        const totalSavings = calculateTotalAmount(savingsDuringLoanPeriod, 'savingsDeposits');
        if (totalSavings < loan.expectedAmountToBePaidBack) {
          defaulters.push({
            memberId: loan.memberId,
            loanId: loan.id,
            expectedAmountToBePaidBack: loan.expectedAmountToBePaidBack,
            totalSavings,
          });

          console.warn(`Defaulter detected: Member ${loan.memberId}, Loan ${loan.id}`);
          await admin.auth().setCustomUserClaims(loan.memberId, { debtor: true });
        }
      }
    }

    // Consolidated loan stats
    const loanStats = {
      totalAmountRequested,
      totalAmountGranted,
      totalLoans,
      monthly: monthlyStats,
      yearly: yearlyStats,
      defaulters,
    };

    console.log('Final Loan Stats:', JSON.stringify(loanStats, null, 2));

    res.status(200).json({ stats: loanStats, loans: allLoans });
  } catch (error) {
    console.error('Error fetching loan statistics:', error);
    res.status(500).json({ error: 'Failed to fetch loan statistics', details: error.message });
  }
});

app.post('/loan-requests/:loanId/approve-reject',verifyFirebaseToken, async (req, res) => {
  try {
    const { loanId } = req.params;
    const { action } = req.body; // action can be 'approve' or 'reject'

    // Find the loan request
    const loan = await prisma.loansRequested.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan request not found.' });
    }

    // Update loan status
    const updatedLoan = await prisma.loansRequested.update({
      where: { id: loanId },
      data: {
        approved: action === 'approve',
        rejected: action === 'reject',
        pending: false,
      },
    });

    // Get the current custom claims for the member to avoid overwriting
    const user = await admin.auth().getUser(loan.memberId);
    const currentClaims = user.customClaims || {};

    // Update custom claims to include the approved/rejected status
    await admin.auth().setCustomUserClaims(loan.memberId, {
      ...currentClaims,  // Spread existing claims
      approvedLoan: action === 'approve',
    });

    res.status(200).json({
      message: `Loan request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      updatedLoan,
    });
  } catch (error) {
    console.error('Error updating loan request:', error);
    res.status(500).json({ error: 'Failed to update loan request', details: error.message });
  }
});


app.get('/member/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const memberId = decodedToken.uid;

    // Find the logged-in member based on Firebase UID
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { memberDetails: true }, // Includes memberDetails
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member profile:', error);
    res.status(500).json({ error: 'Failed to fetch member profile', details: error.message });
  }
});

app.post('/loan-request/status',verifyFirebaseToken, async (req, res) => {
  const { loanId, newStatus } = req.body;

  try {
    // Fetch the loan request
    const loan = await prisma.loansRequested.update({
      where: { id: loanId },
      data: {
        pending: newStatus === 'pending',
        approved: newStatus === 'approved',
        rejected: newStatus === 'rejected',
      },
    });

    // If the loan is approved, move it to LoansApproved and set custom claims
    if (newStatus === 'approved') {
      // Move loan data to LoansApproved with a new unique ID
      await prisma.loansApproved.create({
        data: {
          // Generate a new unique ID for the LoansApproved entry
          id: undefined,  // Let Prisma auto-generate the new unique ID
          memberId: loan.memberId,
          cooperativeId: loan.cooperativeId,
          amountRequired: loan.amountRequired,
          purposeOfLoan: loan.purposeOfLoan,
          durationOfLoan: loan.durationOfLoan,
          bvn: loan.bvn,
          nameOfSurety1: loan.nameOfSurety1,
          surety1MembersNo: loan.surety1MembersNo,
          surety1telePhone: loan.surety1telePhone,
          nameOfSurety2: loan.nameOfSurety2,
          surety2MembersNo: loan.surety2MembersNo,
          surety2telePhone: loan.surety2telePhone,
          amountGranted: loan.amountGranted,
          loanInterest: loan.loanInterest,
          expectedAmountToBePaidBack: loan.expectedAmountToBePaidBack,
          expectedReimbursementDate: loan.expectedReimbursementDate,
          balanceInTheSavingsAccount: loan.balanceInTheSavingsAccount,
          surety1balanceInTheSavingsAccount: loan.surety1balanceInTheSavingsAccount,
          surety2balanceInTheSavingsAccount: loan.surety2balanceInTheSavingsAccount,
          amountGuaranteed: loan.amountGuaranteed,
          paymentVoucherNO: loan.paymentVoucherNO,
          repaymentsPrincipal: loan.repaymentsPrincipal,
          repaymentsInterest: loan.repaymentsInterest,
          balanceOutstandingPrincipal: loan.balanceOutstandingPrincipal,
          balanceOutstandingInterest: loan.balanceOutstandingInterest,
          balanceOutstandingTotal: loan.balanceOutstandingTotal,
          dateOfApplication: loan.dateOfApplication,
        },
      });

      // Set custom claims for the user (member)
      const user = await admin.auth().getUser(loan.memberId);
      const currentClaims = user.customClaims || {}; // Get current claims

      // Set the custom claim to indicate the loan is approved
      await admin.auth().setCustomUserClaims(loan.memberId, {
        ...currentClaims,  // Retain existing claims
        loanApproved: true,  // Add custom claim for approved loan
      });
    }

    // Respond with success
    res.status(200).json({ message: 'Loan status updated successfully', loan });
  } catch (error) {
    console.error('Error updating loan status:', error.message);
    res.status(500).json({ error: 'Failed to update loan status', details: error.message });
  }
});


app.post('/cooperative-admin-settings', verifyFirebaseToken, async (req, res) => {
  try {
    const { cooperativeId } = req.user;
    const adminSettings = req.body;

    const savedAdminSettings = await Promise.all(
      adminSettings.map(async (setting) => {
        return await prisma.cooperativeAdminSettings.create({
          data: {
            cooperativeId,
            loanFormPrice: setting.loanFormPrice,
            shareCapital: setting.shareCapital,
            entranceFee: setting.entranceFee,
            loanUpperLimit: setting.loanUpperLimit,
            monthsToLoan: setting.monthsToLoan,
            gracePeriod: setting.gracePeriod,
            increaseRate: setting.increaseRate
          },
        });
      })
    );

    res.status(201).json(savedAdminSettings);
  } catch (error) {
    console.error("Error saving loan interest settings:", error);
    res.status(500).json({ error: 'Failed to save loan interest settings' });
  }
});

app.post('/loan-interest-settings', verifyFirebaseToken, async (req, res) => {
  try {
    const { cooperativeId } = req.user;
    const settings = req.body;

    const savedSettings = await Promise.all(
      settings.map(async (setting) => {
        return await prisma.loanInterestSetting.create({
          data: {
            cooperativeId,
            minDurationMonths: setting.minDurationMonths,
            maxDurationMonths: setting.maxDurationMonths,
            durationInterestRate: setting.durationInterestRate,
            minAmount: setting.minAmount,
            maxAmount: setting.maxAmount,
            amountInterestRate: setting.amountInterestRate,
          },
        });
      })
    );

    res.status(201).json(savedSettings);
  } catch (error) {
    console.error("Error saving loan interest settings:", error);
    res.status(500).json({ error: 'Failed to save loan interest settings' });
  }
});

app.put('/edit-cooperative-admin-setting/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      loanFormPrice,
      shareCapital,
      entranceFee,
      loanUpperLimit,
      monthsToLoan,
      gracePeriod,
      increaseRate,
    } = req.body;

    console.log('Updating admin setting with ID:', id);

    let setting = await prisma.cooperativeAdminSettings.findUnique({
      where: { id },
    });

    if (!setting) {
      console.log('No settings found for ID. Creating default settings...');
      setting = await prisma.cooperativeAdminSettings.create({
        data: {
          cooperativeId: id, // Use the cooperativeId here
          loanFormPrice: 0,
          shareCapital: 0,
          entranceFee: 0,
          loanUpperLimit: 0,
          monthsToLoan: 0,
          gracePeriod: 0,
          increaseRate: 0,
        },
      });
    }

    const updatedSetting = await prisma.cooperativeAdminSettings.update({
      where: { id: setting.id },
      data: {
        loanFormPrice,
        shareCapital,
        entranceFee,
        loanUpperLimit,
        monthsToLoan,
        gracePeriod,
        increaseRate,
      },
    });

    console.log('Updated setting:', updatedSetting);

    res.status(200).json(updatedSetting);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ error: 'Failed to update admin settings' });
  }
});


// PUT: Update loan interest setting by ID
app.put('/edit-loan-interest-setting/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { minDurationMonths, maxDurationMonths, durationInterestRate, minAmount, maxAmount, amountInterestRate } = req.body;

    const updatedSetting = await prisma.loanInterestSetting.update({
      where: { id },
      data: { minDurationMonths, maxDurationMonths, durationInterestRate, minAmount, maxAmount, amountInterestRate },
    });

    res.status(200).json(updatedSetting);
  } catch (error) {
    console.error('Error updating loan interest setting:', error);
    res.status(500).json({ error: 'Failed to update loan interest setting' });
  }
});

app.get('/fetch-cooperative-admin-settings', verifyFirebaseToken, async (req, res) => {
  try {
    const { cooperativeId, role, memberId } = req.user;
    console.log("Role:", role);
    console.log("Cooperative ID:", cooperativeId);
    if (role === 'member') {
      console.log("Member ID:", memberId);
    }

    if (!cooperativeId) {
      console.log("403 Unauthorized: Cooperative ID missing");
      return res.status(403).json({ error: 'Unauthorized: Cooperative ID missing' });
    }
    if (!['cooperative-admin', 'member'].includes(role)) {
      console.log("403 Unauthorized: Insufficient permissions");
      return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
    }

    const settings = await prisma.cooperativeAdminSettings.findMany({
      where: { cooperativeId },
    });

    if (!settings.length) {
      console.log("404 Not Found: No loan interest settings");
      return res.status(404).json({ error: 'No loan interest settings found.' });
    }

    res.status(200).json(settings);
    // console.log("Loan interest settings fetched:", settings);
  } catch (error) {
    console.error("Error fetching loan interest settings:", error);
    res.status(500).json({ error: 'Failed to fetch loan interest settings' });
  }
});

app.get('/fetch-loan-interest-settings', verifyFirebaseToken, async (req, res) => {
  try {
    const { cooperativeId, role, memberId } = req.user;
    console.log("Role:", role);
    console.log("Cooperative ID:", cooperativeId);
    if (role === 'member') {
      console.log("Member ID:", memberId);
    }

    if (!cooperativeId) {
      console.log("403 Unauthorized: Cooperative ID missing");
      return res.status(403).json({ error: 'Unauthorized: Cooperative ID missing' });
    }
    if (!['cooperative-admin', 'member'].includes(role)) {
      console.log("403 Unauthorized: Insufficient permissions");
      return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
    }

    const settings = await prisma.loanInterestSetting.findMany({
      where: { cooperativeId },
    });

    if (!settings.length) {
      console.log("404 Not Found: No loan interest settings");
      return res.status(404).json({ error: 'No loan interest settings found.' });
    }

    res.status(200).json(settings);
    // console.log("Loan interest settings fetched:", settings);
  } catch (error) {
    console.error("Error fetching loan interest settings:", error);
    res.status(500).json({ error: 'Failed to fetch loan interest settings' });
  }
});

app.delete('/delete-cooperative-admin-setting/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cooperativeAdminSettings.delete({ where: { id } });
    res.status(200).json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error("Error deleting loan interest setting:", error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

app.delete('/delete-loan-interest-setting/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.loanInterestSetting.delete({ where: { id } });
    res.status(200).json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error("Error deleting loan interest setting:", error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});




app.put('/updateLoanAmount/:loanId', verifyFirebaseToken, async (req, res) => {
  const { loanId } = req.params; // This is the loanId from the URL
  const { amountGranted } = req.body;

  // Validate the amountGranted
  if (typeof amountGranted !== 'number' || amountGranted <= 0) {
    return res.status(400).json({ error: 'Invalid loan amount provided' });
  }

  try {
    // Fetch the loan request to retrieve related data
    const loanRequest = await prisma.loansRequested.findUnique({
      where: { id: loanId },
      include: {
        cooperative: true, // To fetch cooperativeId
      },
    });

    if (!loanRequest) {
      return res.status(404).json({ error: 'Loan request not found' });
    }

    const { cooperativeId, durationOfLoan, loanInterest } = loanRequest;

    // Fetch the cooperative admin settings for the loanFormPrice
    const adminSettings = await prisma.cooperativeAdminSettings.findFirst({
      where: { cooperativeId },
    });

    if (!adminSettings) {
      return res.status(404).json({ error: 'Admin settings for this cooperative not found' });
    }

    const loanFormPrice = adminSettings.loanFormPrice ?? 0;

    // Recalculate the expected amount to be paid back
    const interestAmount =
      amountGranted * (loanInterest / 100) * (durationOfLoan / 12);
    const expectedAmountToBePaidBack = amountGranted + interestAmount + loanFormPrice;

    // Update the loan amount and the recalculated expected amount to be paid back
    const updatedLoan = await prisma.loansRequested.update({
      where: { id: loanId },
      data: {
        amountGranted,
        expectedAmountToBePaidBack: parseFloat(expectedAmountToBePaidBack.toFixed(2)),
      },
    });

    res.json({
      message: 'Loan amount and expected repayment updated successfully',
      loan: updatedLoan,
    });
  } catch (error) {
    console.error('Error updating loan amount and repayment:', error);
    res.status(500).json({ error: 'Failed to update loan amount and repayment' });
  }
});


// Endpoint to get total savings for all members
app.get('/total-savings', verifyFirebaseToken, async (req, res) => {
  const { role, cooperativeId, memberId } = req.user;
  console.log("[INFO] Request received at /total-savings endpoint");
  console.log("[DEBUG] User Details:", { role, cooperativeId, memberId });

  try {
    let filter = {};
    if (role === 'cooperative-admin' && cooperativeId) {
      filter = { cooperativeId };
    } else if (role === 'member' && memberId) {
      filter = { memberId };
    } else {
      console.log("[WARN] 403 Forbidden: Unauthorized role or missing ID");
      return res.status(403).json({ error: 'Unauthorized' });
    }

    console.log("[INFO] Fetching transactions with filter:", filter);
    const transactions = await prisma.memberSavings.findMany({
      where: filter,
      select: {
        id: true,
        type: true,
        savingsDeposits: true,
        dateOfEntry: true,
      },
    });

    console.log("[DEBUG] Transactions fetched:", transactions);

    const calculateStats = (records) => {
      const monthlyStats = {};
      const yearlyStats = {};
      let totalAmount = 0;

      records.forEach((record) => {
        const amount = record.savingsDeposits || 0;
        totalAmount += amount;

        const date = new Date(record.dateOfEntry);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const year = date.getFullYear();

        // Monthly stats
        if (!monthlyStats[month]) {
          monthlyStats[month] = { count: 0, total: 0, ids: [] };
        }
        monthlyStats[month].count += 1;
        monthlyStats[month].total += amount;
        monthlyStats[month].ids.push(record.id);

        // Yearly stats
        if (!yearlyStats[year]) {
          yearlyStats[year] = { count: 0, total: 0, ids: [] };
        }
        yearlyStats[year].count += 1;
        yearlyStats[year].total += amount;
        yearlyStats[year].ids.push(record.id);
      });

      return {
        totalEntries: records.length,
        totalAmount,
        monthly: monthlyStats,
        yearly: yearlyStats,
      };
    };

    const contributions = transactions.filter((txn) => txn.type === 'contribution');
    const savings = transactions.filter((txn) => txn.type === 'savings');

    console.log("[DEBUG] Contributions:", contributions);
    console.log("[DEBUG] Savings:", savings);

    const contributionStats = calculateStats(contributions);
    const savingsStats = calculateStats(savings);
    const combinedStats = calculateStats(transactions);

    console.log("[INFO] Calculated Stats:");
    console.log("[DEBUG] Contribution Stats:", contributionStats);
    console.log("[DEBUG] Savings Stats:", savingsStats);
    console.log("[DEBUG] Combined Stats:", combinedStats);

    res.status(200).json({
      contributions: contributionStats,
      savings: savingsStats,
      combined: combinedStats,
    });
  } catch (error) {
    console.error("[ERROR] Failed to fetch savings statistics:", error);
    res.status(500).json({ error: 'Failed to fetch savings statistics', details: error.message });
  }
});


// Route to get specific member profile data
app.get('/member/profileSettings', verifyFirebaseToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const memberId = decodedToken.uid;

    // Find the logged-in member based on Firebase UID
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { 
        memberDetails: true,
        loansRequested: true,
        loansApproved: true,
        memberSavings: true,
      },
    });

    if (!member) {
      // Return empty data if the member doesn't exist
      return res.status(200).json({
        id: memberId,
        memberDetails: null,
        loansRequested: [],
        loansApproved: [],
        memberSavings: [],
      });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member profile:', error);
    res.status(500).json({ error: 'Failed to fetch member profile', details: error.message });
  }
});


app.get('/members',verifyFirebaseToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    const cooperativeId = decodedToken.uid;  // Assuming Firebase UID is used as cooperativeId
    if (!cooperativeId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Fetch members associated with this cooperativeId and include their details
    const members = await prisma.member.findMany({
      where: { cooperativeId },
      include: {
        memberDetails: true,  // Includes the memberDetails model
      },
    });

    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});


// app.post('/member/savings') - Route for handling savings deposits
app.post('/member/savings', verifyFirebaseToken, async (req, res) => {
  try {
    const { amount, type } = req.body;

    // Validate amount and type
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }
    if (!['savings', 'contribution'].includes(type)) {
      return res.status(400).json({ error: 'Invalid deposit type' });
    }

    const authHeader = req.headers.authorization;
    const memberId = await getMemberIdFromAuth(authHeader);
    const member = await findMemberById(memberId);

    const lastSavingsRecord = await prisma.memberSavings.findFirst({
      where: { memberId },
      orderBy: { dateOfEntry: 'desc' },
    });

    // Calculate new balance, withdrawals, and grand total
    const previousBalance = lastSavingsRecord?.savingsBalance || 0;
    const newBalance = previousBalance + amount;
    const totalWithdrawals = lastSavingsRecord?.totalWithdrawals || 0;
    const grandTotal = newBalance - totalWithdrawals;

    // Increment the savings frequency for each new deposit
    const savingsFrequency = (lastSavingsRecord?.savingsFrequency || 0) + 1;

    // Create a new savings deposit record
    const savingsDeposit = await prisma.memberSavings.create({
      data: {
        memberId,
        cooperativeId: member.cooperativeId,
        savingsDeposits: amount,
        withdrawals: 0,
        savingsBalance: newBalance,
        totalWithdrawals,
        grandTotal,
        savingsFrequency,
        type, // Track deposit type as either "savings" or "contribution"
      },
    });

    res.status(200).json(savingsDeposit);
  } catch (error) {
    console.error('Error processing savings deposit:', error);
    res.status(500).json({ error: 'Failed to process savings deposit' });
  }
});

const userId = 'RwgMDHi34YR9MfOEdPgf2WuxWRn1';

// Function to add the custom claim
const addCustomClaim = async () => {
  try {
    // Get the user record
    const userRecord = await admin.auth().getUser(userId);
    console.log('Current Custom Claims:', userRecord.customClaims);

    // Add or update the 'role: member' claim and 'kycCompleted' claim
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      ...userRecord.customClaims, // Preserve existing claims
      role: 'member',            // Add or update the 'role' claim
      kycCompleted: true,        // Set KYC to true
    });

    console.log(`Custom claims updated for user with ID: ${userId}`);
  } catch (error) {
    console.error('Error adding custom claim:', error.message);
  }
};

// Call the function when the app starts
addCustomClaim();



// File: /server/routes/memberStats.js
app.get('/member/savings/stats', verifyFirebaseToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const memberId = await getMemberIdFromAuth(authHeader);

    // Fetch cooperative settings
    const cooperative = await prisma.member.findUnique({
      where: { id: memberId },
      select: { cooperativeId: true },
    });

    if (!cooperative) {
      return res.status(404).json({ error: 'Cooperative not found for member' });
    }

    const cooperativeId = cooperative.cooperativeId;
    const adminSettings = await prisma.cooperativeAdminSettings.findFirst({
      where: { cooperativeId },
      select: { monthsToLoan: true, gracePeriod: true, increaseRate: true },
    });

    const { monthsToLoan = 0, gracePeriod = 0, increaseRate = 0 } = adminSettings || {};

    const memberDetails = await prisma.membersDetails.findUnique({
      where: { memberId },
      select: { amountPaid: true },
    });

    const amountPaid = memberDetails?.amountPaid || 0;

    // Fetch savings and loans records
    const allSavings = await prisma.memberSavings.findMany({
      where: { memberId },
      include: {
        member: { select: { firstName: true, surname: true, email: true } },
      },
    });

    const allLoans = await prisma.loansRequested.findMany({
      where: { memberId },
      include: {
        member: { select: { firstName: true, surname: true, email: true } },
      },
    });

    // Group savings and loans by date
    const recordsByDate = {};
    [...allSavings, ...allLoans].forEach((record) => {
      const date =
        record.dateOfEntry?.toISOString().slice(0, 10) ||
        record.dateOfApplication.toISOString().slice(0, 10);
      if (!recordsByDate[date]) {
        recordsByDate[date] = { date, savings: 0, contributions: 0, loans: 0, grandTotal: 0 };
      }

      if (record.type === 'savings') {
        recordsByDate[date].savings += record.savingsDeposits || 0;
      } else if (record.type === 'contribution') {
        recordsByDate[date].contributions += record.savingsDeposits || 0;
      } else if (record.expectedAmountToBePaidBack) {
        recordsByDate[date].loans += record.expectedAmountToBePaidBack || 0;
      }
    });

    // Sort records by date
    const sortedDates = Object.keys(recordsByDate).sort();

    // Initialize claims object before usage
    const claims = {}; // Moved to the top for consistency
    let cumulativeSavings = 0;
    let cumulativeLoans = 0;
    let defaulter = false;
    let ineligible = true;

    const now = new Date();
    const contributionCheck = new Map(); // Track months with contributions
    const stats = sortedDates.map((date) => {
      const record = recordsByDate[date];
      cumulativeSavings += record.savings || 0;
      cumulativeLoans += record.loans || 0;

      // Calculate grand total
      record.grandTotal = cumulativeSavings - cumulativeLoans;

      // Track months with contributions
      const month = date.slice(0, 7);
      if (record.contributions > 0) {
        contributionCheck.set(month, true);
      }

      return record;
    });

    // Check consecutive contributions for eligibility
    const monthsWithData = Array.from(contributionCheck.keys()).sort(); // Months with contributions (YYYY-MM)
    if (monthsWithData.length > 0) {
      const earliestMonth = new Date(`${monthsWithData[0]}-01`); // First contribution month
      const currentMonth = new Date();

      let consecutiveMonths = 0;

      // Generate all months between the first contribution and the current month
      const allMonths = [];
      let tempMonth = new Date(earliestMonth);

      while (tempMonth <= currentMonth) {
        allMonths.push(tempMonth.toISOString().slice(0, 7)); // Format YYYY-MM
        tempMonth.setMonth(tempMonth.getMonth() + 1); // Move to the next month
      }

      // Validate contributions for each month
      for (let i = 0; i < allMonths.length; i++) {
        const month = allMonths[i];

        if (contributionCheck.has(month)) {
          consecutiveMonths++;
        } else {
          consecutiveMonths = 0; // Reset if a month is missing
        }

        if (consecutiveMonths >= monthsToLoan) {
          ineligible = false;
          break;
        }
      }

      // Set ineligible flag in claims
      if (ineligible) {
        claims.ineligible = true;
      }
    }

    // Grace period logic for contributions
    const lastContributionDate = new Date(monthsWithData.at(-1) || 0);
    const nextDueDate = new Date(lastContributionDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    if (now > nextDueDate) {
      const graceEndDate = new Date(nextDueDate);
      graceEndDate.setDate(graceEndDate.getDate() + gracePeriod * 7);

      if (now > graceEndDate) {
        defaulter = true;
      }
    }

    // Loan repayment and custom claims
    for (const loan of allLoans) {
      const dueDate = new Date(loan.dateOfApplication);
      dueDate.setMonth(dueDate.getMonth() + loan.durationOfLoan);

      const graceEndDate = new Date(dueDate);
      graceEndDate.setDate(graceEndDate.getDate() + gracePeriod * 7);

      if (now > graceEndDate && !loan.repaid) {
        claims.debtor = true;

        // Accrue interest
        const monthsLate = Math.ceil((now - graceEndDate) / (1000 * 60 * 60 * 24 * 30));
        loan.expectedAmountToBePaidBack += monthsLate * increaseRate * loan.expectedAmountToBePaidBack;

        await prisma.loansRequested.update({
          where: { id: loan.id },
          data: { expectedAmountToBePaidBack: loan.expectedAmountToBePaidBack },
        });
      }
    }

    // Assign custom claims
       // Assign custom claims
       if (defaulter) claims.defaulter = true;

       // Retrieve existing custom claims to avoid overwriting them
       const userRecord = await admin.auth().getUser(memberId);
       const existingClaims = userRecord.customClaims || {};
   
       // Merge existing claims with new claims and update
       await admin.auth().setCustomUserClaims(memberId, {
         ...existingClaims, // Preserve current claims like 'role'
         ...claims,         // Add new claims (e.g., 'defaulter', 'debtor')
       });

    const response = {
      stats,
      defaulter,
      ineligible,
      eligibility: !ineligible
        ? 'Eligible for Loan'
        : 'Not Eligible: Missing consecutive contributions or outstanding loans',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching member savings stats:', error);
    res.status(500).json({ error: 'Failed to fetch member savings stats' });
  }
});



// Updated Route to Fetch Transactions for Member or Cooperative
app.get('/transactions', verifyFirebaseToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const memberId = decodedToken.uid;
    const role = decodedToken.role;
    const cooperativeId = req.query.cooperativeId;

    let transactions;

    if (role === 'cooperative-admin' && cooperativeId) {
      transactions = await prisma.memberSavings.findMany({
        where: { cooperativeId },
        include: {
          member: {
            select: {
              firstName: true,
              surname: true,
              email: true,
              memberDetails: { select: { telephone1: true } },
            },
          },
        },
        orderBy: { dateOfEntry: 'desc' },
      });
    } else if (role === 'member') {
      transactions = await prisma.memberSavings.findMany({
        where: { memberId },
        include: {
          member: {
            select: {
              firstName: true,
              surname: true,
              email: true,
              memberDetails: { select: { telephone1: true } },
            },
          },
        },
        orderBy: { dateOfEntry: 'desc' },
      });
    } else {
      return res.status(403).json({ error: 'Unauthorized to view transactions' });
    }

    if (transactions.length === 0) {
      console.log('No transactions found for the provided ID.');
    }

    // Fetch loans for each member to calculate the total loans granted as withdrawals
    const transactionsWithLoans = await Promise.all(transactions.map(async (transaction) => {
      const approvedLoans = await prisma.loansApproved.findMany({
        where: { memberId: transaction.memberId },
        select: { amountGranted: true },
      });

      const totalLoansGranted = approvedLoans.reduce((total, loan) => total + loan.amountGranted, 0);

      return {
        ...transaction,
        firstName: transaction.member?.firstName,
        surname: transaction.member?.surname,
        email: transaction.member?.email,
        telephone: transaction.member?.memberDetails?.telephone1,
        withdrawals: totalLoansGranted, // Total loans granted as "withdrawals"
        savingsBalance: transaction.savingsBalance - totalLoansGranted, // Adjusted balance
      };
    }));

    res.status(200).json(transactionsWithLoans);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});



// Modified route for fetching a single transaction
app.get('/single-transaction', verifyFirebaseToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const cooperativeId = decodedToken.cooperativeId;
    const memberId = decodedToken.uid;

    // Get the total amount of loans granted to the member
    const approvedLoans = await prisma.loansApproved.findMany({
      where: { memberId },
      select: { amountGranted: true },
    });
    const totalLoansGranted = approvedLoans.reduce((total, loan) => total + loan.amountGranted, 0);

    // Fetch latest transaction (if cooperative-admin or member)
    const transaction = await prisma.memberSavings.findFirst({
      where: cooperativeId ? { cooperativeId } : { memberId },
      include: {
        member: {
          select: {
            firstName: true,
            surname: true,
            email: true,
            memberDetails: { select: { telephone1: true } },
          },
        },
      },
      orderBy: { dateOfEntry: 'desc' },
    });

    if (!transaction) {
      return res.status(200).json({
        id: '',
        firstName: 'N/A',
        surname: 'N/A',
        email: 'N/A',
        dateOfEntry: 'N/A',
        telephone: 'N/A',
        savingsDeposits: 0,
        withdrawals: 0,
        savingsBalance: 0,
        totalWithdrawals: totalLoansGranted,
        grandTotal: 0,
      });
    }

    // Adjust grand total and define the latest deposit
    const latestDeposit = transaction.savingsDeposits;
    const totalSavings = transaction.savingsBalance;
    const grandTotal = totalSavings - totalLoansGranted;

    const flattenedTransaction = {
      ...transaction,
      firstName: transaction.member?.firstName,
      surname: transaction.member?.surname,
      email: transaction.member?.email,
      telephone: transaction.member?.memberDetails?.telephone1,
      totalWithdrawals: totalLoansGranted,
      savingsBalance: totalSavings,
      savingsDeposits: latestDeposit,
      grandTotal,
    };

    res.status(200).json(flattenedTransaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction', details: error.message });
  }
});


// app.post('/member/withdraw') - Route for handling withdrawals
app.post('/member/withdraw', async (req, res) => {
  try {
    const { amount } = req.body;
    const authHeader = req.headers.authorization;
    const memberId = await getMemberIdFromAuth(authHeader);

    const lastSavingsRecord = await prisma.memberSavings.findFirst({
      where: { memberId },
      orderBy: { dateOfEntry: 'desc' },
    });

    const newBalance = (lastSavingsRecord?.savingsBalance || 0) - amount;
    const newTotalWithdrawals = (lastSavingsRecord?.totalWithdrawals || 0) + amount;

    const withdrawal = await prisma.memberSavings.create({
      data: {
        memberId,
        cooperativeId: lastSavingsRecord?.cooperativeId,
        savingsDeposits: 0,
        withdrawals: amount,
        savingsBalance: newBalance,
        totalWithdrawals: newTotalWithdrawals,
        grandTotal: newBalance,
      },
    });

    // Initiate bank transfer using Flutterwave (this requires additional integration)
    const transferResponse = await flutterwaveTransferToBank(amount, memberId);
    res.status(200).json(withdrawal);
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});


//Update user role or role assignment
app.post('/update-user-role/:uid',loginLimiter, async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (role === undefined) {
      return res.status(400).json({ error: 'Role is missing in the request body' });
    }

    // Update the 'role' field in the Firestore collection for the specified user
    await admin.firestore().collection('userroles').doc(uid).update({
      role: role,
    });

    res.status(200).json({ message: 'User role updated successfully in Firestore' });
  } catch (error) {
    console.error('Error updating user role in Firestore:', error);
    res.status(500).json({ error: 'User role update in Firestore failed' });
  }
});


// Role assignment route to assign the 'admin' role
app.post('/assign-admin-role/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Get the existing custom claims
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};

    // Merge the new 'admin' role with the existing claims
    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      admin: true,
    });

    res.status(200).json({ message: 'Admin role assigned successfully' });
  } catch (error) {
    console.error('Error assigning admin role:', error);
    res.status(500).json({ error: 'Admin role assignment failed' });
  }
});

// Role assignment route to assign the 'moderator' role
app.post('/assign-moderator-role/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Get the existing custom claims
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};

    // Merge the new 'moderator' role with the existing claims
    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      moderator: true,
    });

    res.status(200).json({ message: 'Moderator role assigned successfully' });
  } catch (error) {
    console.error('Error assigning moderator role:', error);
    res.status(500).json({ error: 'Moderator role assignment failed' });
  }
});

// Role assignment route to assign the 'default' role
app.post('/assign-default-role/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Get the existing custom claims
    const user = await admin.auth().getUser(uid);
    const currentClaims = user.customClaims || {};

    // Merge the 'default' role with the existing claims
    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      admin: false,
      moderator: false,
    });

    res.status(200).json({ message: 'Default role assigned successfully' });
  } catch (error) {
    console.error('Error assigning default role:', error);
    res.status(500).json({ error: 'Default role assignment failed' });
  }
});

app.post('/assign-role/:uid/:role', async (req, res) => {
  try {
    const { uid, role } = req.params;

    // Check if the specified role is one of the allowed roles
    if (role !== 'admin' && role !== 'user' && role !== 'default') {
      res.status(400).json({ error: 'Invalid role specified' });
      return;
    }

    // Set the custom claim for the specified user
    await admin.auth().setCustomUserClaims(uid, { [role]: true });

    res.status(200).json({ message: `${role} role assigned successfully` });
  } catch (error) {
    console.error(`Error assigning ${role} role:`, error);
    res.status(500).json({ error: `${role} role assignment failed` });
  }
});

app.post('/check-user-role',loginLimiter, async (req, res) => {
  try {
    const { uid } = req.body;
    // console.log('Fetching user role for UID:', uid);
    const user = await admin.auth().getUser(uid);

    // console.log('User retrieved from Firebase:', user);
    // console.log('User custom claims:', user.customClaims);

    // Check and return the role from custom claims
    const role = user.customClaims?.admin ? 'admin' :
                 user.customClaims?.moderator ? 'moderator' :
                 'default';
    // console.log('Fetched role:', role);

    res.json({ role });
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ error: 'Error checking user role' });
  }
});

//fetch data for corporate kyc

app.get('/get-corporate-data',loginLimiter, async (req, res) => {
  getFormData(req, res, 'corporate-kyc')
});
// Function to handle form submission
async function handleFormSubmission(req, res, formType, collectionName) {
  const formData = req.body;

  // Perform validation as needed here...

  try {
    const docId = uuidv4();

    // Add form to the Firestore collection
    await admin.firestore().collection(collectionName).doc(docId).set({
      ...formData,
      status: 'processing',   
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Fetch admin emails
    const adminEmails = await getAllAdminEmails();

    // Send email to admins if found
    if (adminEmails.length > 0) {
      await sendEmailToAdmins(adminEmails, formType, formData);
    } else {
      // console.log('No admin emails found');
    }

    // Fetch document and format created date
    const doc = await admin.firestore().collection(collectionName).doc(docId).get();
    const createdAtTimestamp = doc.data().timestamp;
    const createdAtDate = createdAtTimestamp.toDate();
    const formattedDate = `${String(createdAtDate.getDate()).padStart(2, '0')}/${String(createdAtDate.getMonth() + 1).padStart(2, '0')}/${String(createdAtDate.getFullYear())}`;

    // Update the document with formatted date
    await admin.firestore().collection(collectionName).doc(docId).update({
      createdAt: formattedDate,
    });

    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error('Error during form submission:', err);
    res.status(500).json({ error: 'Form submission failed' });
  }
}

app.post('/submit-individual-form',loginLimiter, (req, res) => {
  handleFormSubmission(req, res, 'Individual CDD', 'individual-kyc');
});

async function handleFormEdit(req, res, collectionName){
  const {docId} = req.params;
  const formData = req.body

  try{
    await admin.firestore().collection(collectionName).doc(docId).update({
      ...formData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    const doc = await admin.firestore().collection(collectionName).doc(docId).get();
    const updatedAtTimestamp = doc.data().timestamp;
    const updatedAtDate = updatedAtTimestamp.toDate();
    const formattedDate = `${String(updatedAtDate.getDate()).padStart(2, '0')}/${String(updatedAtDate.getMonth() + 1).padStart(2, '0')}/${String(updatedAtDate.getFullYear())}`;

    await admin.firestore().collection(collectionName).doc(docId).update({
      updatedAt: formattedDate,
    });

    res.status(200).json({ message: 'Form updated successfully' });
  } catch (err) {
    console.error('Error during form update:', err);
    res.status(500).json({ error: 'Form update failed' });
  }

  }

app.post('/edit-corporate-kyc-form/:docId', async (req, res) => {
  handleFormEdit(req, res, 'corporate-kyc-form')
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});