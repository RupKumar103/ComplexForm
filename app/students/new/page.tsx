
'use client';
import FileUpload from "@/Components/FileUpload";
import { formInputSchema, formSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadDocuments } from "@/lib/api";



const StudentRegistrationForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<formInputSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoUrl: "",
      signaturePath: "",
      citizenshipCopyPath: "",
      citizenshipDocumentPath: "",
      characterCertificatePath: "",
      provisionalAdmitCardPath: "",
    }
  });

  const [uploadedDocuments, setUploadedDocuments] = useState({
    photoUrl: "",
    signaturePath: "",
    citizenshipCopyPath: "",
    citizenshipDocumentPath: "",
    characterCertificatePath: "",
    provisionalAdmitCardPath: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // New upload handler that uses uploadDocuments and supports all document fields
  const handleUpload = async (data: formInputSchema) => {
    setSubmitting(true);
    try {
      const docs: Record<string, File | string | undefined> = {};

      if (data.photoUrl instanceof File) docs.photoUrl = data.photoUrl;
      else if (typeof data.photoUrl === 'string' && data.photoUrl.trim()) docs.photoUrl = data.photoUrl;

      if (data.signaturePath instanceof File) docs.signaturePath = data.signaturePath;
      else if (typeof data.signaturePath === 'string' && data.signaturePath.trim()) docs.signaturePath = data.signaturePath;

      if (data.citizenshipCopyPath instanceof File) docs.citizenshipCopyPath = data.citizenshipCopyPath;
      else if (typeof data.citizenshipCopyPath === 'string' && data.citizenshipCopyPath.trim()) docs.citizenshipCopyPath = data.citizenshipCopyPath;

      if (data.citizenshipDocumentPath instanceof File) docs.citizenshipDocumentPath = data.citizenshipDocumentPath;
      else if (typeof data.citizenshipDocumentPath === 'string' && data.citizenshipDocumentPath.trim()) docs.citizenshipDocumentPath = data.citizenshipDocumentPath;

      if (data.characterCertificatePath instanceof File) docs.characterCertificatePath = data.characterCertificatePath;
      else if (typeof data.characterCertificatePath === 'string' && data.characterCertificatePath.trim()) docs.characterCertificatePath = data.characterCertificatePath;

      if (data.provisionalAdmitCardPath instanceof File) docs.provisionalAdmitCardPath = data.provisionalAdmitCardPath;
      else if (typeof data.provisionalAdmitCardPath === 'string' && data.provisionalAdmitCardPath.trim()) docs.provisionalAdmitCardPath = data.provisionalAdmitCardPath;

      if (!docs.photoUrl) throw new Error('Photo is required for registration.');

      const extraFields: Record<string, string> = {
        PhotoUrl: docs.photoUrl instanceof File ? docs.photoUrl.name : (typeof docs.photoUrl === 'string' ? docs.photoUrl : ''),
        SignaturePath: docs.signaturePath instanceof File ? docs.signaturePath.name : (typeof docs.signaturePath === 'string' ? docs.signaturePath : ''),
        CitizenshipCopyPath: docs.citizenshipCopyPath instanceof File ? docs.citizenshipCopyPath.name : (typeof docs.citizenshipCopyPath === 'string' ? docs.citizenshipCopyPath : ''),
        CitizenshipDocumentPath: docs.citizenshipDocumentPath instanceof File ? docs.citizenshipDocumentPath.name : (typeof docs.citizenshipDocumentPath === 'string' ? docs.citizenshipDocumentPath : ''),
        CharacterCertificatePath: docs.characterCertificatePath instanceof File ? docs.characterCertificatePath.name : (typeof docs.characterCertificatePath === 'string' ? docs.characterCertificatePath : ''),
        ProvisionalAdmitCardPath: docs.provisionalAdmitCardPath instanceof File ? docs.provisionalAdmitCardPath.name : (typeof docs.provisionalAdmitCardPath === 'string' ? docs.provisionalAdmitCardPath : ''),
      };

      const res = await uploadDocuments(docs, { extraFields });
      console.log('Upload results:', res);
      alert('Document(s) uploaded successfully');
    } catch (err: any) {
      console.error('Upload failed:', err?.response?.data ?? err?.message ?? err);
      alert(`Upload failed: ${err?.message ?? 'See console'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Photos</h2>
      <form onSubmit={handleSubmit(handleUpload)} noValidate>
        <FileUpload
          label="Photo (Passport Size)"
          accept="image/jpeg,image/png"
          maxSizeMB={2}
          required
          onFileChange={(file, preview) => { setUploadedDocuments(prev => ({ ...prev, photoUrl: preview || (file?.name ?? '') })); if (file) setValue('photoUrl', file); else setValue('photoUrl', ''); }}
          error={(errors as any).photoUrl?.message}
        />

        <div className="mt-4 grid grid-cols-1 gap-4">
          <FileUpload
            label="Signature"
            accept="image/jpeg,image/png"
            maxSizeMB={1}
            onFileChange={(file, preview) => { setUploadedDocuments(prev => ({ ...prev, signaturePath: preview || (file?.name ?? '') })); if (file) setValue('signaturePath', file); else setValue('signaturePath', ''); }}
            error={(errors as any).signaturePath?.message}
          />

          <FileUpload
            label="Citizenship Copy"
            accept="image/jpeg,image/png"
            maxSizeMB={5}
            onFileChange={(file, preview) => { setUploadedDocuments(prev => ({ ...prev, citizenshipCopyPath: preview || (file?.name ?? '') })); if (file) setValue('citizenshipCopyPath', file); else setValue('citizenshipCopyPath', ''); }}
            error={(errors as any).citizenshipCopyPath?.message}
          />

          <FileUpload
            label="Citizenship Document"
            accept="image/jpeg,image/png"
            maxSizeMB={5}
            onFileChange={(file, preview) => { setUploadedDocuments(prev => ({ ...prev, citizenshipDocumentPath: preview || (file?.name ?? '') })); if (file) setValue('citizenshipDocumentPath', file); else setValue('citizenshipDocumentPath', ''); }}
            error={(errors as any).citizenshipDocumentPath?.message}
          />

          <FileUpload
            label="Character Certificate"
            accept="image/jpeg,image/png"
            maxSizeMB={5}
            onFileChange={(file, preview) => { setUploadedDocuments(prev => ({ ...prev, characterCertificatePath: preview || (file?.name ?? '') })); if (file) setValue('characterCertificatePath', file); else setValue('characterCertificatePath', ''); }}
            error={(errors as any).characterCertificatePath?.message}
          />

          <FileUpload
            label="Provisional Admit Card (Optional)"
            accept="image/jpeg,image/png"
            maxSizeMB={5}
            onFileChange={(file, preview) => { setUploadedDocuments(prev => ({ ...prev, provisionalAdmitCardPath: preview || (file?.name ?? '') })); if (file) setValue('provisionalAdmitCardPath', file); else setValue('provisionalAdmitCardPath', ''); }}
            error={(errors as any).provisionalAdmitCardPath?.message}
          />

        </div>

        <div className="mt-6 text-right">
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {submitting ? 'Uploading...' : 'Upload Documents'}
          </button>
        </div>
      </form>

    </div>
  )
}

export default StudentRegistrationForm;

