"use client";
import React, { useEffect, useState } from "react";
import { Candidate } from '@/types/condidature';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import {jwtDecode} from 'jwt-decode';
import "react-toastify/dist/ReactToastify.css";

// Define the PDF.js version you are using
const pdfjsVersion = '3.6.172'; // Replace this with the version of pdfjs-dist you have installed

const getUserRoleAndCompany = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    return { role: decoded.role, company: decoded.company };
  }
  return { role: null, company: null };
};

const TableFour: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get("http://localhost:5000/api/files", config);

        const { role, company } = getUserRoleAndCompany();

        let filteredCandidates = response.data;
        if (role === 'agent' && company) {
          filteredCandidates = filteredCandidates.filter(candidate => candidate.company === company);
        }

        setCandidates(filteredCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const handleRemoveCandidate = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`http://localhost:5000/api/files/${id}`, config);
      setCandidates(candidates.filter(candidate => candidate._id !== id));
      toast.success('Le candidat a supprimé avec succès!');
    } catch (error) {
      console.error("Error removing candidate:", error);
    }
  };

  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Candidates
            </h4>
          </div>
          <DropdownDefault />
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Nom
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                commentaires
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                E-mail
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Téléphone
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                CV
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Action
              </h5>
            </div>
          </div>

          {candidates.map((candidate) => (
            <div
              className="grid grid-cols-6 border-b border-stroke dark:border-strokedark"
              key={candidate._id}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{candidate.lastName}, {candidate.firstName}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{candidate.comments}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{candidate.email}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{candidate.phone}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <a 
                  href={candidate.fileUrl+candidate.filename} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  Afficher le PDF
                </a>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <button
                  onClick={() => handleRemoveCandidate(candidate._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                 <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 11V17" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 11V17" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 7H20" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableFour;
