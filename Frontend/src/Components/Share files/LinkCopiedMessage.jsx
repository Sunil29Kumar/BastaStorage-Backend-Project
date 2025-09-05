import React from "react";

function LinkCopiedMessage() {
  return (
    <div className=" absolute bottom-0 left-[50%] translate-x-[-50%] flex items-center gap-2">
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition">
        Copy Link
      </button>
    </div>
  );
}

export default LinkCopiedMessage;
