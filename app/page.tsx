// src/app/students/page.tsx
'use client';
import { getAllStudents, Student } from "@/lib/api";
import { MoreVertical } from "lucide-react";
import Link from "next/link";


const baseurl = "https://localhost:7251/";

export default async function Home() {
  const students: Student[] = await getAllStudents();

  return (
    <div className="min-h-screen  from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
          All Students
        </h1>
        <p className="text-lg text-gray-600 mb-10">Complete list of registered students</p>
<Link href="/students/new" className="mb-6 inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition">
          + Add New Student
        </Link>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white uppercase text-sm tracking-wider">
                  <th className="px-8 py-5 text-left">Photo</th>
                  <th className="px-8 py-5 text-left">ID</th>
                  <th className="px-8 py-5 text-left">First Name</th>

                  <th className="px-8 py-5 text-left">Date of Birth</th>
                  <th className="px-8 py-5 text-left"> operations </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="px-8 py-6">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-indigo-200">
                          <img
                            src={`${baseurl}${student.documents.photoUrl}`}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-full h-full object-cover"

                          />
                        </div>
                      </td>
                      <td className="px-8 py-6 font-medium text-gray-900">
                        #{student.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-8 py-6 text-gray-800 font-medium">
                        {student.firstName}
                      </td>

                      <td className="px-8 py-6 text-gray-600">
                        {new Date(student.dateofBirth).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>


                      <td className="px-8 py-6 text-center">
                        
                        <div className="flex justify-center gap-3">
                          
                          <Link href={`/students/${student.id}`}>
                          {/* View Button */}
                          <button  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                            View
                          </button>
                          </Link>

                          {/* Edit Button */}
                          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                            Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this student?")) {
                                alert(`Delete student ${student.id}`);
                                // Add your delete API call here later
                              }
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>





                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional: Add a subtle footer note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Total students: <span className="font-semibold text-indigo-600">{students.length}</span>
        </p>
      </div>
    </div>
  );
}