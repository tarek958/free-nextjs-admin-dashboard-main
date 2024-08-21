"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import PostDetails from './PostDetails';
import Loader from "@/components/common/Loader";
const DetailsPage = ({ params }: { params: { id: string } }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`http://148.113.194.169:5000/api/posts/uuid/${params.id}`, config);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) return <div><Loader /></div>;
  if (error) return <div>{error}</div>;

  return <PostDetails post={post} />;
};

export default DetailsPage;
