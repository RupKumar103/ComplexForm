// src/lib/api.ts
export interface Student {
  id: number;
  guidId: string;
  name: string;
  dob: string;
  gender: number;
  // add other fields if needed
}

// Base URL of your backend API
const BASE_URL = "http://localhost:5201/api";

export async function getAllStudents(): Promise<Student[]> {
  try {
    const res = await fetch(`${BASE_URL}/student`);
    if (!res.ok) {
      throw new Error("Failed to fetch students");
    }
    return res.json();
  } catch (error) {
    console.error("getAllStudents error:", error);
    return [];
  }
}

export async function getStudentById(id: number): Promise<Student | null> {
  try {
    const res = await fetch(`${BASE_URL}/student/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("getStudentById error:", error);
    return null;
  }
}
