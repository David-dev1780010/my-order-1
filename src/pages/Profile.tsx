import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            photo_url?: string;
            username?: string;
            id?: number;
          };
        };
        openTelegramLink: (url: string) => void;
        close: () => void;
      };
    };
  }
}

const Profile: React.FC = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('никнейм');
  const [email, setEmail] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Функция для конвертации файла в base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Функция для сохранения временных данных
  const saveTempData = () => {
    try {
      const tempData = {
        tempUsername: tempUsername,
        tempEmail: tempEmail,
        tempPhoto: previewUrl,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('tempProfileData', JSON.stringify(tempData));
    } catch (error) {
      console.error('Ошибка при сохранении временных данных:', error);
    }
  };

  // Функция для загрузки временных данных
  const loadTempData = () => {
    try {
      const savedTempData = localStorage.getItem('tempProfileData');
      if (savedTempData) {
        const { tempUsername: savedTempUsername, tempEmail: savedTempEmail, tempPhoto: savedTempPhoto } = JSON.parse(savedTempData);
        if (savedTempUsername) {
          setTempUsername(savedTempUsername);
        }
        if (savedTempEmail) {
          setTempEmail(savedTempEmail);
        }
        if (savedTempPhoto) {
          setPreviewUrl(savedTempPhoto);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке временных данных:', error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertFileToBase64(file);
        setPreviewUrl(base64String);
        saveTempData();
      } catch (error) {
        console.error('Ошибка при конвертации файла:', error);
      }
    }
  };

  // Функция для сохранения профиля
  const saveProfile = () => {
    try {
      const profileData = {
        savedUsername: username,
        savedEmail: email,
        savedPhoto: previewUrl || userPhoto,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
    }
  };

  // Функция для загрузки сохраненных данных
  const loadSavedProfile = () => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const { savedUsername, savedEmail, savedPhoto } = JSON.parse(savedProfile);
        if (savedUsername && savedUsername !== 'никнейм') {
          setUsername(savedUsername);
          setTempUsername(savedUsername);
        }
        if (savedEmail) {
          setEmail(savedEmail);
          setTempEmail(savedEmail);
        }
        if (savedPhoto) {
          setUserPhoto(savedPhoto);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
    }
  };

  useEffect(() => {
    // Загружаем сохраненные данные
    loadSavedProfile();
    loadTempData();

    // Получаем данные пользователя из Telegram WebApp
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser) {
      // Проверяем, есть ли сохраненный никнейм
      const savedProfile = localStorage.getItem('userProfile');
      const hasSavedUsername = savedProfile && JSON.parse(savedProfile).savedUsername !== 'никнейм';
      const hasSavedPhoto = savedProfile && JSON.parse(savedProfile).savedPhoto;

      if (telegramUser.photo_url && !hasSavedPhoto) {
        setUserPhoto(telegramUser.photo_url);
      }
      if (telegramUser.username && !hasSavedUsername) {
        setUsername(telegramUser.username);
        setTempUsername(telegramUser.username);
      }
    }

    // Добавляем обработчик события закрытия приложения
    const handleBeforeUnload = () => {
      saveProfile();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Очищаем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Отдельный useEffect для сохранения при изменении данных
  useEffect(() => {
    if (username !== 'никнейм' || email || userPhoto || previewUrl) {
      saveProfile();
    }
  }, [username, email, userPhoto, previewUrl]);

  // Обработчики изменений полей
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUsername(e.target.value);
    saveTempData();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempEmail(e.target.value);
    saveTempData();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // При входе в режим редактирования загружаем последние сохраненные данные
    loadTempData();
  };

  const handleSave = () => {
    try {
      const newUsername = tempUsername.trim() || username;
      const newEmail = tempEmail.trim() || email;
      const newPhoto = previewUrl || userPhoto;

      // Обновляем состояние
      setUsername(newUsername);
      setEmail(newEmail);
      setUserPhoto(newPhoto);
      setPreviewUrl(null);

      // Сохраняем в localStorage
      saveProfile();
      
      // Очищаем временные данные
      localStorage.removeItem('tempProfileData');
      
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
    }
  };

  const handleCancel = () => {
    setTempUsername(username);
    setTempEmail(email);
    setPreviewUrl(null);
    // Очищаем временные данные при отмене
    localStorage.removeItem('tempProfileData');
    setIsEditing(false);
  };

  const handleDepositClick = () => {
    setIsDepositing(true);
  };

  const handleDeposit = () => {
    if (!depositAmount) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 1 || amount > 1000) {
      if (window.Telegram && window.Telegram.WebApp && (window.Telegram.WebApp as any).showAlert) {
        (window.Telegram.WebApp as any).showAlert('Сумма должна быть от 1 до 1000$');
      } else {
        alert('Сумма должна быть от 1 до 1000$');
      }
      return;
    }
    setIsRedirecting(true);
    const url = `https://t.me/orderenineenngbot?start=balance_${amount}`;
    setTimeout(() => {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
        setTimeout(() => {
          if (window.Telegram.WebApp.close) window.Telegram.WebApp.close();
        }, 500);
      } else {
        window.location.href = url;
      }
    }, 1200);
  };

  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    if (value === '' || (parseFloat(value) >= 1 && parseFloat(value) <= 1000)) {
      setDepositAmount(value);
    }
  };

  const containerVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '100px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{
          backgroundColor: '#2D1E5A',
          borderRadius: '25px',
          padding: '30px 20px',
          width: '100%',
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {isDepositing ? (
          <>
            <h1 style={{
              color: 'white',
              fontSize: '32px',
              marginBottom: '40px',
              fontWeight: '500',
              fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Пополнение баланса
            </h1>
            <input
              type="text"
              value={depositAmount ? `${depositAmount}$` : ''}
              onChange={handleDepositAmountChange}
              placeholder="Введите сумму (1-1000$)"
              style={{
                backgroundColor: '#584C7D',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                color: 'white',
                fontSize: '16px',
                width: '100%',
                marginBottom: '20px',
                outline: 'none',
                fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            />
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <img
                src="/images/crypto_pay.png"
                alt="CryptoBot"
                style={{
                  width: '200px',
                  height: '110px',
                  objectFit: 'contain',
                  background: 'none',
                  boxShadow: 'none',
                  border: 'none',
                }}
              />
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#B6116B',
                color: 'white',
                border: 'none',
                fontSize: '17px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
              onClick={handleDeposit}
            >
              Пополнить
            </motion.button>
          </>
        ) : (
          <>
            <h1 style={{
              color: 'white',
              fontSize: '32px',
              marginBottom: '40px',
              fontWeight: '500',
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Личный кабинет
            </h1>

            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '3px solid #FF54BD',
              backgroundColor: '#2D1E5A',
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
              padding: '8px',
              cursor: isEditing ? 'pointer' : 'default'
            }}>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                />
              )}
              {(previewUrl || userPhoto) ? (
                <img 
                  src={previewUrl || userPhoto || ''}
                  alt="Аватар пользователя"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: '#FF54BD',
                  opacity: 0.5
                }} />
              )}
              {isEditing && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '10px',
                  textAlign: 'center',
                  padding: '2px 0'
                }}>
                  Изменить
                </div>
              )}
            </div>

            {isEditing ? (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="text"
                value={tempUsername}
                onChange={handleUsernameChange}
                placeholder="Введите никнейм"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid #FF54BD',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '16px',
                  width: '100%',
                  marginBottom: '10px',
                  outline: 'none'
                }}
              />
            ) : (
              <div style={{
                color: 'white',
                marginBottom: '5px',
                fontSize: '20px',
                fontWeight: '400',
                opacity: '0.9'
              }}>
                {username}
              </div>
            )}

            <AnimatePresence>
              {isEditing && (
                <motion.input
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  type="email"
                  value={tempEmail}
                  onChange={handleEmailChange}
                  placeholder="Введите email"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid #FF54BD',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '16px',
                    width: '100%',
                    marginBottom: '10px',
                    outline: 'none'
                  }}
                />
              )}
            </AnimatePresence>

            {!isEditing && (
              <div style={{
                color: '#9E9E9E',
                marginBottom: '25px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Баланс: <span style={{ color: 'white' }}>💰 $0</span>
              </div>
            )}

            {!isEditing && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleDepositClick}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#B6116B',
                  color: 'white',
                  border: 'none',
                  fontSize: '17px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                Пополнить баланс
              </motion.button>
            )}

            {!isEditing ? (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleEditClick}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#09FBD3',
                  color: '#2D1E5A',
                  border: 'none',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Редактировать профиль
              </motion.button>
            ) : (
              <>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleSave}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#09FBD3',
                    color: '#2D1E5A',
                    border: 'none',
                    fontSize: '17px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                >
                  Сохранить
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleCancel}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#B6116B',
                    color: 'white',
                    border: 'none',
                    fontSize: '17px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </motion.button>
              </>
            )}
          </>
        )}
      </motion.div>
      {isRedirecting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 22,
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          flexDirection: 'column'
        }}>
          <div className="loader" style={{
            width: 40, 
            height: 40, 
            border: '4px solid #fff', 
            borderTop: '4px solid #B6116B', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
        </div>
      )}
    </div>
  );
};

export default Profile; 