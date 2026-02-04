import { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

const PostCard = ({ post, currentUser, onLike, onComment, onDelete }) => {
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // Check if current user has liked the post
  const isLiked = post.likes.some(like => like.user === currentUser?.id);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Handle like
  const handleLike = () => {
    onLike(post._id);
  };

  // Handle comment submit
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText.trim());
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  // Get comments to display based on showAllComments state
  const displayComments = showAllComments ? post.comments : post.comments.slice(0, 2);
  const remainingCommentsCount = post.comments.length - 2;

  return (
    <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden' }}>
      {/* Post Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {post.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Delete button (only for post owner) */}
        {currentUser?.username === post.username && (
          <IconButton 
            size="small" 
            onClick={() => onDelete(post._id)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Post Content */}
      {post.text && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </Box>
      )}

      {/* Post Image */}
      {post.image && (
        <Box>
          <img
            src={post.image}
            alt="Post content"
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'cover'
            }}
          />
        </Box>
      )}

      {/* Like and Comment Counts */}
      <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
        </Typography>
      </Box>

      <Divider />

      {/* Action Buttons */}
      <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={handleLike}
          sx={{ 
            color: isLiked ? 'error.main' : 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          Like
        </Button>
        <Button
          fullWidth
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={() => setShowCommentInput(!showCommentInput)}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          Comment
        </Button>
      </Box>

      {/* Comments Section */}
      {post.comments.length > 0 && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 2 }}>
            {displayComments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {comment.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ 
                    bgcolor: 'background.default', 
                    borderRadius: 2, 
                    px: 2, 
                    py: 1,
                    flexGrow: 1
                  }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {comment.username}
                    </Typography>
                    <Typography variant="body2">
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                  {formatDate(comment.createdAt)}
                </Typography>
              </Box>
            ))}

            {remainingCommentsCount > 0 && !showAllComments && (
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ mt: 1, cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setShowAllComments(true)}
              >
                View {remainingCommentsCount} more {remainingCommentsCount === 1 ? 'comment' : 'comments'}
              </Typography>
            )}

            {showAllComments && post.comments.length > 2 && (
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ mt: 1, cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setShowAllComments(false)}
              >
                Show less
              </Typography>
            )}
          </Box>
        </>
      )}

      {/* Comment Input */}
      {showCommentInput && (
        <>
          <Divider />
          <Box 
            component="form" 
            onSubmit={handleCommentSubmit}
            sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {currentUser?.username.charAt(0).toUpperCase()}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              autoFocus
            />
            <IconButton 
              type="submit" 
              color="primary"
              disabled={!commentText.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default PostCard;
