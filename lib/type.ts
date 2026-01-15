// src/types/student.ts

export interface Student {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateofBirth: string; // ISO date string
  gender: number; // 1 = Male, 0 = Female (or others if needed)
 

  personalDetail: {
   
    bloodGroup: string;
    religion: string;
    caste: string;
    ethnicityType: string;
   
  };

  disablility: {
    studentId: number;
    disability: string;
    disablilityType: string;
    disabilityPercentage: number;
  
  };

  contact: {
    studentId: number;
    email: string;
    primaryMobile: string;
    secondaryMobile?: string;
    alternateEmail?: string;
    contactName: string;
    contactNumber: string;
    id: number;
    isDeleted: boolean;
    deletedBy: string;
  };

  addresses: Array<{
    studentId: number;
    sameAsPermanent: boolean;
    province: string;
    district: string;
    municipalityVDC: string;
    wardNumber: number;
    toleStreet: string;
    houseNumber: string;
  
  }>;

  academicHistories: Array<{
    studentId: number;
    qualification: string;
    boardUniversity: string;
    institutionName: string;
    passedYear: number;
    gpaorDivision: string;
    marksheetPath?: string;
    createdAt: string;
 
  }>;

  documents: {
    studentId: number;
    photoUrl: string;
    citizenshipCopyPath?: string;
    signaturePath?: string;
    citizenshipDocumentPath?: string;
    characterCertificatePath?: string;
    provisionalAdmitCardPath?: string;
   
  };

  extracurriculars: Array<{
    studentId: number;
    activityType: string;
    otherDetails?: string;
    createdAt: string;
   
  }>;

  financial: {
    studentId: number;
    feeCategory: string;
    annualFamilyIncome: string;
    bankAccountHolder: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    scholarship: Array<{
      id: number;
      scholarshipType: string;
      providerName: string;
      scholarshipAmount: number;
      financialId: number;
    }>;
   
  };

  parentDetails: Array<{
    studentId: number;
    parentType: number;
    fullName: string;
    occupation: string;
    designation: string;
    organization: string;
    mobileNumber: string;
    email?: string;
    familyIncome: string;
  
  }>;

  transportation: {
    studentId: number;
    isHosteller: boolean;
    transportationMethod: string;
 
  };

  citizenshipInfo: {
    studentId: number;
    citizenshipNumber: string;
    issueDate: string;
    issueDistrict: string;
   
  };

  faculty: {
    studentId: number;
    facultyName: string;
    description: string;
    enrollmentDetails: Array<{
    
      facultyId: number;
      currentProgramEnrollment: string;
      program: string;
      courseLevel: string;
      academicYear: string;
      semesterOrClass: string;
      section: string;
      rollNumber: string;
      registrationNumber: string;
      enrollDate: string;
      academicStatus: string;
    }>;
    
  };
}