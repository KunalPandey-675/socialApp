import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  ButtonGroup
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AuthContext } from '../context/AuthContext';
import { postsAPI } from '../api/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'likes', 'comments'

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle new post created
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Handle like
  const handleLike = async (postId) => {
    try {
      const response = await postsAPI.likePost(postId);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: response.data.likes }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle comment
  const handleComment = async (postId, text) => {
    try {
      const response = await postsAPI.addComment(postId, text);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: response.data.comments }
          : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle delete
  const handleDelete = async (postId) => {
    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Sort posts based on selected criteria
  const getSortedPosts = () => {
    const sortedPosts = [...posts];
    
    switch (sortBy) {
      case 'likes':
        return sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
      case 'comments':
        return sortedPosts.sort((a, b) => b.comments.length - a.comments.length);
      case 'recent':
      default:
        return sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const sortedPosts = getSortedPosts();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Social
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.username}
          </Typography>
          <Button 
            color="inherit" 
            onClick={logout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              All Posts
            </Typography>
            
            {/* Sort Buttons */}
            <ButtonGroup size="small" variant="outlined">
              <Button
                variant={sortBy === 'recent' ? 'contained' : 'outlined'}
                onClick={() => setSortBy('recent')}
                startIcon={<AccessTimeIcon />}
              >
                Recent
              </Button>
              <Button
                variant={sortBy === 'likes' ? 'contained' : 'outlined'}
                onClick={() => setSortBy('likes')}
                startIcon={<ThumbUpIcon />}
              >
                Most Liked
              </Button>
              <Button
                variant={sortBy === 'comments' ? 'contained' : 'outlined'}
                onClick={() => setSortBy('comments')}
                startIcon={<CommentIcon />}
              >
                Most Commented
              </Button>
            </ButtonGroup>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No posts yet. Be the first to post!
              </Typography>
            </Box>
          ) : (
            sortedPosts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={handleDelete}
              />
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Feed;
