import React, { useState } from "react";

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3"></div>
  );
};

export default PasswordInput;
