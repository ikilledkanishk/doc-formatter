# 📄 Document Formatter Pro

A lightweight, web-based document editing and formatting tool designed to streamline document creation, live styling preview, local document management, and seamless PDF/Word exports.

---

## 🏆 Project Background & Context

This project was developed in **October 2025** during my **2nd year of college** for an **Artificial Intelligence Learning-Based Hackathon** organized directly by our college. 

* **Strict Requirement Adherence:** Built within a few days, strictly following the provided problem statement, test cases, and functional constraints.
* **Problem Scope:** Solving real-time document previewing, local state persistence, clean multi-format export handling, and file parsing directly in the browser without server dependencies.

---

## ✨ Features

- **📑 Interactive Editor Workspace:**
  - Real-time word and character counters.
  - Built-in file reader supporting `.txt` and `.md` file imports.
- **🎨 Live Styled Preview Page:**
  - Dynamic paper-like document rendering.
  - Preset document templates (*Professional Resume*, *Business Letter*, *Project Report*) with tailored font family, line height, font size, and text alignment rules.
- **💾 Local Document Management:**
  - Save and store drafts directly in the browser's `localStorage`.
  - Open, reload, or delete saved drafts seamlessly with real-time status updates.
- **🖨️ Clean Export Capabilities:**
  - **Export as PDF:** Clean print window isolation to prevent browser UI or webpage elements from appearing in exported PDFs.
  - **Export as Word (.doc):** Direct client-side `.doc` generation using Blob binary streams.

---

## 🛠️ Tech Stack

- **Frontend Core:** HTML5, Plain JavaScript (Vanilla ES6+)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Browser APIs Used:**
  - `localStorage` API for document persistence.
  - `FileReader` API for importing local `.txt`/`.md` files.
  - `Blob` & `URL.createObjectURL` for client-side Word document downloads.
  - `window.print()` API for PDF rendering.

---

## 🚀 Getting Started

Since this project is built entirely on client-side web technologies, no complex node package installations or server setups are required.

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- (Optional) [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code.

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/document-formatter-pro.git](https://github.com/YOUR_USERNAME/document-formatter-pro.git)
   cd document-formatter-pro
