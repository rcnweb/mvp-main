import React from "react";
import './Loading.css'; 

const Loading = () => {
  return (
    <div className="loading-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="100"
        height="100"
        style={{ shapeRendering: "auto", display: "block", background: "transparent" }}
      >
        <g>
          <path
            stroke="none"
            fill="#00a98f"
            d="M22 50A28 28 0 0 0 78 50A28 30 0 0 1 22 50"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 50 51;360 50 51"
              keyTimes="0;1"
              dur="1.388s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
