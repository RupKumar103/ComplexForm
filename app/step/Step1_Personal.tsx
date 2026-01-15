// // app/steps/Step1_Personal.tsx
// import React from "react";
// import Input from "@/Components/Input";
// import Select from "../components/Select";
// import FileUpload from "@/app/components/FileUpload";
// import { geo } from "../../lib/geo";

// const nationalityOptions = [{ value: "Nepali", label: "Nepali" }];
// const genderOptions = [
//   { value: "Male", label: "Male" },
//   { value: "Female", label: "Female" },
//   { value: "Other", label: "Other" },
// ];
// const bloodGroups = geo.bloodGroups; // Assume geo has bloodGroups array
// const maritalOptions = [
//   { value: "Single", label: "Single" },
//   { value: "Married", label: "Married" },
//   { value: "Divorced", label: "Divorced" },
// ];
// const disabilityOptions = [
//   { value: "None", label: "None" },
//   { value: "Physical", label: "Physical" },
//   { value: "Visual", label: "Visual" },
//   { value: "Hearing", label: "Hearing" },
//   { value: "Other", label: "Other" },
// ];
// const ethnicityOptions = [
//   { value: "Madhesi", label: "Madhesi" },
//   { value: "General", label: "General" },
// ];

// export default function Step1_Personal({ form }: { form: any }) {
//   const { register, watch, setValue, formState: { errors } } = form;
//   const disabilityStatus = watch("disabilityStatus");

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold">Personal & Biometric Details</h2>

//       <FileUpload
//         label="Passport Size Photo *"
//         name="photoBase64"
//         setValue={setValue}
//         error={errors.photoBase64?.message}
//         accept="image/png, image/jpeg"
//         maxSizeInMB={1 * 1024 * 1024}
//       />

//       <div className="grid grid-cols-3 gap-4">
//         <Input label="First Name *" name="firstName" register={register} error={errors.firstName?.message} />
//         <Input label="Middle Name" name="middleName" register={register} error={errors.middleName?.message} />
//         <Input label="Last Name *" name="lastName" register={register} error={errors.lastName?.message} />
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <Input type="date" label="Date of Birth *" name="dateOfBirth" register={register} error={errors.dateOfBirth?.message} />
//         <Input label="Place of Birth" name="placeOfBirth" register={register} error={errors.placeOfBirth?.message} />
//         <Select label="Nationality *" name="nationality" register={register} options={nationalityOptions} error={errors.nationality?.message} />
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <Input label="Citizenship Number *" name="citizenshipNumber" register={register} error={errors.citizenshipNumber?.message} />
//         <Input type="date" label="Citizenship Issue Date *" name="citizenshipIssueDate" register={register} error={errors.citizenshipIssueDate?.message} />
//         <Input label="Citizenship Issue District *" name="citizenshipIssueDistrict" register={register} error={errors.citizenshipIssueDistrict?.message} />
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <Input label="Email *" name="email" register={register} error={errors.email?.message} />
//         <Input label="Alternate Email" name="alternateEmail" register={register} error={errors.alternateEmail?.message} />
//         <Input label="Primary Mobile *" name="primaryMobile" register={register} error={errors.primaryMobile?.message} />
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <Input label="Secondary Mobile" name="secondaryMobile" register={register} error={errors.secondaryMobile?.message} />
//         <Select label="Gender *" name="gender" register={register} options={genderOptions} error={errors.gender?.message} />
//         <Select label="Blood Group" name="bloodGroup" register={register} options={bloodGroups} error={errors.bloodGroup?.message} />
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <Select label="Marital Status" name="maritalStatus" register={register} options={maritalOptions} error={errors.maritalStatus?.message} />
//         <Input label="Religion" name="religion" register={register} error={errors.religion?.message} />
//         <Input label="Ethnicity/Caste *" name="ethnicity" register={register} error={errors.ethnicity?.message} />
//       </div>

//       <Select label="Ethnicity Type *" name="ethnicityType" register={register} options={ethnicityOptions} error={errors.ethnicityType?.message} />

//       <Select label="Disability Status" name="disabilityStatus" register={register} options={disabilityOptions} error={errors.disabilityStatus?.message} />

//       {disabilityStatus !== "None" && (
//         <div className="grid grid-cols-2 gap-4">
//           <Input label="Disability Type" name="disabilityType" register={register} error={errors.disabilityType?.message} />
//           <Input type="number" label="Disability Percentage" name="disabilityPercentage" register={register} error={errors.disabilityPercentage?.message} />
//         </div>
//       )}

//       <h3 className="text-lg font-semibold">Emergency Contact</h3>
//       <div className="grid grid-cols-3 gap-4">
//         <Input label="Contact Name *" name="emergencyName" register={register} error={errors.emergencyName?.message} />
//         <Input label="Relation *" name="emergencyRelation" register={register} error={errors.emergencyRelation?.message} />
//         <Input label="Contact Number *" name="emergencyNumber" register={register} error={errors.emergencyNumber?.message} />
//       </div>
//     </div>
//   );
// }