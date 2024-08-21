"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import {jwtDecode} from 'jwt-decode';
import "react-toastify/dist/ReactToastify.css";
import { Post } from '@/types/post';
import withAuth from '../withAuth';

// Define the initial post data
const initialPostData: Post = {
  _id: '',
  agence: '',
  ville: '',
  region: '',
  contract:'',
  descriptionDuPoste: '',
  conditionsEtAvantages: '',
  presentationDeLEntreprise: '',
  createdAt: '',
  updatedAt: '',
};
const getUserRoleAndCompany = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    return { role: decoded.role, company: decoded.company };
  }
  return { role: null, company: null };
};
const TableTwo = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [regions, setRegions] = useState<Post[]>([]);
  const [showAddPopup, setShowAddPopup] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Post>(initialPostData);
  const { role, company } = getUserRoleAndCompany();
  useEffect(() => {
    fetchPosts();
    fetchRegions();
  }, []);
  console.log(regions);
  
  const fetchPosts = async () => {
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        
        const response = await axios.get<Post[]>('http://148.113.194.169:5000/api/posts/all', config);
        let filteredPosts = response.data;

        
      
       
        if (role === 'agent' && company) {
            filteredPosts = filteredPosts.filter(post => post.agence === company);
        }

        
        setPosts(filteredPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};


  const fetchRegions = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get<Post[]>('http://148.113.194.169:5000/api/postss/regions', config);
      setRegions(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleAddPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  

      const { _id, updatedAt, createdAt, ...postData } = currentPost;
  
      const response = await axios.post<Post>('http://148.113.194.169:5000/api/posts/add', postData, config);
      toast.success('Ajout avec succès!');
      setPosts([...posts, response.data]);
      setShowAddPopup(false);
      setCurrentPost(initialPostData);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
  

  const handleEditPost = (post: Post) => {
    setCurrentPost(post);
    setShowEditPopup(true);
  };

  const handleUpdatePost = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put<Post>(`http://148.113.194.169:5000/api/posts/${currentPost._id}`, currentPost,config);
      const updatedPosts = posts.map((post) =>
        post._id === currentPost._id ? response.data : post
      );
      setPosts(updatedPosts);
      toast.success('Publier à jour!');
      setShowEditPopup(false);
      setCurrentPost(initialPostData);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`http://148.113.194.169:5000/api/posts/${postId}`,config);
      toast.success('Post supprimé avec succès!');
      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5 flex justify-between items-center">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Postes
        </h4>
        <button onClick={() => setShowAddPopup(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Ajouter un poste
        </button>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Agence</p>
        </div>
        <div className="col-span-1  items-center sm:flex">
          <p className="font-medium">Ville</p>
        </div>
       
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Description</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Condition</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">P.Entreprise</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Actions</p>
        </div>
      </div>

      {posts.map((post) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={post._id}
        >
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{post.agence}</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">{post.ville}</p>
          </div>
         
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{post.descriptionDuPoste}</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{post.conditionsEtAvantages}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{post.presentationDeLEntreprise}</p>
          </div>
          <div className="col-span-1 flex items-center space-x-2">
            <button onClick={() => handleEditPost(post)} className="hover:text-primary">
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#ffbe0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#ffbe0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
            </button>
            <button onClick={() => handleDeletePost(post._id)} className="hover:text-primary">
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

      {showAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50  lg:ml-[290px]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="font-medium text-lg mb-4">Ajouter un poste</h3>
            <input
              type="text"
              placeholder="Contrat"
              value={currentPost.contract}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, contract: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full pl-3"
            />
            <input
              type="text"
              placeholder="Agence"
              value={currentPost.agence}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, agence: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full pl-3"
            />
            <input
              type="text"
              placeholder="Ville"
              value={currentPost.ville}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, ville: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full pl-3"
            />
            <input
              type="text"
              placeholder="Region"
              value={currentPost.region}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, region: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full pl-3"
            />
            <input
              type="text"
              placeholder="Description"
              value={currentPost.descriptionDuPoste}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, descriptionDuPoste: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full pl-3"
            />
            <input
              type="text"
              placeholder="conditions Et Avantages"
              value={currentPost.conditionsEtAvantages}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, conditionsEtAvantages: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full pl-3"
            />
            <input
              type="text"
              placeholder="presentation De L'entreprise"
              value={currentPost.presentationDeLEntreprise}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, presentationDeLEntreprise: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full pl-3"
            />
            <button onClick={handleAddPost} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Ajouter un poste
            </button>
            <button onClick={() => setShowAddPopup(false)} className="bg-gray-300 text-black px-4 py-2 rounded-lg">
             Annuler
            </button>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 lg:ml-[290px]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 ">
            <h3 className="font-medium text-lg mb-4">Modifier la publication</h3>
            <input
              type="text"
              placeholder="Agence"
              value={currentPost.agence}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, agence: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Ville"
              value={currentPost.ville}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, ville: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Region"
              value={currentPost.region}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, region: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Description"
              value={currentPost.descriptionDuPoste}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, descriptionDuPoste: e.target.value })}
              className="border py-2 rounded-lg mb-2 w-full"
            />
            <input
              type="text"
              placeholder="conditions Et Avantages"
              value={currentPost.conditionsEtAvantages}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, conditionsEtAvantages: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full"
            />
            <input
              type="text"
              placeholder="presentation De L'entreprise"
              value={currentPost.presentationDeLEntreprise}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPost({ ...currentPost, presentationDeLEntreprise: e.target.value })}
              className="border  py-2 rounded-lg mb-2 w-full"
            />
            <button onClick={handleUpdatePost} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Mettre à jour 
            </button>
            <button onClick={() => setShowEditPopup(false)} className="bg-gray-300 text-black px-4 py-2 rounded-lg">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(TableTwo);
