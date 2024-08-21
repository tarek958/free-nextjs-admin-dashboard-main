"use client";

import React from 'react';
import { Post } from '@/types/post';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Loader from "@/components/common/Loader";

interface PostDetailsProps {
  post: Post | null;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post }) => {
  if (!post) return <div> <Loader /> </div>;

  return (
    <DefaultLayout>
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-500">Post : {post.contract}</h1>
        
        <div className="mb-6 border-b-2 border-blue-200 pb-4">
            <h2 className="text-2xl font-semibold text-blue-400">Company Presentation</h2>
            <p className="text-gray-700 mt-2 text-lg">{post.presentationDeLEntreprise}</p>
        </div>

        <div className="mb-6 border-b-2 border-blue-200 pb-4">
            <h2 className="text-2xl font-semibold text-blue-400">Job Description</h2>
            <p className="text-gray-700 mt-2 text-lg">{post.descriptionDuPoste}</p>
        </div>

        <div className="mb-6 border-b-2 border-blue-200 pb-4">
            <h2 className="text-2xl font-semibold text-blue-400">Conditions & Advantages</h2>
            <p className="text-gray-700 mt-2 text-lg">{post.conditionsEtAvantages}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-500">Contract Type</h3>
          <p className="text-gray-700 mt-1 text-lg">{post.contract}</p>
        </div>
            <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-500">Agency</h3>
                <p className="text-gray-700 mt-1 text-lg">{post.agence}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-500">City</h3>
                <p className="text-gray-700 mt-1 text-lg">{post.ville}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-500">Region</h3>
                <p className="text-gray-700 mt-1 text-lg">{post.region}</p>
            </div>
        </div>
    </div>
    </DefaultLayout>
  );
};

export default PostDetails;
