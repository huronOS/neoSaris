import React from "react";
import { HeartSpinner } from "react-spinners-kit";

//Not the best, but is what the author recommend https://github.com/davidhu2000/react-spinners/issues/53
const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

const Spinner = () => {
  return (
    <div style={style}>
      <HeartSpinner />
    </div>
  );
};

export default Spinner;
