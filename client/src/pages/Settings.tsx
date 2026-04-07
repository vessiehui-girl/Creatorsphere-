import React, { useState } from 'react';

type NotificationKey = 'messages' | 'likes' | 'comments' | 'scheduleReminders' | 'sphereIntel';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [niche, setNiche] = useState('');
  const [bio, setBio] = useState('');
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    messages: false,
    likes: false,
    comments: false,
    scheduleReminders: false,
    sphereIntel: false,
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleUpgrade = () => {};

  const handleToggleNotification = (name: NotificationKey) => {
    setNotifications((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className="profile-card">
        <img src="/path/to/avatar" alt="Avatar" />
        <h2>{displayName}</h2>
        <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
      </div>
      {isEditing && (
        <div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Niche"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />
          <button onClick={handleSave}>Save Changes</button>
        </div>
      )}
      <div className="membership-section">
        <h2>Membership</h2>
        <p>Free</p>
        <p>Creator</p>
        <p>Pro</p>
        <button onClick={handleUpgrade}>Upgrade</button>
      </div>
      <div className="notification-toggles">
        <h2>Notification Settings</h2>
        {(Object.keys(notifications) as NotificationKey[]).map((key) => (
          <div key={key}>
            <label>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={() => handleToggleNotification(key)}
              />
              {key}
            </label>
          </div>
        ))}
      </div>
      <div className="account-actions">
        <h2>Account Actions</h2>
        <button>Change Password</button>
        <button>Export Data</button>
        <button>Sign Out</button>
        <button>Delete Account</button>
      </div>
    </div>
  );
};

export default Settings;
