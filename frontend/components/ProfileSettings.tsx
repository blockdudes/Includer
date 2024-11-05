import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";

const ProfileSettings = () => {
  const [profilePhoto, setProfilePhoto] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [username, setUsername] = useState("johndoe");
  const [isEditMode, setIsEditMode] = useState(false);

  // Store original values to restore on cancel
  const [originalFirstName, setOriginalFirstName] = useState(firstName);
  const [originalLastName, setOriginalLastName] = useState(lastName);
  const [originalUsername, setOriginalUsername] = useState(username);
  const [originalProfilePhoto, setOriginalProfilePhoto] =
    useState(profilePhoto);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("Profile updated:", {
      firstName,
      lastName,
      username,
      profilePhoto,
    });
    setOriginalFirstName(firstName);
    setOriginalLastName(lastName);
    setOriginalUsername(username);
    setOriginalProfilePhoto(profilePhoto);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    // Revert to original values
    setFirstName(originalFirstName);
    setLastName(originalLastName);
    setUsername(originalUsername);
    setProfilePhoto(originalProfilePhoto);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">Profile Settings</h2>
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
        <div className="h-32 w-32 rounded-full bg-gray-400 flex justify-center items-center">
          <img
            src={profilePhoto || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          {isEditMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
        </div>
        </div>
        <p className="text-sm text-white">
          {isEditMode ? "Click to change profile photo" : "Profile Photo"}
        </p>
      </div>
      <div>
        <label className="text-lg text-white">First Name</label>
        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          size="md"
          readOnly={!isEditMode}
          className={`border !border-white placeholder:opacity-100 placeholder:text-white/80 text-white ${
            isEditMode ? "" : "bg-transparent cursor-default"
          }`}
          labelProps={{
            className: "hidden",
          }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
      </div>
      <div>
        <label className="text-lg text-white">Last Name</label>
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          size="md"
          readOnly={!isEditMode}
          className={`border !border-white placeholder:opacity-100 placeholder:text-white/80 text-white ${
            isEditMode ? "" : "bg-transparent cursor-default"
          }`}
          labelProps={{
            className: "hidden",
          }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
      </div>
      <div>
        <label className="text-lg text-white">Username</label>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="md"
          readOnly={!isEditMode}
          className={`border !border-white placeholder:opacity-100 placeholder:text-white/80 text-white ${
            isEditMode ? "" : "bg-transparent cursor-default"
          }`}
          labelProps={{
            className: "hidden",
          }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
      </div>
      {isEditMode ? (
        <div className="w-full grid gap-4 mt-4">
          <Button
            color="yellow"
            onClick={handleSave}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Save Changes
          </Button>
          <Button
            color="red"
            onClick={handleCancel}
            variant="outlined"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          color="yellow"
          onClick={toggleEditMode}
          className="mt-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default ProfileSettings;
