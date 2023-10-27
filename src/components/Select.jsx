import React from "react";

const Select = ({ value, options, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="outline-none rounded h-[45px] w-full px-3"
    >
      {options.map((option, index) => {
        return (
          <option key={index} value={option.isoCode && option.isoCode}>
            {option.name}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
