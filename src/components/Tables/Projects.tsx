"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Project } from '@/types/project';
import { ToastContainer, toast } from "react-toastify";
import {jwtDecode} from 'jwt-decode';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import "react-toastify/dist/ReactToastify.css";

const getUserRoleAndCompany = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    return { role: decoded.role, company: decoded.company };
  }
  return { role: null, company: null };
};

const TableOne = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { role, company } = getUserRoleAndCompany();

  useEffect(() => {
    // Fetch data from backend
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get<Project[]>('http://148.113.194.169:5000/api/projects/all', config);

        let filteredProjects = response.data;
        if (role === 'agent' && company) {
          filteredProjects = filteredProjects.filter(project => project.company === company);
        }

        setProjects(filteredProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [role, company]);

  const handleRemoveProject = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`http://148.113.194.169:5000/api/projects/${id}`, config);
      toast.success('Projet supprimé avec succès!');
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      console.error('Error removing project:', error);
    }
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsEditOpen(true);
  };

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsAddOpen(true);
  };

  const handleSaveProject = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      if (currentProject?._id) {
       
        await axios.put(`http://148.113.194.169:5000/api/projects/${currentProject._id}`, currentProject, config);
        toast.success('Projet mis à jour avec succès!');
      } else {
      
        const newProject = { ...currentProject, company };
        const response = await axios.post('http://148.113.194.169:5000/api/projects', newProject, config);
        setProjects([...projects, response.data]);
        toast.success('Le projet a ajouté avec succès!');
      }

      
      const response = await axios.get<Project[]>('http://148.113.194.169:5000/api/projects/all', config);
      let filteredProjects = response.data;
      if (role === 'agent' && company) {
        filteredProjects = filteredProjects.filter(project => project.company === company);
      }
      setProjects(filteredProjects);

      setIsEditOpen(false);
      setIsAddOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Projets</h4>

      <button
        onClick={handleAddProject}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Ajouter un projet
      </button>

      <div className="flex flex-col">
        <div className="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-1 xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Entreprise</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">E-mail</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Téléphone</h5>
          </div>
          <div className="hidden p-1 text-center sm:block xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Message</h5>
          </div>
          <div className="p-1 text-center xl:p-2">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5>
          </div>
        </div>

        {projects.map((project) => (
          <div
            className="grid grid-cols-6 border-b border-stroke dark:border-strokedark"
            key={project._id}
          >
            <div className="flex items-center gap-3 p-1 xl:p-2">
              <p className="text-black dark:text-white">{project.name}</p>
            </div>
            <div className="flex items-center justify-center p-1 xl:p-2">
              <p className="text-black dark:text-white">{project.company}</p>
            </div>
            <div className="flex items-center justify-center p-1 xl:p-2">
              <p className="text-black dark:text-white">{project.email}</p>
            </div>
            <div className="flex items-center justify-center p-1 xl:p-2">
              <p className="text-black dark:text-white">{project.telephone}</p>
            </div>
            <div className="hidden items-center justify-center p-1 sm:flex xl:p-2">
              <p className="text-black dark:text-white">{project.message}</p>
            </div>
            <div className="flex items-center justify-center p-1 xl:p-2">
              <button
                onClick={() => handleEditProject(project)}
                className="hover:text-primary"
              >
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#ffbe0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#ffbe0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
              </button>
              <button
                onClick={() => handleRemoveProject(project._id)}
                className="hover:text-primary"
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

      <Transition appear show={isEditOpen || isAddOpen} as={Fragment}>
        <Dialog as="div" className="relative z-9999" onClose={() => setIsEditOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {currentProject?._id ? 'Modifier le projet' : 'Ajouter un projet'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Nom"
                      className="w-full px-3 py-2 mb-2 border rounded-md"
                      value={currentProject?.name || ''}
                      onChange={(e) => {
                        if (currentProject) {
                          setCurrentProject({ ...currentProject, name: e.target.value });
                        }
                      }}
                      
                    />
                    <input
                      type="email"
                      placeholder="E-mail"
                      className="w-full px-3 py-2 mb-2 border rounded-md"
                      value={currentProject?.email || ''}
                      onChange={(e) => {
                        if (currentProject) {
                          setCurrentProject({ ...currentProject, name: e.target.value });
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Entreprise"
                      className="w-full px-3 py-2 mb-2 border rounded-md"
                      value={currentProject?.company || ''}
                      onChange={(e) => {
                        if (currentProject) {
                          setCurrentProject({ ...currentProject, name: e.target.value });
                        }
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      className="w-full px-3 py-2 mb-2 border rounded-md"
                      value={currentProject?.telephone || ''}
                      onChange={(e) => {
                        if (currentProject) {
                          setCurrentProject({ ...currentProject, name: e.target.value });
                        }
                      }}
                    />
                    <textarea
                      placeholder="Message"
                      className="w-full px-3 py-2 mb-2 border rounded-md"
                      value={currentProject?.message || ''}
                      onChange={(e) => {
                        if (currentProject) {
                          setCurrentProject({ ...currentProject, name: e.target.value });
                        }
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleSaveProject}
                    >
                      {currentProject?._id ? 'Mettre à jour le projet' : 'Ajouter un projet'}
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsEditOpen(false);
                        setIsAddOpen(false);
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ToastContainer />
    </div>
  );
};

export default TableOne;
