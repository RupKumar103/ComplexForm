// src/app/students/[id]/page.tsx
'use client';
import { getStudentById } from "@/lib/api";
import { Student } from "@/lib/type"

const baseUrl = "https://localhost:7251"; // Your backend URL

export default async function StudentViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {id} = await params;
  const studentId = Number(id);
    console.log("Fetching student with ID:", studentId);
  const student: Student = await getStudentById(studentId);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-red-600 font-bold">Student not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header with Photo and Name */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={`${baseUrl}${student.documents.photoUrl}`}
              alt={`${student.firstName} ${student.lastName}`}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder-avatar.png")}
            />
            <div>
              <h1 className="text-4xl font-bold">
                {student.firstName} {student.middleName && `${student.middleName} `}{student.lastName}
              </h1>
              <p className="text-xl mt-2 opacity-90">
                {student.faculty.enrollmentDetails[0]?.currentProgramEnrollment || "N/A"} •{" "}
                {student.faculty.enrollmentDetails[0]?.rollNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Personal Information</h2>
            <div className="space-y-3">
              <p><strong>Date of Birth:</strong> {new Date(student.dateofBirth).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {student.gender === 1 ? "Male" : "Female"}</p>
              <p><strong>Blood Group:</strong> {student.personalDetail.bloodGroup}</p>
              <p><strong>Religion:</strong> {student.personalDetail.religion}</p>
              <p><strong>Caste:</strong> {student.personalDetail.caste}</p>
              <p><strong>Ethnicity:</strong> {student.personalDetail.ethnicityType}</p>
              <p><strong>Disability:</strong> {student.disablility.disability} ({student.disablility.disablilityType})</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Contact Details</h2>
            <div className="space-y-3">
              <p><strong>Email:</strong> {student.contact.email}</p>
              <p><strong>Primary Mobile:</strong> {student.contact.primaryMobile}</p>
              {student.contact.secondaryMobile && <p><strong>Secondary Mobile:</strong> {student.contact.secondaryMobile}</p>}
              {student.contact.alternateEmail && <p><strong>Alternate Email:</strong> {student.contact.alternateEmail}</p>}
              <p><strong>Emergency Contact:</strong> {student.contact.contactName} ({student.contact.contactNumber})</p>
            </div>
          </section>

          {/* Address */}
          <section className="bg-gray-50 p-6 rounded-xl md:col-span-2">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Address</h2>
            <p>
              {student.addresses[0]?.houseNumber}, {student.addresses[0]?.toleStreet},{" "}
              {student.addresses[0]?.municipalityVDC} - {student.addresses[0]?.wardNumber},{" "}
              {student.addresses[0]?.district}, {student.addresses[0]?.province}
            </p>
          </section>

          {/* Academic History */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Academic History</h2>
            {student.academicHistories.map((history, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-0">
                <p className="font-semibold">{history.qualification}</p>
                <p>{history.institutionName} • {history.boardUniversity}</p>
                <p>Passed Year: {history.passedYear} • GPA/Division: {history.gpaorDivision}</p>
              </div>
            ))}
          </section>

          {/* Financial & Scholarship */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Financial Information</h2>
            <p><strong>Fee Category:</strong> {student.financial.feeCategory}</p>
            <p><strong>Annual Family Income:</strong> NPR {student.financial.annualFamilyIncome}</p>
            <p><strong>Bank:</strong> {student.financial.bankName} ({student.financial.branch})</p>
            <p><strong>A/C Holder:</strong> {student.financial.bankAccountHolder}</p>

            {student.financial.scholarship.length > 0 && (
              <div className="mt-4">
                <strong>Scholarships:</strong>
                <ul className="list-disc list-inside mt-2">
                  {student.financial.scholarship.map((sch, i) => (
                    <li key={i}>
                      {sch.scholarshipType} - NPR {sch.scholarshipAmount} ({sch.providerName})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Parent Details */}
          <section className="bg-gray-50 p-6 rounded-xl md:col-span-2">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Parent/Guardian Details</h2>
            {student.parentDetails.map((parent, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">{parent.fullName} ({parent.parentType === 0 ? "Father" : "Mother"})</p>
                <p>Occupation: {parent.occupation} • {parent.designation} at {parent.organization}</p>
                <p>Mobile: {parent.mobileNumber} {parent.email && `• Email: ${parent.email}`}</p>
              </div>
            ))}
          </section>

          {/* Citizenship & Accommodation */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Citizenship</h2>
            <p><strong>Number:</strong> {student.citizenshipInfo.citizenshipNumber}</p>
            <p><strong>Issue Date:</strong> {new Date(student.citizenshipInfo.issueDate).toLocaleDateString()}</p>
            <p><strong>Issue District:</strong> {student.citizenshipInfo.issueDistrict}</p>
          </section>

          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Accommodation & Transport</h2>
            <p><strong>Hosteller:</strong> {student.transportation.isHosteller ? "Yes" : "No"}</p>
            <p><strong>Transportation:</strong> {student.transportation.transportationMethod}</p>
          </section>

          {/* Extracurriculars */}
          {student.extracurriculars.length > 0 && (
            <section className="bg-gray-50 p-6 rounded-xl md:col-span-2">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Extracurricular Activities</h2>
              <ul className="list-disc list-inside space-y-2">
                {student.extracurriculars.map((act, i) => (
                  <li key={i}>
                    <strong>{act.activityType}:</strong> {act.otherDetails}
                  </li>
                ))}
              </ul>
              
            </section>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center py-8">
          <a
            href="/"
            className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            ← Back to Students List
          </a>
        </div>
      </div>
    </div>
  );
}