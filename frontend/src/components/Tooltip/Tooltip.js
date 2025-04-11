import React, { useState } from "react";

const TooltipText = ({ text, maxLength = 25 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? text.slice(0, maxLength) + "..." : text;

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{
        position: "relative",
        display: "inline-block",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: shouldTruncate ? "pointer" : "default",
      }}
    >
      {displayText}

      {showTooltip && shouldTruncate && (
        <div
          style={{
            position: "absolute",
            bottom: "130%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            whiteSpace: "normal",
            zIndex: 9999,
            maxWidth: "220px",
            fontSize: "0.85rem",
            textAlign: "center",
            pointerEvents: "none", 
          }}
        >
          {text}

          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #333",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TooltipText;
