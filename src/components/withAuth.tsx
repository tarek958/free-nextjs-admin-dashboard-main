"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";

export default function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const [session, setSession] = useState<boolean | null>(null);
    const router = useRouter();

    useLayoutEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem("token"); 

          if (!token) {
           
            router.push("/auth/signin");
            return;
          }

          const response = await axios.get("http://148.113.194.169:5000/check", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const isAuthenticated = response.data.authenticated;

          if (!isAuthenticated) {
            router.push("/auth/signin"); 
          } else {
            setSession(true); 
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          router.push("/auth/signin"); 
        }
      };

      checkAuth(); 
    }, [router]);

    if (session === null) {
      
      return null;
    }

    
    return <Component {...props} />;
  };
}
