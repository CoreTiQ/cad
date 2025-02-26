import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    citizenid: string;
    job: string;
    grade: number;
    name?: string | null;
    email?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      citizenid: string;
      job: string;
      grade: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    citizenid: string;
    job: string;
    grade: number;
  }
}