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

          const { authenticated, user } = response.data;

          if (!authenticated) {
            router.push("/auth/signin");
            return;
          }

       
          if (user.role === "user") {
            router.push("http://148.113.194.169:3001/");
            return;
          }

          setSession(true);
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
