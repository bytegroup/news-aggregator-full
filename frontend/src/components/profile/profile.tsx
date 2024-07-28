"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [loadingProfile, setLoadingProfile] = useState(false);

  const getUserProfile = (token: string) => {
    setLoadingProfile(true);
    fetch(`${baseUrl}/users/profile`, {
      headers: { Authorization: "Bearer " + token },
    })
        .then((response) => {
          setLoadingProfile(false);
        })
        .catch((error) => {
          console.error(error);
        });
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      getUserProfile(session.user.accessToken);
    } else {
      router.push("/login?next=" + pathname);
    }
  }, [getUserProfile, pathname, router, session?.user?.accessToken]);


  return (
    <>
      {" "}
      {loadingProfile ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>User Profile</p>
          <p>Name: {session?.user?.name}</p>
          <p>Email: {session?.user?.email}</p>
        </div>
      )}
    </>
  );
}
