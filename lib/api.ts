import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const BASE_URL = "https://localhost:7251/api";

export async function getAllStudents() {
  try {
    const res = await axios.get(`${BASE_URL}/Student`, { httpsAgent });
    return res.data;
  } catch (err) {
    console.error("getAllStudents error:", err);
    throw err;
  }
}


export async function getStudentById(id: number) {
     console.log("Obtained Id :",id);
  try {
    const res = await axios.get(`${BASE_URL}/Student/${id}`, { httpsAgent });
    return res.data;
  } catch (err) {
    console.error(`getStudentById error for id ${id}:`, err);
    throw err;
  }
}

// Upload a single file to the API which returns an ID for the stored file
export async function uploadDocument(file: File, options?: { fieldName?: string; extraFields?: Record<string, string> }): Promise<number | string> {
  if (!file) throw new Error('No file provided to uploadDocument');
  const fieldName = options?.fieldName ?? 'file';

  const formData = new FormData();
  formData.append(fieldName, file, file.name);

  // append any extra fields (e.g., documentType) if provided
  if (options?.extraFields) {
    for (const [k, v] of Object.entries(options.extraFields)) {
      formData.append(k, v);
    }
  }

  // Debug: log formData entries (file appears as File in console)
  if (typeof window !== 'undefined') {
    for (const entry of formData.entries()) {
      console.log('[uploadDocument] formData entry', entry[0], entry[1]);
    }
  }

  try {
    // Do NOT set Content-Type header manually so browser/axios can include the correct boundary
    const res = await axios.post(`${BASE_URL}/Student/UploadPhoto`, formData, {
      httpsAgent,
    });
    console.log("Obtained id for upload document:", res.data.id);

    // Expecting the backend to return an object with an id field or directly the id
    if (res.data && (res.data.id !== undefined)) return res.data.id;
    return res.data;
  } catch (err: any) {
    console.error('uploadDocument error response:', err?.response?.data ?? err.message ?? err);
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.message ?? err?.response?.data ?? err.message;
    const message = `Upload failed${status ? ` (status ${status})` : ''}: ${JSON.stringify(serverMsg)}`;
    const e = new Error(message);
    (e as any).response = err?.response;
    throw e;
  }
}

// Upload multiple document fields in one multipart/form-data request
export async function uploadDocuments(
  documents: Record<string, File | string | number | undefined>,
  options?: { extraFields?: Record<string, string> }
) {
  const formData = new FormData();

  for (const [k, v] of Object.entries(documents)) {
    if (v instanceof File) {
      formData.append(k, v, v.name);
    } else if (v !== undefined && v !== null) {
      formData.append(k, String(v));
    }
  }

  if (options?.extraFields) {
    for (const [k, v] of Object.entries(options.extraFields)) {
      formData.append(k, v);
    }
  }

  if (typeof window !== 'undefined') {
    for (const entry of formData.entries()) {
      console.log('[uploadDocuments] formData entry', entry[0], entry[1]);
    }
  }

  try {
    const res = await axios.post(`${BASE_URL}/Student/UploadPhoto`, formData, {
      httpsAgent,
    });
    return res.data;
  } catch (err: any) {
    console.error('uploadDocuments error response:', err?.response?.data ?? err.message ?? err);
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.message ?? err?.response?.data ?? err.message;
    const message = `Upload failed${status ? ` (status ${status})` : ''}: ${JSON.stringify(serverMsg)}`;
    const e = new Error(message);
    (e as any).response = err?.response;
    throw e;
  }
}

// Create a student record (expects JSON body + documentsId query param)
export async function createStudent(payload: any) {
  try {
    // Extract documentsId from payload if present
    const { student, documentId } = payload;
    const docId = documentId || student?.documentsId || 0;
    
    console.log('Creating student with payload:', JSON.stringify(student || payload, null, 2));
    console.log('Using documentsId:', docId);
    
    const studentData = student || payload;
    
    const res = await axios.post(`${BASE_URL}/Student?documentId=${docId}`, studentData, { httpsAgent });
    return res.data;
  } catch (err: any) {
    console.error('createStudent error:', err);
    if (err?.response?.data?.errors) {
      console.error('Backend validation errors:', err.response.data.errors);
    }
    throw err;
  }
}


