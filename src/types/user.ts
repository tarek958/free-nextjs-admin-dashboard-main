export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    telephone: string;
    company:string;
    password: string;
  }
  
  // Define an interface for a new User to be added
  export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    telephone: string;
    company:string;
    password: string;
  }
  export interface editingUser {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    telephone: string;
    company:string;
    password: string;
  }
  
  // Define an interface for a response containing a list of users
  export interface UserResponse {
    users: User[];
  }
  
  // Define an interface for the response of a single user
  export interface UserDetailResponse {
    user: User;
  }