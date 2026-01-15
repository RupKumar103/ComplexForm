// import { z } from "zod";

// export const StudentFormSchema = z.object({
//   // 1. Personal & Biometric Details
//   firstName: z.string().min(1, { message: "First Name is required" }),
//   middleName: z.string().optional(),
//   lastName: z.string().min(1, { message: "Last Name is required" }),
//   dateofBirth: z.string().min(1, { message: "Date of Birth is required" })
//     .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  
//   gender: z.number().int().min(0).max(1), // 1 = Male, 0 = Female
  
//   // personalDetail
//   personalDetail: z.object({
//     bloodGroup: z.string().optional(),
//     religion: z.string().optional(),
//     caste: z.string().min(1, { message: "Ethnicity/Caste is required" }),
//     ethnicityType: z.string().min(1, { message: "Select Ethnicity is required" }),
//   }),

//   // disablility (note: typo in original type, kept as-is)
//   disablility: z.object({
//     disability: z.string().optional(), // "None" or description
//     disablilityType: z.string().optional(),
//     disabilityPercentage: z.number().min(0).max(100).optional(),
//   }).refine((data) => {
//     if (data.disability && data.disability !== "None") {
//       return !!data.disablilityType && data.disabilityPercentage !== undefined;
//     }
//     return true;
//   }, {
//     message: "Disability type and percentage are required if disability is selected",
//     path: ["disablilityType"],
//   }),

//   // contact
//   contact: z.object({
//     email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
//     primaryMobile: z.string().regex(/^\d{10}$/, { message: "Primary Mobile must be 10 digits" }),
//     secondaryMobile: z.string().regex(/^\d{10}$/).optional().or(z.literal("")),
//     alternateEmail: z.string().email().optional().or(z.literal("")),
//     contactName: z.string().min(1, { message: "Emergency Contact Name is required" }),
//     contactNumber: z.string().regex(/^\d{10}$/, { message: "Emergency Contact Number must be 10 digits" }),
//   }),

//   // addresses (array with at least permanent, temporary optional or sameAsPermanent)
//   addresses: z.array(z.object({
//     sameAsPermanent: z.boolean(),
//     province: z.string().min(1, { message: "Province is required" }),
//     district: z.string().min(1, { message: "District is required" }),
//     municipalityVDC: z.string().min(1, { message: "Municipality/VDC is required" }),
//     wardNumber: z.number().min(1, { message: "Ward Number is required" }),
//     toleStreet: z.string().min(1, { message: "Tole/Street is required" }),
//     houseNumber: z.string().optional(),
//   })).min(1, { message: "At least permanent address is required" })
//     .refine((addresses) => {
//       const hasTemporary = addresses.length > 1 || addresses.some(a => !a.sameAsPermanent);
//       return addresses.some(a => a.sameAsPermanent || hasTemporary);
//     }, { message: "Temporary address required unless same as permanent" }),

//   // academicHistories
//   academicHistories: z.array(z.object({
//     qualification: z.string().min(1, { message: "Qualification is required" }),
//     boardUniversity: z.string().min(1, { message: "Board/University is required" }),
//     institutionName: z.string().min(1, { message: "Institution Name is required" }),
//     passedYear: z.number().min(1900, { message: "Invalid year" }),
//     gpaorDivision: z.string().min(1, { message: "GPA/Division is required" }),
//     marksheetPath: z.union([z.instanceof(File), z.string()]).optional(),
//   })).min(1, { message: "At least one academic history is required" }),

//   // documents (accept File objects or existing URL strings)
//   documents: z.object({
//     photoUrl: z.union([z.instanceof(File), z.string().min(1, { message: "Photo upload is required" })]),
//     signaturePath: z.union([z.instanceof(File), z.string().min(1, { message: "Signature upload is required" })]),
//     citizenshipCopyPath: z.union([z.instanceof(File), z.string()]).optional(),
//     citizenshipDocumentPath: z.union([z.instanceof(File), z.string().min(1, { message: "Citizenship copy upload is required" })]),
//     characterCertificatePath: z.union([z.instanceof(File), z.string()]).optional(),
//     provisionalAdmitCardPath: z.union([z.instanceof(File), z.string()]).optional(),
//   }),

//   // extracurriculars
//   extracurriculars: z.array(z.object({
//     activityType: z.string().min(1, { message: "Activity type is required" }),
//     otherDetails: z.string().optional(),
//   })).optional(),

//   // financial
//   financial: z.object({
//     feeCategory: z.string().min(1, { message: "Fee Category is required" }),
//     annualFamilyIncome: z.string().optional(),
//     bankAccountHolder: z.string().optional(),
//     bankName: z.string().optional(),
//     accountNumber: z.string().optional(),
//     branch: z.string().optional(),
//     scholarship: z.array(z.object({
//       scholarshipType: z.string(),
//       providerName: z.string(),
//       scholarshipAmount: z.number().positive(),
//     })).optional(),
//   }).refine((data) => {
//     if (data.feeCategory.toLowerCase().includes("scholarship")) {
//       return data.scholarship && data.scholarship.length > 0 &&
//              !!data.bankAccountHolder && !!data.bankName && !!data.accountNumber && !!data.branch;
//     }
//     return true;
//   }, {
//     message: "Scholarship and bank details are required for scholarship fee category",
//     path: ["scholarship"],
//   }),

//   // parentDetails
//   parentDetails: z.array(z.object({
//     parentType: z.number().int(), // e.g., 1=Father, 2=Mother, etc.
//     fullName: z.string().min(1, { message: "Full Name is required" }),
//     occupation: z.string().optional(),
//     designation: z.string().optional(),
//     organization: z.string().optional(),
//     mobileNumber: z.string().regex(/^\d{10}$/, { message: "Mobile must be 10 digits" }),
//     email: z.string().email().optional().or(z.literal("")),
//     familyIncome: z.string().optional(),
//   })).min(1, { message: "At least one parent/guardian detail is required" }),

//   // transportation
//   transportation: z.object({
//     isHosteller: z.boolean(),
//     transportationMethod: z.string().optional(),
//   }),

//   // citizenshipInfo
//   citizenshipInfo: z.object({
//     citizenshipNumber: z.string().min(1, { message: "Citizenship Number is required" }),
//     issueDate: z.string().min(1, { message: "Citizenship Issue Date is required" })
//       .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
//     issueDistrict: z.string().min(1, { message: "Citizenship Issue District is required" }),
//   }),

//   // faculty (current enrollment)
//   faculty: z.object({
//     facultyName: z.string().min(1, { message: "Faculty/School is required" }),
//     description: z.string().optional(),
//     enrollmentDetails: z.array(z.object({
//       currentProgramEnrollment: z.string().optional(),
//       program: z.string().min(1, { message: "Program is required" }),
//       courseLevel: z.string().min(1, { message: "Course/Level is required" }),
//       academicYear: z.string().min(1, { message: "Academic Year is required" }),
//       semesterOrClass: z.string().min(1, { message: "Semester/Class is required" }),
//       section: z.string().min(1, { message: "Section is required" }),
//       rollNumber: z.string().min(1, { message: "Roll Number is required" }),
//       registrationNumber: z.string().min(1, { message: "Registration Number is required" }),
//       enrollDate: z.string().min(1, { message: "Enroll Date is required" })
//         .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
//       academicStatus: z.string().min(1, { message: "Academic Status is required" }),
//     })).min(1, { message: "Current enrollment details are required" }),
//   }),

//   // Declaration (added to match form requirement)
//   declarationAgreed: z.boolean().refine((val) => val === true, { message: "You must accept the declaration" }),
// });

// export type StudentFormInput = z.infer<typeof StudentFormSchema>;