// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // Create Admin
//   const admin = await prisma.admin.create({
//     data: {
//       username: 'admin_user',
//     },
//   });

//   // Create a Cooperative
//   const cooperative = await prisma.cooperative.create({
//     data: {
//       cooperativeName: 'Sample Cooperative',
//     },
//   });

//   // Create Members
//   const member1 = await prisma.member.create({
//     data: {
//       surname: 'Smith',
//       firstName: 'John',
//       middleName: 'A',
//       email: 'john.smith@example.com',
//       dateOfBirth: new Date('1985-10-10'),
//       sex: 'Male',
//       cooperativeId: cooperative.id, // Linking to Cooperative
//     },
//   });

//   const member2 = await prisma.member.create({
//     data: {
//       surname: 'Doe',
//       firstName: 'Jane',
//       middleName: 'B',
//       email: 'jane.doe@example.com',
//       dateOfBirth: new Date('1990-03-15'),
//       sex: 'Female',
//       cooperativeId: cooperative.id, // Linking to Cooperative
//     },
//   });

//   // Create MemberDetails for member1
//   await prisma.memberDetails.create({
//     data: {
//       surname: 'Smith',
//       firstName: 'John',
//       middleName: 'A',
//       email: 'john.smith@example.com',
//       dateOfBirth: new Date('1985-10-10'),
//       sex: 'Male',
//       memberId: member1.id,
//     },
//   });

//   // Create MemberSavings for member1
//   await prisma.memberSavings.create({
//     data: {
//       surname: 'Smith',
//       firstName: 'John',
//       middleName: 'A',
//       dateOfEntry: new Date(),
//       telephone: '123456789',
//       savingsDeposits: '5000',
//       withdrawals: '500',
//       savingsBalance: '4500',
//       grandTotal: '5000',
//       memberId: member1.id,
//       cooperativeId: cooperative.id,
//     },
//   });

//   // Create a Role for member1
//   await prisma.role.create({
//     data: {
//       name: 'Admin',
//       isGlobal: true,
//       memberId: member1.id,
//       cooperativeId: cooperative.id,
//     },
//   });

//   // Create LoansRequested
//   await prisma.loansRequested.create({
//     data: {
//       surname: 'Doe',
//       firstName: 'Jane',
//       middleName: 'B',
//       membersNo: '12345',
//       amountRequired: '20000',
//       purposeOfLoan: 'Business Expansion',
//       dateOfApplication: '2024-01-01',
//       durationOfLoan: '12 months',
//       balanceInTheSavingsAccount: '5000',
//       bvnNumber: '12345678901',
//       nameOfSurety1: 'James Bond',
//       surety1MembersNo: '54321',
//       surety1telePhone: '0987654321',
//       surety1balanceInTheSavingsAccount: '6000',
//       nameOfSurety2: 'Tony Stark',
//       surety2MembersNo: '56789',
//       surety2telePhone: '1234567890',
//       surety2balanceInTheSavingsAccount: '7000',
//       amountGuaranteed: '15000',
//       paymentVoucherNO: 'PV1234',
//       amountGranted: '18000',
//       loanInterest: '2000',
//       repaymentsPrincipal: '3000',
//       repaymentsInterest: '500',
//       balanceOutstandingPrincipal: '15000',
//       balanceOutstandingInterest: '1500',
//       balanceOutstandingTotal: '16500',
//       approved: false,
//       rejected: false,
//       pending: true,
//       cooperativeId: cooperative.id,
//     },
//   });

//   // Create LoansApproved for member2
//   await prisma.loansApproved.create({
//     data: {
//       surname: 'Smith',
//       firstName: 'John',
//       middleName: 'A',
//       membersNo: '12345',
//       amountRequired: '15000',
//       purposeOfLoan: 'Car Purchase',
//       dateOfApplication: '2024-01-10',
//       durationOfLoan: '10 months',
//       balanceInTheSavingsAccount: '3000',
//       bvnNumber: '0987654321',
//       nameOfSurety1: 'Steve Rogers',
//       surety1MembersNo: '98765',
//       surety1telePhone: '111222333',
//       surety1balanceInTheSavingsAccount: '5000',
//       nameOfSurety2: 'Bruce Wayne',
//       surety2MembersNo: '24680',
//       surety2telePhone: '555555555',
//       surety2balanceInTheSavingsAccount: '8000',
//       amountGuaranteed: '14000',
//       paymentVoucherNO: 'PV5678',
//       amountGranted: '15000',
//       loanInterest: '1000',
//       repaymentsPrincipal: '2000',
//       repaymentsInterest: '300',
//       balanceOutstandingPrincipal: '13000',
//       balanceOutstandingInterest: '700',
//       balanceOutstandingTotal: '13700',
//       cooperativeId: cooperative.id,
//     },
//   });

//   // Create Debtor for member1
//   await prisma.debtor.create({
//     data: {
//       surname: 'Doe',
//       firstName: 'Jane',
//       middleName: 'B',
//       cooperativeId: cooperative.id,
//       dateLoanReceived: new Date(),
//       noOfMonths: 12,
//       membersCapital: 10000,
//       ordinarySavings: 5000,
//       specialSavings: 2000,
//       memberLoan: 30000,
//       interestOnLoan: 5000,
//       memberId: member2.id, // Link to member2 (Jane)
//     },
//   });
// }

// main()
//   .then(() => {
//     console.log('Database has been seeded!');
//   })
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.admin.create({
    data: {
      username: 'admin_user',
    },
  });

  // Create a Cooperative
  
  const cooperative = await prisma.cooperative.create({
    data: {
      cooperativeName: 'Sample Cooperative',   
      email: 'contact@samplecooperative.com',
    },
  });

  const cooperativeDetails = await prisma.cooperativeDetails.create({
    data:{
      registrationNumber: 'REG123456',
      dateOfIncorporation: new Date('2020-01-01'),
      address: '123 Main Street',
      phoneNumber: '1234567890',
      totalMembers : "520",
      totalDebtors:'180',
      totalSavings: 50000,
      totalDebt: 20000,
      totalLoansRequested: 30000,
      totalLoansApproved: 25000,
      directorName: 'John Director',
      directorPosition: 'CEO',
      directorEmail: 'john.director@example.com',
      directorPhoneNumber: '08012345678',
      directorDateOfBirth: new Date('1975-06-15'),
      directorPlaceOfBirth: 'Lagos, Nigeria',
      directorNationality: 'Nigerian',
      directorOccupation: 'Business Executive',
      directorBVNNumber: '12345678901',
      directorIDType: 'INTERNATIONALPASSPORT', // Corrected value
      directorIDNumber: 'A12345678',
      directorIssuedDate: '2022-05-01',
      directorExpiryDate: '2032-05-01',
      directorSourceOfIncome: 'SALARYORBUSINESSINCOME', // Make sure this matches your enum as well
      totalProfit: 10000,
      cooperativeId: cooperative.id,
    }
  })
  // Create a Director
  // const director = await prisma.director.create({
  //   data: {
  //     directorName: 'John Director',
  //     directorPosition: 'CEO',
  //     directorEmail: 'john.director@example.com',
  //     directorPhoneNumber: '08012345678',
  //     directorDateOfBirth: new Date('1975-06-15'),
  //     directorPlaceOfBirth: 'Lagos, Nigeria',
  //     directorNationality: 'Nigerian',
  //     directorOccupation: 'Business Executive',
  //     directorBVNNumber: '12345678901',
  //     directorIDType: 'PASSPORT',
  //     directorIDNumber: 'A12345678',
  //     directorIssuedDate: '2022-05-01',
  //     directorExpiryDate: '2032-05-01',
  //     directorSourceOfIncome: 'BUSINESS',
  //     cooperativeId: cooperative.id, // Linking to the cooperative
  //   },
  // });
  

  // Create Members
  
  const member1 = await prisma.member.create({
    data: {
      surname: 'Smith',
      firstName: 'John',
      // middleName: 'A',
      email: 'john.smith@example.com',
      // // phoneNumber: '111222333',
      // dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      // sex: 'MALE',
      cooperativeId: cooperative.id, // Linking to Cooperative
      // img: 'https://example.com/image.jpg', // Add a placeholder or actual image URL
    },
  });

  const member2 = await prisma.member.create({
    data: {
      surname: 'Doe',
      firstName: 'Jane',
      // middleName: 'B',
      email: 'jane.doe@example.com',
      // // phoneNumber: '444555666',
      // dateOfBirth:  new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      // sex: 'FEMALE',
      cooperativeId: cooperative.id, // Linking to Cooperative
      // img: 'https://example.com/image.jpg', // Add a placeholder or actual image URL
    },
  });

  // Create MemberDetails for member1
  await prisma.membersDetails.create({
    data: {
      memberId: member1.id,
      surname: 'Smith',
      firstName: 'John',
      middleName: 'A',
      dateOfEntry:  new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      telephone1: '111222333',
      telephone2: '444555666',
      email: 'john.smith@example.com',
      dateOfBirth: '1985-10-10',
      sex: 'MALE',
      maritalStatus: 'Married',
      occupation: 'Engineer',
      business: 'Tech Consulting',
      residentialAddress: '456 Market St',
      lga: 'Local Area 1',
      state: 'State A',
      permanentHomeAddress: '789 Permanent St',
      stateOfOrigin: 'State A',
      lga2: 'Local Area 2',
      amountPaid: '10000',
      nextOfKinName: 'Mary Smith',
      nextOfKinPhone: '555666777',
      nextOfKinPhone2: '888999000',
      sponsor: 'Corporate Sponsor Inc',
    },
  });

  // Create MemberSavings for member1
  await prisma.memberSavings.create({
    data: {
      memberId: member1.id,
      cooperativeId: cooperative.id,
      surname: 'Smith',
      firstName: 'John',
      middleName: 'A',
      dateOfEntry: new Date(),
      telephone: '111222333',
      savingsDeposits: '5000',
      withdrawals: '500',
      savingsBalance: '4500',
      grandTotal: '5000',
    },
  });

  // Create a Role for member1
  await prisma.role.create({
    data: {
      name: 'Admin',
      isGlobal: true,
      memberId: member1.id,
      cooperativeId: cooperative.id,
    },
  });

  // Create LoansRequested for member2
  await prisma.loansRequested.create({
    data: {
      memberId: member2.id,
      cooperativeId: cooperative.id,
      surname: 'Doe',
      firstName: 'Jane',
      middleName: 'B',
      membersNo: 'MNO12345',
      amountRequired: '20000',
      purposeOfLoan: 'Business Expansion',
      dateOfApplication: '2024-01-01',
      durationOfLoan: '12 months',
      balanceInTheSavingsAccount: '5000',
      bvnNumber: '12345678901',
      nameOfSurety1: 'James Bond',
      surety1MembersNo: '54321',
      surety1telePhone: '0987654321',
      surety1balanceInTheSavingsAccount: '6000',
      nameOfSurety2: 'Tony Stark',
      surety2MembersNo: '56789',
      surety2telePhone: '1234567890',
      surety2balanceInTheSavingsAccount: '7000',
      amountGuaranteed: '15000',
      paymentVoucherNO: 'PV1234',
      amountGranted: '18000',
      loanInterest: '2000',
      repaymentsPrincipal: '3000',
      repaymentsInterest: '500',
      balanceOutstandingPrincipal: '15000',
      balanceOutstandingInterest: '1500',
      balanceOutstandingTotal: '16500',
      approved: false,
      rejected: false,
      pending: true,
    },
  });

  // Create LoansApproved for member1
  await prisma.loansApproved.create({
    data: {
      memberId: member1.id,
      cooperativeId: cooperative.id,
      surname: 'Smith',
      firstName: 'John',
      middleName: 'A',
      membersNo: 'MNO54321',
      amountRequired: '15000',
      purposeOfLoan: 'Car Purchase',
      dateOfApplication: '2024-01-10',
      durationOfLoan: '10 months',
      balanceInTheSavingsAccount: '3000',
      bvnNumber: '0987654321',
      nameOfSurety1: 'Steve Rogers',
      surety1MembersNo: '98765',
      surety1telePhone: '111222333',
      surety1balanceInTheSavingsAccount: '5000',
      nameOfSurety2: 'Bruce Wayne',
      surety2MembersNo: '24680',
      surety2telePhone: '555555555',
      surety2balanceInTheSavingsAccount: '8000',
      amountGuaranteed: '14000',
      paymentVoucherNO: 'PV5678',
      amountGranted: '15000',
      loanInterest: '1000',
      repaymentsPrincipal: '2000',
      repaymentsInterest: '300',
      balanceOutstandingPrincipal: '13000',
      balanceOutstandingInterest: '700',
      balanceOutstandingTotal: '13700',
    },
  });

  // Create Debtor for member2
  await prisma.debtor.create({
    data: {
      memberId: member2.id,
      cooperativeId: cooperative.id,
      // // surname: 'Doe',
      // firstName: 'Jane',
      // middleName: 'B',
      dateLoanReceived: new Date(),
      noOfMonths: 12,
      membersCapital: 10000,
      ordinarySavings: 5000,
      specialSavings: 2000,
      memberLoan: 30000,
      interestOnLoan: 5000,
    },
  });
}

main()
  .then(() => {
    console.log('Database has been seeded!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
