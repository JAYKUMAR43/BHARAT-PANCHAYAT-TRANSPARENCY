import React from "react";

export default function Timeline({ progressPercent = 0, expectedEndDate = null, predictedDelayDays = 0 }) {
  const percent = Math.min(Math.max(progressPercent, 0), 100);
  return (
    <div style={{marginTop:12}}>
      <h4>Project Progress</h4>
      <div style={{background:"#eee", borderRadius:6, height:20, overflow:"hidden"}}>
        <div style={{width:`${percent}%`, height:"100%", background: percent>70 ? "#2ecc71" : (percent>30 ? "#f1c40f" : "#e74c3c")}} />
      </div>
      <p>{percent}% complete</p>
      <p>Predicted delay: {predictedDelayDays} days</p>
      {expectedEndDate && <p>Expected end date: {new Date(expectedEndDate).toDateString()}</p>}
    </div>
  );
}
