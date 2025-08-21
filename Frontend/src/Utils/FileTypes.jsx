export const fileFormats = [
  // 📄 Document files
  {type: "PDF", extensions: ["pdf"], icon: "📕"},
  {type: "Word", extensions: ["doc", "docx"], icon: "📘"},
  {type: "Excel", extensions: ["xls", "xlsx"], icon: "📗"},
  {type: "PowerPoint", extensions: ["ppt", "pptx"], icon: "📙"},
  {type: "Text", extensions: ["txt"], icon: "📄"},
  {type: "Markdown", extensions: ["md"], icon: "📝"},
  {type: "CSV", extensions: ["csv"], icon: "📊"},

  // 🖼️ Image files
  {
    type: "Image",
    extensions: ["jpg", "jpeg", "png", "bmp", "webp", "tiff"],
    icon: "🖼️",
  },
  {type: "GIF", extensions: ["gif"], icon: "🎞️"},
  {type: "SVG", extensions: ["svg"], icon: "📐"},

  // 🎥 Video files
  {
    type: "Video",
    extensions: ["mp4", "mov", "mkv", "avi", "flv", "webm"],
    icon: "🎬",
  },

  // 🎵 Audio files
  {
    type: "Audio",
    extensions: ["mp3", "wav", "ogg", "flac", "aac"],
    icon: "🎵",
  },

  // 🗃️ Archive files
  {
    type: "Archive",
    extensions: ["zip", "rar", "7z", "tar", "gz"],
    icon: "🗂️",
  },

  // 👨‍💻 Code files
  {
    type: "Code",
    extensions: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "scss",
      "json",
      "xml",
      "py",
      "java",
      "c",
      "cpp",
      "sh",
      "bat",
      "cmd",
      "yaml",
      "yml",
    ],
    icon: "💻",
  },

  // 💾 Executables & system
  {
    type: "Executable",
    extensions: ["exe", "msi", "apk", "app", "dmg", "deb"],
    icon: "🧩",
  },
  {type: "Disk Image", extensions: ["iso", "img"], icon: "💿"},

  // 🧩 Misc
  {type: "Database", extensions: ["db", "sqlite"], icon: "🗄️"},
  {type: "Log", extensions: ["log"], icon: "📜"},
  {type: "Backup", extensions: ["bak"], icon: "🗳️"},
  {type: "Unknown", extensions: ["*"], icon: "📁"},
];
