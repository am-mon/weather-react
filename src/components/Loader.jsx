import React from "react";
import { ImSpinner8 } from "react-icons/im";

const Loader = () => {
  return (
    <div>
      <div className="text-blue flex justify-center items-center">
        <div className="animate-spin h-5 w-5 mr-3">
          <ImSpinner8 className="text-xl" />
        </div>
        Processing...
      </div>
    </div>
  );
};

export default Loader;
