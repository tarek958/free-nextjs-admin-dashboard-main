"use client";
import jwtDecode from 'jwt-decode'; // Adjust import statement to correct syntax
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; 
import withAuth from '../withAuth';
import { User } from "@/types/user"; // Adjust this import according to your setup

const TableThree = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Decoding the token to get role and company
  const getUserRoleAndCompany = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return { role: decoded.role, company: decoded.company };
    }
    return { role: null, company: null };
  };

  const { role, company } = getUserRoleAndCompany();

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    telephone: '',
    company:'',
    password: ''
  });

  const [editingUser, setEditingUser] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    telephone: '',
    company: ''
  });

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get('http://148.113.194.169:5000/api/users/all', config);
      setUsers(response.data);
      filterUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Filter users based on role and company
  const filterUsers = (users: User[]) => {
    if (role === 'agent' && company) {
      setFilteredUsers(users.filter(user => user.company === company && user.role !== 'admin' && user.role !== 'super_agent'));
    } else {
      setFilteredUsers(users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add a new user
  const addUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post('http://148.113.194.169:5000/api/users/create-user', newUser, config);
      setShowAddPopup(false);
      fetchUsers();
      toast.success('Utilisateur ajouté avec succès!');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update an existing user
  const updateUser = async (userId: string, user: any) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`http://148.113.194.169:5000/api/users/${userId}`, user, config);
      toast.success('Utilisateur mis à jour avec succès!');
      setShowEditPopup(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle edit user action
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditPopup(true);
  };

  // Delete a user
  const deleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(`http://148.113.194.169:5000/api/users/${userId}`, config);
      toast.success('L\'utilisateur a été supprimé avec succès!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Validate the form before adding a new user
  const validateForm = () => {
    return newUser.firstName && newUser.lastName && newUser.email && newUser.role && newUser.telephone && newUser.company && newUser.password;
  };

  return (
    <>
        {/* Add User Button */}
        <div className="flex justify-end">
        <button
          onClick={() => setShowAddPopup(true)}
          className=" w-44 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
        >
          Ajouter l&#39;utilisateur
        </button>
        </div>
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Prénom
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Nom&nbsp;de&nbsp;famille
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                E-mail
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Téléphone
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Entreprise
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Rôle
              </th>
              {role !== 'super_agent' && (
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="border-b border-[#eee] pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {user.firstName}
                  </h5>
                </td>
                <td className="border-b border-[#eee] dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {user.lastName}
                  </h5>
                </td>
                <td className="border-b border-[#eee] dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.email}
                  </p>
                </td>
                <td className="border-b border-[#eee] dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.telephone}
                  </p>
                </td>
                <td className="border-b border-[#eee] dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.company}
                  </p>
                </td>
                <td className="border-b border-[#eee] dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.role}
                  </p>
                </td>
                {role !== 'super_agent' && (
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
               
                  <div className="flex items-center space-x-3.5">
                    <button onClick={() => handleEditUser(user)} className="hover:text-primary">
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#ffbe0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#ffbe0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="hover:text-primary">
                      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 11V17" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 11V17" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 7H20" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
               
                </td>
                 )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Add User Popup */}
        {showAddPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 lg:ml-[290px]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h3 className="font-medium text-lg mb-4">Ajouter un nouvel utilisateur</h3>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Prénom <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Prénom"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          className="border py-2 rounded-lg w-full px-3"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Nom de famille <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Nom de famille"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          className="border py-2 rounded-lg w-full px-3"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          E-mail <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="E-mail"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border py-2 rounded-lg w-full px-3"
        />
      </div>
  
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Rôle <span className="text-red-500">*</span>
        </label>
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border py-2 rounded-lg w-full px-3"
        >
          <option value="" disabled>Select role</option>
          <option value="user">User</option>
          <option value="agent">Agent</option>
          {role !== 'agent' &&(
          <option value="super_agent">Super Agent</option>
          )}
        </select>
      </div>
  
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Téléphone"
          value={newUser.telephone}
          onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })}
          className="border py-2 rounded-lg w-full px-3"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          Entreprise <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Entreprise"
          value={newUser.company}
          onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
          className="border py-2 rounded-lg w-full px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Mot de passe <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Mot de passe"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border py-2 rounded-lg w-full px-3"
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setShowAddPopup(false)}
          className="py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
        >
          Annuler
        </button>
        <button
          onClick={() => {
            if (validateForm()) {
              addUser();
              setShowAddPopup(false);
            } else {
              alert('Veuillez remplir tous les champs obligatoires.');
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Ajouter l&#39;utilisateur
        </button>
      </div>
    </div>
  </div>
)}



        {/* Edit User Popup */}
        {showEditPopup && editingUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 lg:ml-[290px]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="font-medium text-lg mb-4">Modifier l&#39;utilisateur</h3>
              <input
                type="text"
                placeholder="Prénom"
                value={editingUser.firstName}
                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                className="border px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Nom de famille"
                value={editingUser.lastName}
                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                className="border px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="border px-4 py-2 rounded-lg mb-2 w-full"
              />
              {editingUser.role === "admin" &&
                            <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className="border px-4 py-2 rounded-lg mb-2 w-full"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
                {role !== 'agent' &&(
          <option value="super_agent">Super Agent</option>
          )}
              </select>
            }
              <input
                type="text"
                placeholder="Téléphone"
                value={editingUser.telephone}
                onChange={(e) => setEditingUser({ ...editingUser, telephone: e.target.value })}
                className="border px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Entreprise"
                value={editingUser.company}
                onChange={(e) => setEditingUser({ ...editingUser, company: e.target.value })}
                className="border px-4 py-2 rounded-lg mb-2 w-full"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                 onClick={() => updateUser(editingUser._id, editingUser)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Mettre à jour l&#39;utilisateur
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default withAuth(TableThree);
