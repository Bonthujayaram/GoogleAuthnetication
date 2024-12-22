import React, { useState, useEffect } from 'react';
import './VideoUploadForm.css'; // Import the new CSS file for styling

const VideoUploadForm = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [notification, setNotification] = useState('');
  const [fadeClass, setFadeClass] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [timeError, setTimeError] = useState('');

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 50) {
        setFileSizeError('File size exceeds 50MB. Please select a smaller file.');
        setSelectedFile(null);
      } else {
        setFileSizeError('');
        setSelectedFile(file);
      }
    }
  };

  const isValidTime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 14 && currentHour <= 19;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a video to upload.');
      return;
    }
    if (!isValidTime()) {
      setTimeError('You can only upload videos between 2 PM and 7 PM.');
      return;
    } else {
      setTimeError('');
    }
    setIsUploading(true);
    setTimeout(() => {
      alert('Video uploaded successfully!');
      setIsUploading(false);
      setVideoUrl(URL.createObjectURL(selectedFile));
      setSelectedFile(null);
      setShowForm(false);
    }, 2000);
  };

  const loadPhoneEmailScript = () => {
    const script = document.createElement('script');
    script.src = "https://www.phone.email/verify_email_v1.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const phoneEmailReceiver = (userObj) => {
    const user_json_url = userObj.user_json_url;
    fetch(user_json_url)
      .then((response) => response.json())
      .then((data) => {
        setEmailVerified(true);
        setNotification(`Email Verified: ${data.user_email_id}`);
        setTimeout(() => {
          setFadeClass('fade-out');
        }, 5000);
      })
      .catch((error) => console.error('Error fetching email data:', error));
  };
  

  useEffect(() => {
    window.phoneEmailReceiver = phoneEmailReceiver;
    loadPhoneEmailScript();
  }, []);

  const handleRemoveVideo = () => {
    setVideoUrl(null);
    setSelectedFile(null);
    setNotification('');
    setFadeClass('');
    setFileSizeError('');
    setTimeError('');
    setShowForm(true);
  };

  return (
    <div className="video-upload-container">
      {showForm && <h2 className="heading">Upload Your Video</h2>}

      {!emailVerified ? (
        <div className="verification-container">
          <div className="pe_verify_email" data-client-id="12767594783541052576"></div>
        </div>
      ) : (
        <div>
          {!videoUrl ? (
            <form onSubmit={handleSubmit} className="video-upload-form">
              <div className="file-input-container">
                <label htmlFor="file-upload" className="custom-file-input">
                  Select Video
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  style={{ display: 'none' }}
                />
              </div>
              <button type="submit" className="upload-button" disabled={isUploading || fileSizeError}>
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </form>
          ) : (
            <div className="video-container">
              <h3>Video Uploaded Successfully!</h3>
              <video width="480" height="270" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button onClick={handleRemoveVideo} className="remove-button">
                Remove Video
              </button>
            </div>
          )}
        </div>
      )}

      {notification && (
        <div className={`notification ${fadeClass}`}>
          {notification}
        </div>
      )}

      {timeError && <div className="error-message">{timeError}</div>}
      {fileSizeError && <div className="error-message">{fileSizeError}</div>}
    </div>
  );
};

export default VideoUploadForm;
