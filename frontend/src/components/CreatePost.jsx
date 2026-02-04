import { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Alert,
  FormHelperText
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { postsAPI } from '../api/api';
import { postSchema } from '../utils/validation';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [textError, setTextError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTextError('');
    
    // Validate with Zod
    try {
      postSchema.parse({ text: text.trim(), image });
    } catch (err) {
      const validationError = err.errors[0];
      setTextError(validationError.message);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (text.trim()) {
        formData.append('text', text.trim());
      }
      if (image) {
        formData.append('image', image);
      }

      const response = await postsAPI.createPost(formData);
      
      // Reset form
      setText('');
      setImage(null);
      setImagePreview(null);
      setTextError('');
      
      // Notify parent component
      onPostCreated(response.data.post);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Create Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTextError('');
          }}
          error={!!textError}
          helperText={textError}
          sx={{ mb: 2 }}
        />

        {/* Image Preview */}
        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Image Upload Button */}
          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            disabled={loading}
          >
            {image ? 'Change Image' : 'Add Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={loading || (!text.trim() && !image)}
            sx={{ ml: 'auto' }}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreatePost;
