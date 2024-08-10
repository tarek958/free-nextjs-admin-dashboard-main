"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";
interface User {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
}

interface JwtPayload {
  id: number;
}

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          window.location.href = "/auth/signin";
          setLoading(false);
          return;
        }

        const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.id;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`http://148.113.194.169:5000/api/users/${userId}`, config);
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          telephone: response.data.telephone,
          email: response.data.email,
        });
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const decoded: JwtPayload = jwtDecode(token);
        const userId = decoded.id;
      const response = await axios.put(`http://148.113.194.169:5000/api/users/${userId}`, formData, config);
      if (response.status === 200) {
        toast.success("L'utilisateur a été mis à jour avec succès!");
      } else {
        toast.error("La mise à jour de l'utilisateur a échoué.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Une erreur s'est produite lors de la mise à jour de l'utilisateur.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser();
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-screen">
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Paramètres" />

          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 xl:col-span-3">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">Informations personnelles</h3>
                </div>
                <div className="p-7">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="firstName">
                          Prénom
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Nom Prénom"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="lastName">
                          Nom de famille
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Prénom Nom de famille"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-5.5">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="telephone">
                        Numéro de téléphone
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="telephone"
                        id="telephone"
                        placeholder="+990 3343 7865"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-5.5">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">
                        Adresse e-mail
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="example@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-5 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                    >
                      Sauvegarder
                    </button>
                  </form>
                </div>
                
              </div>
            </div>
            <div className="col-span-5 xl:col-span-2">
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
      <h3 className="font-medium text-black dark:text-white">
        Profile
      </h3>
    </div>
    <div className="p-7">
      <form action="#">
        <div className="mb-4 flex items-center gap-3">
        <div className="h-14 w-14 rounded-full">
                      <Image
                        src={"/images/user/user-03.png"}
                        width={55}
                        height={55}
                        alt="User"
                      />
                    </div>
          <div>
            <span className="mb-1.5 text-black dark:text-white">
              Nom d'utilisateur: {user?.firstName || ''} {user?.lastName || ''}<br />
              E-mail: {user?.email || ''}<br />
              Téléphone: {user?.telephone || ''}
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

          </div>
        </div>
      </DefaultLayout>
      <ToastContainer />
    </div>
  );
};

export default Settings;
