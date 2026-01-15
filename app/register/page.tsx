'use client';
import FileUpload from "@/Components/FileUpload";
import Input from "@/Components/Input";
import Select from "@/Components/Select";
import CheckBox from "@/Components/CheckBox";
import { formInputSchema, formSchema, RegistrationSchema, Registration } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { uploadDocuments, createStudent } from "@/lib/api";

function RegistrationForm({ onRegister, setUploadedFiles }: { onRegister: (payload: any) => Promise<void> | void; setUploadedFiles?: (files: Record<string, File | string | undefined>) => void }) {
  const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      nationality: 'Nepali',
      declarationAccepted: false,
      dateOfApplication: new Date().toISOString().split('T')[0],
      permanentAddress: { province: 'Province 1', district: '', municipalityVDC: '' },
      temporaryAddress: { sameAsPermanent: false },
      enrollment: { currentProgramEnrollment: '', faculty: 'Science', program: '', courseLevel: 'Bachelor', academicYear: '1st Year', semesterOrClass: '', section: '', rollNumber: '', registrationNumber: '' },
      primaryContactType: 'Father',
      gender: 'Male',
      disabilityStatus: 'None',
      feeCategory: 'Regular',
      hostellerOrDayScholar: 'Day Scholar',
      transportationMethod: 'Bus',
      academicHistories: [],
      achievements: [],
      scholarshipDetails: [],
      extracurricularInterests: [],
    }
  });

  const [uploadedFiles, setUploadedFilesState] = useState<Record<string, File | undefined>>({});

  const disabilityStatusValue = watch('disabilityStatus');
  const feeCategoryValue = watch('feeCategory');
  const primaryContactType = watch('primaryContactType');
  const showGuardian = primaryContactType === 'Guardian';
  const sameAsPermValue = watch('temporaryAddress.sameAsPermanent');

  const { fields: achFields, append: appendAch, remove: removeAch } = useFieldArray({ control, name: 'achievements' as any });
  const { fields: acadFields, append: appendAcad, remove: removeAcad } = useFieldArray({ control, name: 'academicHistories' as any });
  const { fields: scholarshipFields, append: appendScholarship, remove: removeScholarship } = useFieldArray({ control, name: 'scholarshipDetails' as any });

  const [extrasSelected, setExtrasSelected] = useState<string[]>([]);

  useEffect(() => {
    setValue('extracurricularInterests', extrasSelected);
  }, [extrasSelected, setValue]);

  useEffect(() => {
    if (sameAsPermValue) {
      const p = watch('permanentAddress');
      if (p) {
        setValue('temporaryAddress', { ...p, sameAsPermanent: true });
      }
    }
  }, [sameAsPermValue, watch, setValue]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const provinces = ['Province 1', 'Province 2', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];
  const districtsMap: Record<string, string[]> = {
    'Province 1': ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Sunsari', 'Taplejung'],
    'Province 2': ['Bara', 'Dhanusa', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Siraha'],
    'Bagmati': ['Bhaktapur', 'Chitwan', 'Dhading', 'Kathmandu', 'Kavrepalanchok', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli'],
    'Gandaki': ['Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Myagdi', 'Mustang', 'Parbat', 'Syangja', 'Tanahun'],
    'Lumbini': ['Argakhanchi', 'Arpa', 'Banke', 'Bardiya', 'Deukhuri', 'Gulmi', 'Kapilvastu', 'Nawalparasi', 'Palpa', 'Rupandehi'],
    'Karnali': ['Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Salyan', 'Surkhet', 'Univers'],
    'Sudurpashchim': ['Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Doti', 'Kailali', 'Kanchanpur'],
  };

  const municipalitiesMap: Record<string, string[]> = {
    'Jhapa': ['Ilaka', 'Kanyam', 'Mechinagar', 'Arjundhara'],
    'Rautahat': ['Gaur', 'Mithila', 'Maharajgunj'],
    'Kathmandu': ['Kathmandu Metropolitan City'],
  };

  useEffect(() => {
    const p = watch('permanentAddress.province');
    if (p && districtsMap[p] && districtsMap[p].length > 0) {
      const currentDist = watch('permanentAddress.district');
      if (!currentDist || !districtsMap[p].includes(currentDist)) {
        setValue('permanentAddress.district', districtsMap[p][0]);
      }
    }
  }, [watch('permanentAddress.province'), setValue]);

  useEffect(() => {
    const d = watch('permanentAddress.district');
    if (d && municipalitiesMap[d] && municipalitiesMap[d].length > 0) {
      const currentMun = watch('permanentAddress.municipalityVDC');
      if (!currentMun || !municipalitiesMap[d].includes(currentMun)) {
        setValue('permanentAddress.municipalityVDC', municipalitiesMap[d][0]);
      }
    }
  }, [watch('permanentAddress.district'), setValue]);

  useEffect(() => {
    const p = watch('temporaryAddress.province');
    if (p && districtsMap[p] && districtsMap[p].length > 0) {
      const currentDist = watch('temporaryAddress.district');
      if (!currentDist || !districtsMap[p].includes(currentDist)) {
        setValue('temporaryAddress.district', districtsMap[p][0]);
      }
    }
  }, [watch('temporaryAddress.province'), setValue]);

  useEffect(() => {
    const d = watch('temporaryAddress.district');
    if (d && municipalitiesMap[d] && municipalitiesMap[d].length > 0) {
      const currentMun = watch('temporaryAddress.municipalityVDC');
      if (!currentMun || !municipalitiesMap[d].includes(currentMun)) {
        setValue('temporaryAddress.municipalityVDC', municipalitiesMap[d][0]);
      }
    }
  }, [watch('temporaryAddress.district'), setValue]);

  const onSubmit = async (data: Registration) => {
    try {
      setIsSubmitting(true);
      console.log('Form submitted with data:', data);

      if (showGuardian) {
        const g = data.guardianDetails;
        if (!g || !g.fullName || !g.relationToStudent || !g.mobileNumber) {
          alert('Please fill guardian details because Primary Contact is Guardian.');
          setIsSubmitting(false);
          return;
        }
      }

      if (data.feeCategory === 'Scholarship' && (!data.scholarshipDetails || data.scholarshipDetails.length === 0)) {
        alert('Please provide scholarship details for Scholarship fee category.');
        setIsSubmitting(false);
        return;
      }

      if (!uploadedFiles.photoUrl) {
        alert('Photo (Passport Size) is required.');
        setIsSubmitting(false);
        return;
      }

      const uploadPayload: Record<string, File> = {};

      if (uploadedFiles.photoUrl) uploadPayload.photoUrl = uploadedFiles.photoUrl;
      if (uploadedFiles.signature) uploadPayload.signaturePath = uploadedFiles.signature;
      if (uploadedFiles.citizenshipCopy) uploadPayload.citizenshipCopyPath = uploadedFiles.citizenshipCopy;
      if (uploadedFiles.citizenshipDocument) uploadPayload.citizenshipDocumentPath = uploadedFiles.citizenshipDocument;
      if (uploadedFiles.characterCertificate) uploadPayload.characterCertificatePath = uploadedFiles.characterCertificate;
      if (uploadedFiles.provisionalAdmitCard) uploadPayload.provisionalAdmitCardPath = uploadedFiles.provisionalAdmitCard;

      let documentsId = null;
      if (Object.keys(uploadPayload).length > 0) {
        try {
          const uploadRes = await uploadDocuments(uploadPayload, {});
          const id = uploadRes && (uploadRes.id ?? uploadRes);
          documentsId = typeof id === 'number' ? id : (typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : null);

          if (!documentsId) {
            console.warn('Document upload succeeded but no id returned.');
          }
        } catch (uploadErr: any) {
          console.error('Document upload error:', uploadErr);
          alert('Document upload failed: ' + (uploadErr?.message || 'Unknown error'));
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        student: {
          firstName: data.firstName,
          middleName: data.middleName || "",
          lastName: data.lastName,
          dateofBirth: data.dateofBirth,
          gender: data.gender === 'Male' ? 1 : data.gender === 'Female' ? 0 : 2,
          placeOfBirth: data.placeOfBirth || "",
          nationality: data.nationality || "Nepali",
          
          personalDetail: {
            bloodGroup: data.bloodGroup || "",
            religion: data.religion || "",
            caste: data.ethnicity || "",
            ethnicityType: data.ethnicity || "",
          },
          
          disablility: {
            disability: data.disabilityStatus,
            disablilityType: data.disablilityType || "",
            disabilityPercentage: data.disabilityPercentage ? Number(data.disabilityPercentage) : 0,
          },
          
          contact: {
            email: data.contact?.email || "",
            primaryMobile: data.contact?.primaryMobile || "",
            secondaryMobile: data.contact?.secondaryMobile || "",
            alternateEmail: data.contact?.alternateEmail || "",
            contactName: data.emergencyContact?.name || "",
            contactNumber: data.emergencyContact?.number || "",
          },
          
          addresses: [
            {
              sameAsPermanent: false,
              province: data.permanentAddress?.province || "",
              district: data.permanentAddress?.district || "",
              municipalityVDC: data.permanentAddress?.municipalityVDC || "",
              wardNumber: Number(data.permanentAddress?.wardNumber) || 0,
              toleStreet: data.permanentAddress?.toleStreet || "",
              houseNumber: data.permanentAddress?.houseNumber || "",
            },
            ...(data.temporaryAddress && !data.temporaryAddress.sameAsPermanent ? [{
              sameAsPermanent: true,
              province: data.temporaryAddress?.province || "",
              district: data.temporaryAddress?.district || "",
              municipalityVDC: data.temporaryAddress?.municipalityVDC || "",
              wardNumber: Number(data.temporaryAddress?.wardNumber) || 0,
              toleStreet: data.temporaryAddress?.toleStreet || "",
              houseNumber: data.temporaryAddress?.houseNumber || "",
            }] : [])
          ],
          
          academicHistories: (data.academicHistories || []).map((h: any) => ({
            qualification: h.qualification || "",
            boardUniversity: h.boardUniversity || "",
            institutionName: h.institutionName || "",
            passedYear: Number(h.passedYear) || 0,
            gpaorDivision: h.gpaorDivision || "",
            marksheetPath: "",
          })),
          
          enrollments: [{
            currentProgramEnrollment: data.enrollment?.currentProgramEnrollment || "",
            program: data.enrollment?.program || "",
            courseLevel: data.enrollment?.courseLevel || "",
            academicYear: data.enrollment?.academicYear || "",
            semesterOrClass: data.enrollment?.semesterOrClass || "",
            section: data.enrollment?.section || "",
            rollNumber: data.enrollment?.rollNumber || "",
            registrationNumber: data.enrollment?.registrationNumber || "",
            enrollDate: data.enrollment?.enrollDate || "",
            academicStatus: data.enrollment?.academicStatus || "",
          }],
          
          financial: {
            feeCategory: data.feeCategory || "",
            annualFamilyIncome: data.annualFamilyIncomeRange || "",
            bankAccountHolder: data.bankDetails?.accountHolderName || "",
            bankName: data.bankDetails?.bankName || "",
            accountNumber: data.bankDetails?.accountNumber || "",
            branch: data.bankDetails?.branch || "",
            scholarships: (data.scholarshipDetails || []).map((s: any) => ({
              scholarshipType: s.scholarshipType || "",
              providerName: s.providerName || "",
              scholarshipAmount: Number(s.scholarshipAmount) || 0,
            })),
          },
          
          scholarships: (data.scholarshipDetails || []).map((s: any) => ({
            scholarshipType: s.scholarshipType || "",
            providerName: s.providerName || "",
            scholarshipAmount: Number(s.scholarshipAmount) || 0,
          })),
          
          extracurriculars: (data.extracurricularInterests || []).map((activity: string) => ({
            activityType: activity,
            otherDetails: activity === 'Other' ? data.extracurricularOther || "" : "",
            createdAt: data.dateOfApplication || new Date().toISOString().split('T')[0],
          })),
          
          parentDetails: [
            ...(data.fatherDetails ? [{
              parentType: "Father",
              fullName: data.fatherDetails.fullName || "",
              occupation: data.fatherDetails.occupation || "",
              designation: data.fatherDetails.designation || "",
              organization: data.fatherDetails.organization || "",
              mobileNumber: data.fatherDetails.mobileNumber || "",
              email: data.fatherDetails.email || "",
              familyIncome: data.annualFamilyIncomeRange || "",
            }] : []),
            ...(data.motherDetails ? [{
              parentType: "Mother",
              fullName: data.motherDetails.fullName || "",
              occupation: data.motherDetails.occupation || "",
              designation: data.motherDetails.designation || "",
              organization: data.motherDetails.organization || "",
              mobileNumber: data.motherDetails.mobileNumber || "",
              email: data.motherDetails.email || "",
              familyIncome: data.annualFamilyIncomeRange || "",
            }] : []),
            ...(data.guardianDetails ? [{
              parentType: "Guardian",
              fullName: data.guardianDetails.fullName || "",
              occupation: data.guardianDetails.occupation || "",
              designation: "",
              organization: "",
              mobileNumber: data.guardianDetails.mobileNumber || "",
              email: data.guardianDetails.email || "",
              familyIncome: data.annualFamilyIncomeRange || "",
            }] : []),
          ],
          
          transportation: {
            isHosteller: data.hostellerOrDayScholar === 'Hosteller',
            transportationMethod: data.transportationMethod || "",
          },
          
          citizenshipInfo: {
            citizenshipNumber: data.citizenshipInfo?.citizenshipNumber || "",
            issueDate: data.citizenshipInfo?.issueDate || "",
            issueDistrict: data.citizenshipInfo?.issueDistrict || "",
          },
          
          faculty: {
            facultyName: data.enrollment?.faculty || "",
            description: data.enrollment?.description || "",
            enrollmentDetails: [],
          },
        }
      };
      
      // Add documentsId as a separate property if available
      if (documentsId) {
        payload.documentId = documentsId;
      }

      await onRegister(payload);
      alert('Registration submitted successfully!');
      reset();
      setUploadedFilesState({});
      setExtrasSelected([]);
    } catch (err: any) {
      console.error('Submit failed: ', err?.response?.data ?? err?.message ?? err);
      
      // Show backend validation errors if available
      if (err?.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]: any) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        alert('Validation errors:\n\n' + errorMessages);
      } else {
        alert('Submission failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, (formErrors) => {
      console.error('Form validation errors:', formErrors);
    })} noValidate className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">1. Personal & Biometric Details</h2>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Passport Size Photo* (JPG/PNG, Max 1MB)</label>
          <FileUpload
            label=""
            accept="image/jpeg,image/png"
            maxSizeMB={1}
            required
            onFileChange={(file) => setUploadedFilesState(prev => ({ ...prev, photoUrl: file }))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input label="First Name*" {...register('firstName')} error={(errors as any).firstName?.message} />
          <Input label="Middle Name" {...register('middleName')} error={(errors as any).middleName?.message} />
          <Input label="Last Name*" {...register('lastName')} error={(errors as any).lastName?.message} />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input label="Date of Birth*" type="date" {...register('dateofBirth')} error={(errors as any).dateofBirth?.message} />
          <Input label="Place of Birth (City/District)" {...register('placeOfBirth')} error={(errors as any).placeOfBirth?.message} />
          <Select label="Nationality*" options={[{ value: 'Nepali', label: 'Nepali' }, { value: 'Other', label: 'Other' }]} {...register('nationality')} error={(errors as any).nationality?.message} />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input label="Citizenship Number*" {...register('citizenshipInfo.citizenshipNumber')} error={(errors as any).citizenshipInfo?.citizenshipNumber?.message} />
          <Input label="Citizenship Issue Date*" type="date" {...register('citizenshipInfo.issueDate')} error={(errors as any).citizenshipInfo?.issueDate?.message} />
          <Input label="Citizenship Issue District*" {...register('citizenshipInfo.issueDistrict')} error={(errors as any).citizenshipInfo?.issueDistrict?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input label="Email*" type="email" {...register('contact.email')} error={(errors as any).contact?.email?.message} />
          <Input label="Alternate Email" type="email" {...register('contact.alternateEmail')} error={(errors as any).contact?.alternateEmail?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input label="Primary Mobile*" {...register('contact.primaryMobile')} error={(errors as any).contact?.primaryMobile?.message} placeholder="10-digit number" />
          <Input label="Secondary Mobile" {...register('contact.secondaryMobile')} error={(errors as any).contact?.secondaryMobile?.message} placeholder="10-digit number" />
        </div>

        <div className="border-t pt-4 mb-4">
          <h3 className="font-semibold text-lg mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="Emergency Contact Name*" {...register('emergencyContact.name')} error={(errors as any).emergencyContact?.name?.message} />
            <Input label="Emergency Contact Relation*" {...register('emergencyContact.relation')} error={(errors as any).emergencyContact?.relation?.message} placeholder="e.g., Father, Mother, Guardian" />
            <Input label="Emergency Contact Number*" {...register('emergencyContact.number')} error={(errors as any).emergencyContact?.number?.message} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <Select label="Gender*" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} {...register('gender')} error={(errors as any).gender?.message} />
          <Select label="Blood Group" options={[{ value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' }, { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' }, { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }, { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' }]} {...register('bloodGroup')} />
          <Select label="Marital Status" options={[{ value: 'Single', label: 'Single' }, { value: 'Married', label: 'Married' }, { value: 'Divorced', label: 'Divorced' }]} {...register('maritalStatus')} />
          <Select label="Religion" options={[{ value: 'Hindu', label: 'Hindu' }, { value: 'Muslim', label: 'Muslim' }, { value: 'Buddhist', label: 'Buddhist' }, { value: 'Christian', label: 'Christian' }, { value: 'Other', label: 'Other' }]} {...register('religion')} />
        </div>

        <div className="mb-4">
          <Input label="Ethnicity/Caste*" {...register('ethnicity')} error={(errors as any).ethnicity?.message} />
        </div>

        <div className="mb-4">
          <Select label="Disability Status*" options={[{ value: 'None', label: 'None' }, { value: 'Physical', label: 'Physical' }, { value: 'Visual', label: 'Visual' }, { value: 'Hearing', label: 'Hearing' }, { value: 'Other', label: 'Other' }]} {...register('disabilityStatus')} error={(errors as any).disabilityStatus?.message} />
        </div>

        {disabilityStatusValue !== 'None' && (
          <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded">
            <Input label="Disability Type" {...register('disablilityType')} error={(errors as any).disablilityType?.message} />
            <Input label="Disability Percentage (%)" type="number" {...register('disabilityPercentage')} error={(errors as any).disabilityPercentage?.message} />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">2. Address Details</h2>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Permanent Address</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Select label="Province*" options={provinces.map(p => ({ value: p, label: p }))} {...register('permanentAddress.province')} error={(errors as any).permanentAddress?.province?.message} />
            <Select label="District*" options={(districtsMap[watch('permanentAddress.province') as string] || []).map(d => ({ value: d, label: d }))} {...register('permanentAddress.district')} error={(errors as any).permanentAddress?.district?.message} />
            <Select label="Municipality/VDC*" options={(municipalitiesMap[watch('permanentAddress.district') as string] || []).map(m => ({ value: m, label: m }))} {...register('permanentAddress.municipalityVDC')} error={(errors as any).permanentAddress?.municipalityVDC?.message} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Ward Number*" {...register('permanentAddress.wardNumber')} error={(errors as any).permanentAddress?.wardNumber?.message} />
            <Input label="Tole/Street*" {...register('permanentAddress.toleStreet')} error={(errors as any).permanentAddress?.toleStreet?.message} />
            <Input label="House Number" {...register('permanentAddress.houseNumber')} error={(errors as any).permanentAddress?.houseNumber?.message} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Temporary Address</h3>
          <div className="mb-3">
            <CheckBox label="Same as Permanent Address" {...register('temporaryAddress.sameAsPermanent')} />
          </div>
          {!sameAsPermValue && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Select label="Province" options={provinces.map(p => ({ value: p, label: p }))} {...register('temporaryAddress.province')} />
                <Select label="District" options={(districtsMap[watch('temporaryAddress.province') as string] || []).map(d => ({ value: d, label: d }))} {...register('temporaryAddress.district')} />
                <Select label="Municipality/VDC" options={(municipalitiesMap[watch('temporaryAddress.district') as string] || []).map(m => ({ value: m, label: m }))} {...register('temporaryAddress.municipalityVDC')} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Ward Number" {...register('temporaryAddress.wardNumber')} />
                <Input label="Tole/Street" {...register('temporaryAddress.toleStreet')} />
                <Input label="House Number" {...register('temporaryAddress.houseNumber')} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">3. Parent/Guardian Details</h2>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Father's Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Full Name*" {...register('fatherDetails.fullName')} error={(errors as any).fatherDetails?.fullName?.message} />
            <Input label="Occupation" {...register('fatherDetails.occupation')} error={(errors as any).fatherDetails?.occupation?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Designation" {...register('fatherDetails.designation')} error={(errors as any).fatherDetails?.designation?.message} />
            <Input label="Organization" {...register('fatherDetails.organization')} error={(errors as any).fatherDetails?.organization?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mobile Number*" {...register('fatherDetails.mobileNumber')} error={(errors as any).fatherDetails?.mobileNumber?.message} />
            <Input label="Email" type="email" {...register('fatherDetails.email')} error={(errors as any).fatherDetails?.email?.message} />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Mother's Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Full Name*" {...register('motherDetails.fullName')} error={(errors as any).motherDetails?.fullName?.message} />
            <Input label="Occupation" {...register('motherDetails.occupation')} error={(errors as any).motherDetails?.occupation?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Designation" {...register('motherDetails.designation')} error={(errors as any).motherDetails?.designation?.message} />
            <Input label="Organization" {...register('motherDetails.organization')} error={(errors as any).motherDetails?.organization?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mobile Number*" {...register('motherDetails.mobileNumber')} error={(errors as any).motherDetails?.mobileNumber?.message} />
            <Input label="Email" type="email" {...register('motherDetails.email')} error={(errors as any).motherDetails?.email?.message} />
          </div>
        </div>

        <div className="mb-6 border-t pt-4">
          <Select label="Primary Contact Type*" options={[{ value: 'Father', label: 'Father' }, { value: 'Mother', label: 'Mother' }, { value: 'Guardian', label: 'Guardian' }]} {...register('primaryContactType')} error={(errors as any).primaryContactType?.message} />
        </div>

        {showGuardian && (
          <div className="bg-blue-50 p-4 rounded mb-6">
            <h3 className="font-semibold text-lg mb-3">Legal Guardian's Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input label="Full Name*" {...register('guardianDetails.fullName')} error={(errors as any).guardianDetails?.fullName?.message} />
              <Input label="Relation to Student*" {...register('guardianDetails.relationToStudent')} error={(errors as any).guardianDetails?.relationToStudent?.message} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input label="Occupation" {...register('guardianDetails.occupation')} error={(errors as any).guardianDetails?.occupation?.message} />
              <Input label="Mobile Number*" {...register('guardianDetails.mobileNumber')} error={(errors as any).guardianDetails?.mobileNumber?.message} />
            </div>
            <Input label="Email" type="email" {...register('guardianDetails.email')} error={(errors as any).guardianDetails?.email?.message} />
          </div>
        )}

        <div>
          <Select label="Annual Family Income" options={[{ value: '<5 Lakh', label: '<5 Lakh' }, { value: '5-10 Lakh', label: '5-10 Lakh' }, { value: '10-20 Lakh', label: '10-20 Lakh' }, { value: '>20 Lakh', label: '>20 Lakh' }]} {...register('annualFamilyIncomeRange')} error={(errors as any).annualFamilyIncomeRange?.message} />
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">4. Academic Details</h2>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Current Program Enrollment</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="Current Program Enrollment*" {...register('enrollment.currentProgramEnrollment')} error={(errors as any).enrollment?.currentProgramEnrollment?.message} placeholder="e.g., BSc CSIT, BA Economics" />
            <Select label="Faculty/School*" options={[{ value: 'Science', label: 'Science' }, { value: 'Management', label: 'Management' }, { value: 'Humanities', label: 'Humanities' }, { value: 'Engineering', label: 'Engineering' }]} {...register('enrollment.faculty')} error={(errors as any).enrollment?.faculty?.message} />
            <Select label="Program*" options={[{ value: 'General', label: 'General' }, { value: 'Specialized', label: 'Specialized' }]} {...register('enrollment.program')} error={(errors as any).enrollment?.program?.message} />
          </div>
          <div className="grid grid-cols-md-1 gap-4 mb-4">
            <Input label="Description" type="text" placeholder="e.g., BSc CSIT, BA Economics" {...register('enrollment.description')} />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Select label="Course Level*" options={[{ value: 'Bachelor', label: 'Bachelor' }, { value: 'Master', label: 'Master' }, { value: '+2', label: '+2' }]} {...register('enrollment.courseLevel')} error={(errors as any).enrollment?.courseLevel?.message} />
            <Select label="Academic Year*" options={[{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }, { value: '3rd Year', label: '3rd Year' }, { value: '4th Year', label: '4th Year' }]} {...register('enrollment.academicYear')} error={(errors as any).enrollment?.academicYear?.message} />
            <Select label="Semester/Class*" options={[{ value: 'First Semester', label: 'First Semester' }, { value: 'Second Semester', label: 'Second Semester' }, { value: 'Class 11', label: 'Class 11' }, { value: 'Class 12', label: 'Class 12' }]} {...register('enrollment.semesterOrClass')} error={(errors as any).enrollment?.semesterOrClass?.message} />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="Section" {...register('enrollment.section')} error={(errors as any).enrollment?.section?.message} placeholder="e.g., A, B" />
            <Input label="Roll Number*" {...register('enrollment.rollNumber')} error={(errors as any).enrollment?.rollNumber?.message} />
            <Input label="Registration Number*" {...register('enrollment.registrationNumber')} error={(errors as any).enrollment?.registrationNumber?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Enroll Date*" type="date" {...register('enrollment.enrollDate')} error={(errors as any).enrollment?.enrollDate?.message} />
            <Select label="Academic Status" options={[{ value: 'Active', label: 'Active' }, { value: 'On Hold', label: 'On Hold' }, { value: 'Completed', label: 'Completed' }, { value: 'Dropped Out', label: 'Dropped Out' }]} {...register('enrollment.academicStatus')} />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-3">Previous Academic History</h3>
          {acadFields.length === 0 ? (
            <p className="text-gray-600 mb-4">No academic history added yet.</p>
          ) : (
            acadFields.map((field, idx) => (
              <div key={field.id} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input label="Qualification*" {...register(`academicHistories.${idx}.qualification` as const)} error={(errors as any).academicHistories?.[idx]?.qualification?.message} placeholder="e.g., SLC/SEE, +2, Bachelor's" />
                  <Input label="Board/University*" {...register(`academicHistories.${idx}.boardUniversity` as const)} error={(errors as any).academicHistories?.[idx]?.boardUniversity?.message} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input label="Institution Name*" {...register(`academicHistories.${idx}.institutionName` as const)} error={(errors as any).academicHistories?.[idx]?.institutionName?.message} />
                  <Input label="Passed Year" type="number" {...register(`academicHistories.${idx}.passedYear` as const)} error={(errors as any).academicHistories?.[idx]?.passedYear?.message} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Division/GPA*" {...register(`academicHistories.${idx}.gpaorDivision` as const)} error={(errors as any).academicHistories?.[idx]?.gpaorDivision?.message} />
                  <div className="text-right">
                    <button type="button" onClick={() => removeAcad(idx)} className="text-sm text-red-600 hover:text-red-800">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
          <button type="button" onClick={() => appendAcad({ qualification: '', boardUniversity: '', institutionName: '', passedYear: undefined, gpaorDivision: '', marksheetId: undefined })} className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2">
            + Add Another Qualification
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">5. Document Uploads</h2>

        <div className="grid grid-cols-2 gap-6">
          <FileUpload label="Signature (JPG/PNG, Max 1MB)" accept="image/jpeg,image/png" maxSizeMB={1} onFileChange={(file) => setUploadedFilesState(prev => ({ ...prev, signature: file }))} />
          <FileUpload label="Citizenship Copy (PDF/JPG/PNG, Max 5MB)" accept="application/pdf,image/jpeg,image/png" maxSizeMB={5} onFileChange={(file) => setUploadedFilesState(prev => ({ ...prev, citizenshipCopy: file }))} />
          <FileUpload label="Citizenship Document (PDF/JPG/PNG, Max 5MB)" accept="application/pdf,image/jpeg,image/png" maxSizeMB={5} onFileChange={(file) => setUploadedFilesState(prev => ({ ...prev, citizenshipDocument: file }))} />
          <FileUpload label="Character Certificate (PDF, Max 2MB)" accept="application/pdf" maxSizeMB={2} onFileChange={(file) => setUploadedFilesState(prev => ({ ...prev, characterCertificate: file }))} />
          <FileUpload label="Provisional/Admit Card (Optional, PDF/JPG/PNG, Max 5MB)" accept="application/pdf,image/jpeg,image/png" maxSizeMB={5} onFileChange={(file) => setUploadedFilesState(prev => ({ ...prev, provisionalAdmitCard: file }))} />
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">6. Financial Details</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Select label="Fee Category*" options={[{ value: 'Regular', label: 'Regular' }, { value: 'Self-Financed', label: 'Self-Financed' }, { value: 'Scholarship', label: 'Scholarship' }, { value: 'Quota', label: 'Quota' }]} {...register('feeCategory')} error={(errors as any).feeCategory?.message} />
          <Select label="Annual Family Income" options={[{ value: '<5 Lakh', label: '<5 Lakh' }, { value: '5-10 Lakh', label: '5-10 Lakh' }, { value: '10-20 Lakh', label: '10-20 Lakh' }, { value: '>20 Lakh', label: '>20 Lakh' }]} {...register('annualFamilyIncomeRange')} />
        </div>

        {feeCategoryValue === 'Scholarship' && (
          <div className="bg-blue-50 p-4 rounded mb-6">
            <h3 className="font-semibold text-lg mb-4">Scholarship Details</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input label="Scholarship Type*" {...register('scholarshipDetails.0.scholarshipType')} error={(errors as any).scholarshipDetails?.[0]?.scholarshipType?.message} placeholder="e.g., Government, Institutional, Private" />
              <Input label="Provider Name*" {...register('scholarshipDetails.0.providerName')} error={(errors as any).scholarshipDetails?.[0]?.providerName?.message} />
              <Input label="Scholarship Amount*" type="number" {...register('scholarshipDetails.0.scholarshipAmount')} error={(errors as any).scholarshipDetails?.[0]?.scholarshipAmount?.message} />
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4">Bank Details for Reimbursement</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Account Holder Name" {...register('bankDetails.accountHolderName')} error={(errors as any).bankDetails?.accountHolderName?.message} />
            <Input label="Bank Name" {...register('bankDetails.bankName')} error={(errors as any).bankDetails?.bankName?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Account Number" {...register('bankDetails.accountNumber')} error={(errors as any).bankDetails?.accountNumber?.message} />
            <Input label="Branch" {...register('bankDetails.branch')} error={(errors as any).bankDetails?.branch?.message} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">7. Extracurricular & Other Information</h2>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Extracurricular Interests</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['Sports', 'Music', 'Debate', 'Coding', 'Volunteering', 'Arts', 'Other'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={extrasSelected.includes(opt)} onChange={(e) => { const next = e.target.checked ? [...extrasSelected, opt] : extrasSelected.filter((x) => x !== opt); setExtrasSelected(next); }} className="rounded" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {extrasSelected.includes('Other') && <Input label="If Other, please specify" {...register('extracurricularOther')} error={(errors as any).extracurricularOther?.message} />}
        </div>

        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold text-lg mb-3">Previous Achievements/Awards</h3>
          {achFields.length === 0 ? (
            <p className="text-gray-600 mb-4">No awards added yet.</p>
          ) : (
            achFields.map((field, idx) => (
              <div key={field.id} className="border rounded p-4 mb-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <Input label="Title of Award*" {...register(`achievements.${idx}.title` as const)} error={(errors as any).achievements?.[idx]?.title?.message} />
                  <Input label="Issuing Organization*" {...register(`achievements.${idx}.issuingOrganization` as const)} error={(errors as any).achievements?.[idx]?.issuingOrganization?.message} />
                  <Input label="Year Received" type="number" {...register(`achievements.${idx}.yearReceived` as const)} error={(errors as any).achievements?.[idx]?.yearReceived?.message} />
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => removeAch(idx)} className="text-sm text-red-600 hover:text-red-800">Remove</button>
                </div>
              </div>
            ))
          )}
          <button type="button" onClick={() => appendAch({ title: '', issuingOrganization: '', yearReceived: undefined })} className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2">
            + Add Another Award
          </button>
        </div>

        <div className="border-t pt-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Are you a Hosteller or Day Scholar?*" options={[{ value: 'Hosteller', label: 'Hosteller' }, { value: 'Day Scholar', label: 'Day Scholar' }]} {...register('hostellerOrDayScholar')} error={(errors as any).hostellerOrDayScholar?.message} />
            <Select label="Transportation Method" options={[{ value: 'Walk', label: 'Walk' }, { value: 'Bicycle', label: 'Bicycle' }, { value: 'Bus', label: 'Bus' }, { value: 'Private Vehicle', label: 'Private Vehicle' }, { value: 'University Shuttle', label: 'University Shuttle' }, { value: 'Other', label: 'Other' }]} {...register('transportationMethod')} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">8. Declaration</h2>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
          <p className="mb-4 font-semibold">I hereby declare that all the information provided above is true and correct to the best of my knowledge.*</p>
          <CheckBox label="I accept the declaration" {...register('declarationAccepted')} />
          {(errors as any).declarationAccepted && <p className="text-red-600 text-sm mt-2">{(errors as any).declarationAccepted.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Date of Application* (Auto-filled)" type="date" {...register('dateOfApplication')} disabled error={(errors as any).dateOfApplication?.message} />
          <Input label="Place" {...register('place')} error={(errors as any).place?.message} />
          
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow text-right space-x-4">
        <button type="button" onClick={() => { reset(); setUploadedFilesState({}); setExtrasSelected([]); }} disabled={isSubmitting} className="bg-gray-500 text-white px-8 py-3 rounded font-semibold hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
          Reset Form
        </button>
        <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-8 py-3 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </div>
    </form>
  );
}

const StudentRegistrationForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (payload: any) => {
    setSubmitting(true);
    try {
      const res = await createStudent(payload);
      console.log('Student registered successfully:', res);
    } catch (err: any) {
      console.error('Registration failed:', err?.response?.data ?? err?.message ?? err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded shadow mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Student Registration Form</h1>
          <p className="text-center text-gray-600">Complete all sections below and submit your registration</p>
        </div>

        <RegistrationForm onRegister={handleRegister} />

        {submitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow">
              <p className="text-lg font-semibold">Submitting registration...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentRegistrationForm;

