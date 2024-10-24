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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

    // Send verification email
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);
    console.log('Verification link:', verificationLink);

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'cooperative-admin',
      kycIncomplete: true,
    });

    // Save cooperative data in Prisma with the Firebase user ID as cooperativeId
    const cooperative = await prisma.cooperative.create({
      data: {
        cooperativeName: cooperativeName,
        email: email,
        id: userRecord.uid,  // Use the Firebase user ID as the cooperativeId
      },
    });

    res.status(201).json({
      message: 'User created, verification email sent',
      cooperativeId: userRecord.uid,
      cooperative,
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


// KYC submission route: /cooperative-kyc
app.post('/cooperative-kyc', async (req, res) => {
  const { cooperativeId, ...memberKycData } = req.body;

  try {
    // Save cooperative KYC details in Prisma
    const cooperativeDetails = await prisma.cooperativeDetails.create({
      data: {
        cooperative: {
          connect: { id: cooperativeId },
        },
        ...memberKycData,  // This includes cooperativeName and other KYC data
      },
    });

    // Fetch the current custom claims for the user
    const firebaseUser = await admin.auth().getUser(cooperativeId);
    const currentClaims = firebaseUser.customClaims || {};

    // Retain the role and update kycIncomplete claim to false
    await admin.auth().setCustomUserClaims(firebaseUser.uid, {
      ...currentClaims,
      kycIncomplete: false, // Update the KYC status
    });

    res.status(200).json({
      message: 'KYC completed successfully',
      cooperativeDetails,
    });
  } catch (error) {
    console.error('Error saving to Prisma:', error);
    res.status(500).json({ error: 'Error saving to Prisma', details: error.message });
  }
});

app.get('/cooperatives', async (req, res) => {
  try {
    const cooperatives = await prisma.cooperative.findMany({
      select: { id: true, cooperativeName: true },
    });
    res.status(200).json(cooperatives);
  } catch (error) {
    console.error('Error fetching cooperatives:', error);
    res.status(500).json({ error: 'Failed to fetch cooperatives' });
  }
});

app.get('/get-cooperatives', async (req, res) => {
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


app.post('/register-member', async (req, res) => {
  const { email, firstName, surname, cooperativeId, password } = req.body;

  try {
    // Validate inputs
    if (!email || !firstName || !surname || !cooperativeId || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
        id: userRecord.uid, // Use Firebase user ID as member ID
      },
    });

    res.status(201).json({
      message: 'Member registered successfully',
      member,
      memberId: userRecord.uid,
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

app.get('/get-member-cooperative/:memberId', async (req, res) => {
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
app.post('/loan-request', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const memberId = await getMemberIdFromAuth(authHeader); // Validate authorization and get memberId
    
    const {
      cooperativeId, amountRequired, purposeOfLoan, durationOfLoan, bvn,
      nameOfSurety1, surety1MembersNo, surety1telePhone,
      nameOfSurety2, surety2MembersNo, surety2telePhone,
    } = req.body;

    // Validate required fields
    if (!cooperativeId || !amountRequired || !purposeOfLoan || !durationOfLoan || !bvn) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const member = await findMemberById(memberId); // Check if the member exists
    const cooperative = await findCooperativeById(cooperativeId); // Check if the cooperative exists

    // Calculate interest and repayment details
    const interestRate = 10.0;
    const amountGranted = parseFloat(amountRequired);
    const loanInterest = amountGranted * (interestRate / 100) * (parseInt(durationOfLoan) / 12);
    const expectedReimbursementDate = new Date();
    expectedReimbursementDate.setMonth(expectedReimbursementDate.getMonth() + parseInt(durationOfLoan));

    // Create the loan request
    const loansRequested = await prisma.loansRequested.create({
      data: {
        cooperative: { connect: { id: cooperativeId } },
        member: { connect: { id: memberId } },
        amountRequired: amountGranted,
        purposeOfLoan,
        durationOfLoan: parseInt(durationOfLoan),
        bvn,
        nameOfSurety1, surety1MembersNo, surety1telePhone,
        nameOfSurety2, surety2MembersNo, surety2telePhone,
        amountGranted,
        loanInterest,
        expectedReimbursementDate,
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


// Fetch loan requests for a cooperative and member
app.get('/loan-requests', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const memberId = await getMemberIdFromAuth(authHeader); // Validate authorization and get memberId
    
    const { cooperativeId } = req.query; // cooperativeId is optional

    // Build the query filter dynamically based on the presence of cooperativeId
    const filter = cooperativeId
      ? { cooperativeId: cooperativeId } // Fetch by cooperativeId (for cooperative-admins)
      : { memberId: memberId };          // Fetch by memberId (for members)

    // Fetch the loan requests with the appropriate filter
    const loanRequests = await prisma.loansRequested.findMany({
      where: filter,
      include: {
        member: {
          include: {
            memberDetails: true,  // Include member details (e.g., surname, firstName, etc.)
          },
        },
        cooperative: true,         // Include cooperative details
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



app.post('/loan-requests/:loanId/approve-reject', async (req, res) => {
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


// app.post('/approve-loan', async (req, res) => {
//   const { loanId, memberId } = req.body;

//   try {
//     // Fetch the loan details
//     const loanRequest = await prisma.loansRequested.findUnique({
//       where: { id: loanId },
//     });

//     if (!loanRequest) {
//       return res.status(404).json({ error: 'Loan request not found' });
//     }

//     // Update Firebase custom claims to mark the loan as approved
//     await admin.auth().setCustomUserClaims(memberId, {
//       onLoanRequest: false,
//       onLoan: true,  // Loan has been approved
//     });

//     // Copy loan request to loansApproved model
//     const approvedLoan = await prisma.loansApproved.create({
//       data: {
//         ...loanRequest,  // Copy all the loan request data
//         member: { connect: { id: memberId } },
//         cooperative: { connect: { id: loanRequest.cooperativeId } },
//       },
//     });

//     // Optionally, delete the loan request record or keep it for history
//     await prisma.loansRequested.delete({
//       where: { id: loanId },
//     });

//     res.status(200).json({
//       message: 'Loan approved successfully',
//       approvedLoan,
//     });

//   } catch (error) {
//     console.error('Error approving loan:', error);
//     res.status(500).json({ error: 'Error approving loan', details: error.message });
//   }
// });


app.post('/loan-request/status', async (req, res) => {
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

// KYC submission route: /member-kyc
app.post('/member-kyc', async (req, res) => {
  const { memberId, ...memberKycData } = req.body;

  try {
    if (!memberId || Object.keys(memberKycData).length === 0) {
      return res.status(400).json({ error: 'Member ID or KYC data is missing.' });
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const membersDetails = await prisma.membersDetails.create({
      data: {
        member: { connect: { id: memberId } },
        ...memberKycData,
      },
    });

    const firebaseUser = await admin.auth().getUser(memberId);
    const currentClaims = firebaseUser.customClaims || {};

    await admin.auth().setCustomUserClaims(firebaseUser.uid, {
      ...currentClaims,
      kycCompleted: true,
    });

    res.status(200).json({
      message: 'KYC completed successfully',
      membersDetails,
    });
  } catch (error) {
    console.error('Error processing KYC:', error);
    res.status(500).json({ error: 'Error during KYC processing', details: error.message });
  }
});

app.get('/members', async (req, res) => {
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

app.get('/members', async (req, res) => {
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

app.get('/members', async (req, res) => {
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

app.get('/members', async (req, res) => {
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

app.get('/members', async (req, res) => {
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

app.get('/members', async (req, res) => {
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

app.get('/members', async (req, res) => {
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