const ContactRequestProfileAvatar = ({ name, profilePhotoUrl }) => {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  if (profilePhotoUrl) {
    return (
      <img
        src={profilePhotoUrl}
        alt={name ? `${name} profile` : "User profile"}
        className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-white object-cover shadow-sm sm:h-20 sm:w-20 md:h-24 md:w-24"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0353a4] to-[#4b96e3] text-xl font-medium text-white shadow-sm sm:h-20 sm:w-20 sm:text-2xl md:h-24 md:w-24 md:text-3xl">
      {initial}
    </div>
  );
};

export default ContactRequestProfileAvatar;
