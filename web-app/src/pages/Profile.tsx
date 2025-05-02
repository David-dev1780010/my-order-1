import React, { useState, useEffect } from 'react';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await window.Telegram.WebApp.initDataUnsafe;
        if (data.user) {
          // Загружаем сохраненные данные профиля
          const response = await fetch(`http://localhost:8000/api/profile/${data.user.id}`);
          const savedProfile = await response.json();
          
          setUserData({
            ...data.user,
            username: savedProfile.username || data.user.username,
            email: savedProfile.email || '',
            avatar_url: savedProfile.avatar_url || ''
          });
          setEditedData({
            ...data.user,
            username: savedProfile.username || data.user.username,
            email: savedProfile.email || '',
            avatar_url: savedProfile.avatar_url || ''
          });
        }
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleSave = async () => {
    if (!editedData) return;

    try {
      // Сохраняем данные на сервере
      await fetch('http://localhost:8000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: editedData.id,
          username: editedData.username,
          email: editedData.email,
          avatar_url: editedData.avatar_url
        })
      });

      setUserData(editedData);
      setIsEditing(false);
    } catch (err) {
      setError('Ошибка при сохранении данных');
      console.error('Error:', err);
    }
  };

  // ... rest of the existing code ...

  return (
    // ... rest of the existing JSX ...
  );
};

export default Profile; 