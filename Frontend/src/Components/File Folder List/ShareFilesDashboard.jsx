import React from "react";
import { Copy, Globe, Mail } from "lucide-react";

function ShareFilesDashboard() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-2">Share "Coding"</h2>
      <p className="text-sm text-gray-500 mb-4">
        Share this with others by sending them a link or inviting them directly.
      </p>

      {/* Invite people */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Invite people
        </label>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full border rounded-l-lg px-3 py-2 text-sm"
          />
          <button className="bg-blue-600 text-white px-4 rounded-r-lg flex items-center">
            <Mail size={16} className="mr-1" /> Invite
          </button>
        </div>
        <input
          type="text"
          placeholder="Enter name to share this file"
          className="w-full border rounded-lg px-3 py-2 mt-2 text-sm"
        />
      </div>

      {/* People with access */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          People with access
        </h3>
        <div className="flex items-center justify-between border rounded-lg px-3 py-2">
          <span className="text-sm">info@dhruvish.in</span>
          <select className="border rounded px-2 py-1 text-sm">
            <option>Viewer</option>
            <option>Editor</option>
            <option>Owner</option>
          </select>
        </div>
      </div>

      {/* Share link */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-1">Share link</h3>
        <div className="flex items-center mb-2">
          <Globe size={16} className="mr-2 text-gray-600" />
          <span className="text-sm">Anyone with link</span>
        </div>
        <div className="flex">
          <input
            type="text"
            value="http://localhost:4000/share/coding-files"
            readOnly
            className="w-full border rounded-l-lg px-3 py-2 text-sm"
          />
          <button className="bg-gray-200 px-3 rounded-r-lg flex items-center">
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button className="px-4 py-2 rounded-lg border">Cancel</button>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          Done
        </button>
      </div>
    </div>
  );
}

export default ShareFilesDashboard;
