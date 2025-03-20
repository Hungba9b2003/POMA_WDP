import React, { useState } from "react";
import "./../../Styles/project/DropArea.css";
const DropArea = ({ onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <section
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={() => {
        setShowDrop(false);
        onDrop();
      }}
      onDragOver={(e) => e.preventDefault()}
      className={showDrop ? "drop_area" : "hide_drop"}
    >
      Drop here
    </section>
  );
};

export default DropArea;
