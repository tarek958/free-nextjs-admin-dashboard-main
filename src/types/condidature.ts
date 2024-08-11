// condidature.ts

// Type representing a single file upload
export interface FileUpload {
    _id: string;
    originalName: string;  // Original name of the file
    filename: string;      // Name of the file on the server
    path: string;          // Path where the file is stored
    mimetype: string;      // MIME type of the file
    size: number;          // Size of the file in bytes
}
// condidature.ts
interface Experience {
    jobTitle: string;
    company: string;
    duration: string;
  }

interface Education{
    degree: string;
    institution: string;
    year: string;
}
export interface Candidate {
    _id: string;
    
    filename: string;
    lastName: string;
    fileUrl:string;
    firstName: string;
    comments: string;
    email: string;
    phone: string;
    path: string; 
    company:string;
    experience: Experience[];
    education : Education[];
}

// Type representing a user's details associated with a file upload
export interface UserDetails {
    _id: string;
    titleSelect: string;   // Title or salutation (e.g., Mr., Ms.)
    lastName: string;      // User's last name
    firstName: string;     // User's first name
    phone: string;         // User's phone number
    email: string;         // User's email address
    comments: string;      // Additional comments
}

// Type representing a file's metadata
export interface FileMetadata {
    _id: string;
    id: string;            // Unique identifier for the file
    fileName: string;      // Name of the file
    filePath: string;      // Path where the file is stored
    fileType: string;      // Type of the file (e.g., PDF, image)
    fileSize: number;      // Size of the file in bytes
}

// Type representing the response for getting all files
export interface GetAllFilesResponse {
    files: string[];       // List of filenames
}

// Type representing the response for editing a file
export interface EditFileResponse {
    oldFilename: string;   // Old filename before edit
    newFilename: string;   // New filename after edit
}

// Type representing the response for file operations (upload, delete, etc.)
export interface FileOperationResponse {
    message: string;       // Status message of the operation
    file?: FileMetadata;   // Optional file metadata if applicable
}

// Define any additional types or interfaces as needed
