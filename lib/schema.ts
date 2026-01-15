import { FormSerializerOptions } from "axios";
import {z} from "zod";

export const formSchema=z.object({
    photoUrl: z.union([z.instanceof(File), z.string().min(1, { message: "Photo upload is required" })]),
    signaturePath: z.union([z.instanceof(File), z.string().min(1, { message: "Signature upload is required" })]),
    // The rest of the document fields are optional for the register flow (we only need photos here)
    citizenshipCopyPath: z.union([z.instanceof(File), z.string()]).optional(),
    citizenshipDocumentPath: z.union([z.instanceof(File), z.string()]).optional(),
    characterCertificatePath: z.union([z.instanceof(File), z.string().min(1, { message: "Character certificate upload is required" })]),
    provisionalAdmitCardPath: z.union([z.instanceof(File), z.string()]).optional(),
    marksheetPath: z.union([z.instanceof(File), z.string()]).optional(),
});

export type formInputSchema= z.infer<typeof formSchema>;

// ---------------------- Registration / Student form schema (excluding document uploads) ----------------------
const EmergencyContactSchema = z.object({
  name: z.string().min(1, { message: "Emergency contact name is required" }),
  relation: z.string().min(1, { message: "Emergency contact relation is required" }),
  number: z.string().min(1, { message: "Emergency contact number is required" }),
});

const PermanentAddressSchema = z.object({
  province: z.string().min(1, { message: "Province is required" }),
  district: z.string().min(1, { message: "District is required" }),
  municipalityVDC: z.string().min(1, { message: "Municipality/VDC is required" }),
  wardNumber: z.union([z.number(), z.string()]).optional(),
  toleStreet: z.string().optional(),
  houseNumber: z.string().optional(),
});

const TemporaryAddressSchema = z.object({
  sameAsPermanent: z.boolean().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  municipalityVDC: z.string().optional(),
  wardNumber: z.union([z.number(), z.string()]).optional(),
  toleStreet: z.string().optional(),
  houseNumber: z.string().optional(),
});

const ParentPersonSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  occupation: z.string().optional(),
  designation: z.string().optional(),
  organization: z.string().optional(),
  mobileNumber: z.string().optional(),
  email: z.string().email().optional(),
});

const GuardianSchema = z.object({
  fullName: z.string().min(1, { message: "Guardian name is required" }),
  relationToStudent: z.string().min(1, { message: "Relation to student is required" }),
  occupation: z.string().optional(),
  mobileNumber: z.string().optional(),
  email: z.string().email().optional(),
});

const AcademicHistoryEntrySchema = z.object({
  qualification: z.string().min(1, { message: "Qualification is required" }),
  boardUniversity: z.string().min(1, { message: "Board/University is required" }),
  institutionName: z.string().min(1, { message: "Institution name is required" }),
  passedYear: z.union([z.number(), z.string()]).optional(),
  gpaorDivision: z.string().min(1, { message: "Division/GPA is required" })
 
});

const EnrollmentInfoSchema = z.object({
  currentProgramEnrollment: z.string().optional(),
  faculty: z.string().min(1, { message: "Faculty/School is required" }),
  program: z.string().min(1, { message: "Program is required" }),
  description:z.string().optional(),
  courseLevel: z.string().min(1, { message: "Course level is required" }),
  academicYear: z.string().min(1, { message: "Academic year is required" }),
  semesterOrClass: z.string().min(1, { message: "Semester/Class is required" }),
  section: z.string().optional(),
  rollNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  enrollDate: z.string().optional(),
  academicStatus: z.string().optional(),
});

const ScholarshipEntrySchema = z.object({
  scholarshipType: z.string().min(1, { message: "Scholarship type is required" }),
  providerName: z.string().min(1, { message: "Provider name is required" }),
  scholarshipAmount: z.string().min(1, { message: "Scholarship amount must be greater than 0" }),
});

const BankDetailsSchema = z.object({
  accountHolderName: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  branch: z.string().optional(),
});

const AchievementSchema = z.object({
  title: z.string().min(1, { message: "Award title is required" }),
  issuingOrganization: z.string().min(1, { message: "Issuing organization is required" }),
  yearReceived: z.union([z.number(), z.string()]).optional(),
});

export const RegistrationSchema = z.object({
  // Personal & Biometric
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateofBirth: z.string().min(1, { message: "Date of birth is required" }),
  placeOfBirth: z.string().optional(),
  nationality: z.string().default("Nepali"),

  // Citizenship
  citizenshipInfo: z.object({
    citizenshipNumber: z.string().min(1, { message: "Citizenship number is required" }),
    issueDate: z.string().min(1, { message: "Citizenship issue date is required" }),
    issueDistrict: z.string().min(1, { message: "Citizenship issue district is required" }),
  }).optional(),

  // Contact & Emergency
  contact: z.object({
    email: z.string().email({ message: "Invalid email" }),
    alternateEmail: z.string().email().optional(),
    primaryMobile: z.string().min(1, { message: "Primary mobile is required" }),
    secondaryMobile: z.string().optional(),
  }).optional(),

  emergencyContact: EmergencyContactSchema,

  gender: z.union([z.enum(["Male", "Female", "Other"]), z.number()]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).optional(),
  maritalStatus: z.enum(["Single", "Married", "Divorced"]).optional(),
  religion: z.string().optional(),

  ethnicity: z.string().min(1, { message: "Ethnicity/Caste is required" }),

  disabilityStatus: z.enum(["None", "Physical", "Visual", "Hearing", "Other"]).default("None"),
  disablilityType: z.string().optional(),
  disabilityPercentage: z.string().min(0).max(100).optional(),

  // Addresses
  permanentAddress: PermanentAddressSchema,
  temporaryAddress: TemporaryAddressSchema.optional(),

  // Parents / Guardians
  primaryContactType: z.enum(["Father", "Mother", "Guardian"]).optional(),
  fatherDetails: ParentPersonSchema.optional(),
  motherDetails: ParentPersonSchema.optional(),
  guardianDetails: GuardianSchema.optional(),
  annualFamilyIncomeRange: z.enum(["<5 Lakh", "5-10 Lakh", "10-20 Lakh", ">20 Lakh"]).optional(),

  // Academic
  enrollment: EnrollmentInfoSchema,
  academicHistories: z.array(AcademicHistoryEntrySchema).optional(),

  // Financial
  feeCategory: z.enum(["Regular", "Self-Financed", "Scholarship", "Quota"]).optional(),
  scholarshipDetails: z.array(ScholarshipEntrySchema).optional(),
  bankDetails: BankDetailsSchema.optional(),

  // Extracurricular & Other
  extracurricularInterests: z.array(z.string()).optional(),
  extracurricularOther: z.string().optional(),
  achievements: z.array(AchievementSchema).optional(),

  hostellerOrDayScholar: z.enum(["Hosteller", "Day Scholar"]).optional(),
  transportationMethod: z.enum(["Walk", "Bicycle", "Bus", "Private Vehicle", "University Shuttle", "Other"]).optional(),

  // Declaration & metadata
  declarationAccepted: z.boolean().refine((v) => v === true, { message: "Declaration must be accepted" }),
  dateOfApplication: z.preprocess((val) => (val ?? new Date().toISOString()), z.string()),
  place: z.string().optional(),
}).strict();

export type Registration = z.infer<typeof RegistrationSchema>;
