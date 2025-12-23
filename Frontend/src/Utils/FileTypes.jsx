import {
  FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAlt,
  FaFileCsv, FaImage, FaFileVideo, FaFileAudio, FaFileArchive,
  FaFileCode, FaDatabase, FaFile,
} from "react-icons/fa";
import { MdTextSnippet, MdBackup } from "react-icons/md";
import { SiMarkdown } from "react-icons/si";
import { BsFileEarmarkBinary } from "react-icons/bs";

export const fileFormats = [
  // 📄 Documents
  { type: "PDF", extensions: ["pdf"], icon: <FaFilePdf/>, bg: "bg-red-100", color: "text-red-600" },
  { type: "Word", extensions: ["doc", "docx"], icon: <FaFileWord/>, bg: "bg-blue-100", color: "text-blue-600" },
  { type: "Excel", extensions: ["xls", "xlsx"], icon: <FaFileExcel/>, bg: "bg-emerald-100", color: "text-emerald-600" },
  { type: "PowerPoint", extensions: ["ppt", "pptx"], icon: <FaFilePowerpoint/>, bg: "bg-orange-100", color: "text-orange-600" },
  { type: "Text", extensions: ["txt"], icon: <MdTextSnippet/>, bg: "bg-gray-100", color: "text-gray-600" },
  { type: "Markdown", extensions: ["md"], icon: <SiMarkdown/>, bg: "bg-zinc-100", color: "text-zinc-800" },
  { type: "CSV", extensions: ["csv"], icon: <FaFileCsv/>, bg: "bg-green-100", color: "text-green-700" },

  // 🖼️ Images
  {
    type: "Image",
    extensions: ["jpg", "jpeg", "png", "bmp", "webp", "tiff", "svg"],
    icon: <FaImage/>, bg: "bg-purple-100", color: "text-purple-600",
  },

  // 🎥 Videos
  {
    type: "Video",
    extensions: ["mp4", "mov", "mkv", "avi", "flv", "webm"],
    icon: <FaFileVideo/>, bg: "bg-rose-100", color: "text-rose-600",
  },

  // 🎵 Audio
  {
    type: "Audio",
    extensions: ["mp3", "wav", "ogg", "flac", "aac"],
    icon: <FaFileAudio/>, bg: "bg-amber-100", color: "text-amber-600",
  },

  // 🗃️ Archives
  {
    type: "Archive",
    extensions: ["zip", "rar", "7z", "tar", "gz"],
    icon: <FaFileArchive/>, bg: "bg-yellow-100", color: "text-yellow-700",
  },

  // 👨‍💻 Code
  {
    type: "Code",
    extensions: ["js", "jsx", "ts", "tsx", "html", "css", "scss", "json", "xml", "py", "java", "c", "cpp", "sh", "yaml"],
    icon: <FaFileCode/>, bg: "bg-indigo-100", color: "text-indigo-600",
  },

  // 💾 Executables / Binary
  {
    type: "Executable",
    extensions: ["exe", "msi", "apk", "app", "dmg", "deb", "iso", "img"],
    icon: <BsFileEarmarkBinary/>, bg: "bg-slate-200", color: "text-slate-700",
  },

  // 🧩 Misc
  { type: "Database", extensions: ["db", "sqlite"], icon: <FaDatabase/>, bg: "bg-cyan-100", color: "text-cyan-600" },
  { type: "Backup", extensions: ["bak"], icon: <MdBackup/>, bg: "bg-teal-100", color: "text-teal-600" },
  { type: "Log", extensions: ["log"], icon: <FaFileAlt/>, bg: "bg-slate-100", color: "text-slate-500" },
  { type: "Unknown", extensions: ["*"], icon: <FaFile/>, bg: "bg-gray-100", color: "text-gray-400" },
];