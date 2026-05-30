[![Download Here](https://img.shields.io/badge/⬇_Download-Here-success?style=for-the-badge)](https://chromewebstore.google.com/detail/chatgpt-automation-auto-c/nocgcjgldlpeffhdhfjejhcgjbgcmpgb)

# 🚀 ChatGPT Automation v1.0.2 - Auto ChatGPT on chatgpt.com [![Tiếng Việt](https://img.shields.io/badge/Tiếng%20Việt-green)](README_vi.md) [![中文](https://img.shields.io/badge/中文-red)](README_zh.md)

**ChatGPT Automation** is a powerful productivity tool designed to supercharge your workflow on ChatGPT.com. Stop manually entering prompts one by one—automate the process and batch generate responses and images at scale.

-----

## ✨ Key Features

* **🚀 Advanced Batch Processing:** Queue dozens or hundreds of prompts and let the extension handle the submission and generation automatically.
* **💬 Text Processing Automation:** Batch generate text responses from ChatGPT. Supports multiple prompts with custom delays.
* **🧩 Ingredients to Text:** Process multiple input components or images together with each prompt.
* **🖼️ Text-to-Image Batching:** Create multiple images simultaneously from text descriptions.
* **🔄 Image-to-Image:** Transform and enhance existing images using AI with text prompts.
* **⚙️ Professional Control Suite:**
    * **Concurrent Prompts:** Process multiple prompts simultaneously to save time.
    * **Smart Delays:** Set custom intervals between prompts to manage rate limits effectively.
    * **Auto Download:** Automatically save the final results to your computer.
    * **Auto Change File Name:** Automatically rename downloaded files to keep them organized.
    * **Save to Folder:** Specify a custom subfolder for downloaded files per project.
* **🎭 Auto-add Character Images:** Automatically match and attach images to prompts based on character names in filenames.
* **📊 Real-time Queue Management:** Monitor your generation progress with a visual status bar and active prompt list in the Side Panel.
* **📂 Organized File Management:** Automatically sorts downloads into project-specific folders to keep your workspace clean.
* **🖼️ Independent Screen Auto-download:** When a prompt contains independent-screen wording such as step-by-step screens, screen 1, single image, or separate canvas, the side panel marks it as an independent-screen prompt and downloads all images from that response instead of only the first one.
* **📝 Paper-topic File Naming:** Downloaded images are named from a short phrase extracted from the paper text after `论文内容：` / `Paper content`.
* **🔧 Quick Fix:** One-click tool to recover from generation errors.
* **💳 Plan Management:** Sign in to check your plan and track daily prompt usage.
* **🌐 Multi-language Support:** Available in English, Vietnamese, Chinese, Korean, Spanish, and Japanese.

-----

## 📥 Installation

### Method 1: Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/chatgpt-automation-auto-c/nocgcjgldlpeffhdhfjejhcgjbgcmpgb)
2. Click **Add to Chrome**.

---

## 📖 User Guide

### Getting Started

1. **Navigate to ChatGPT**
   - Open [chatgpt.com](https://chatgpt.com)
   - The extension only works on ChatGPT pages.

2. **Open the Extension**
   - Click the extension icon in Chrome toolbar. Pin it for easier access!

3. **Configure Batch Settings**
   - In the **Control** tab, you can set:
     - **Concurrent Prompts:** How many prompts to run at the same time.
     - **Prompt Delay:** Wait time between each prompt submission.
     - **Save to Folder:** Subfolder name for downloaded files.
     - **Auto Change File Name:** Toggle automatic file renaming.

4. **Select a Mode**
   - Choose from the available modes: **Text Processing**, **Ingredients to Text**, **Text to Image**, or **Image to Image**.

---

### 1. Text Processing Mode

1. Select **Text Processing** mode.
2. Enter prompts into the input box (separate each prompt with a **blank line**).
3. Alternatively, click **or upload .txt file** to import a list of prompts from a `.txt` file.
4. Click **Run** to start the batch.

**Example Prompts:**
```
Write a professional email to a client about a project delay.
Keep it concise and apologetic.

Summarize the key benefits of remote work in 5 bullet points.

Write a product description for a noise-cancelling headphone.
Target audience: remote workers.
```

---

### 2. Ingredients to Text Mode

1. Select **Ingredients to Text** mode.
2. Upload the images or component files you want to include.
3. Enter prompts (separate with blank lines). Images will be processed with each prompt.
4. Optionally enable **Auto-add character images** to automatically attach images whose filenames match character names mentioned in your prompts.
5. In **Settings**, set **Max Input Images per Prompt** (1–3) to control how many images are used per prompt.
6. Click **Run**.

---

### 3. Text-to-Image Mode

1. Select **Text to Image** mode.
2. Enter detailed descriptions for your images (separate each prompt with a **blank line**).
3. Configure the desired **Image Model** in the Settings tab.
4. Click **Run**.

**Example Prompts:**
```
A serene mountain landscape at sunrise with golden light reflecting on a lake.

A futuristic city skyline at night with neon lights and flying cars.

A cozy coffee shop interior with warm lighting and bookshelves on the walls.
```

---

### 4. Image-to-Image Mode

1. Select **Image to Image** mode.
2. Upload the source images you want to transform.
3. Enter prompts (separate with blank lines).
4. Optionally enable **Auto-add character images** to automatically attach images based on filename matching.
5. In **Settings**, set **Max Input Images per Prompt** (1–10).
6. Click **Run**.

---

## ⚙️ Settings Configuration

Access the **Setting** tab to customize your experience:

| Setting | Description |
| :--- | :--- |
| **Default Mode** | Set which mode opens by default. |
| **Outputs per Prompt (Text)** | Set how many text responses (1–4) to generate per prompt. |
| **Outputs per Prompt (Image)** | Set how many images (1–50) to generate per prompt. |
| **Concurrent Prompts** | Number of prompts to process simultaneously (1–6). |
| **Random Delay** | Random wait time before handling the next prompt. |
| **Text Model** | Select the text generation model to use. |
| **Image Model** | Select the AI model for text-to-image generation. |
| **Default Prompt Mode Option** | Default mode for prompts: New Chat or Concat (combine with next). Last prompt always uses New Chat. |
| **Default Image Mode Option** | Default input mode for image prompts: New Image or Last Image (chain from previous output). |
| **Max Input Images per Prompt (Ingredients)** | For Ingredients to Text mode: 1–3 images per prompt. |
| **Max Input Images per Prompt (Image to Image)** | For Image to Image mode: 1–10 images per prompt. |
| **Max Retries on Failure** | How many times to retry if generation fails (1–20). |
| **Auto Download (Text)** | Download option for text generation: No Download or custom. |
| **Auto Download Quality (Image)** | No Download or 1k quality. |
| **Language** | Switch between English, Tiếng Việt, 中文, 한국어, Español, 日本語. |

---

## 💡 Tips & Best Practices

1. **Wait Times:** If you encounter rate limits, increase the **Random Delay** in Settings.
2. **Concurrent Runs:** Start with 1 concurrent prompt and increase slowly to see what your account supports.
3. **Prompting:** Be specific! Detailed prompts lead to better AI generations. Separate multiple prompts with a clear blank line.
4. **File Organization:** Use the **Save to Folder** field to keep project downloads in named subfolders.
5. **Character Images:** Name your image files after characters (e.g., `hero.png`, `villain.jpg`) and enable **Auto-add character images** to have them matched automatically.
6. **Prompt Chaining (Concat):** Use the *Concat* mode option to chain prompts together — each prompt is combined with the next in a single ChatGPT conversation.
7. **Image Chaining (Last Image):** Use the *Last Image* mode option for Image to Image — each prompt's output becomes the next prompt's input.
8. **Quick Fix:** If a generation gets stuck or errors, use the **Fix Error** button in the Control tab.

---

## 🔧 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Extension not active** | Ensure you are on [chatgpt.com](https://chatgpt.com). Refresh the page (Ctrl+R or F5) if needed. |
| **Generation Errors** | ChatGPT might be busy. The extension will automatically retry based on your **Max Retries** setting. Use **Fix Error** to manually recover. |
| **Downloads not working** | Ensure "Ask where to save each file before downloading" is **OFF** in Chrome Settings. |
| **Login Required** | Make sure you are logged into your ChatGPT account. |
| **Connection Error** | Refresh the ChatGPT page (Ctrl+R, F5) and try again. If the problem persists, try reinstalling the extension. |

---

## 🔒 Privacy & Data

* **Local Processing:** All automation logic runs locally in your browser.
* **No Data Collection:** We do not store or collect your prompts, images, or account data.
* **Secure Storage:** Settings are saved only in your browser's local storage and synced across tabs.

---

## 📞 Support

- **Author:** Trường Nguyễn
- **Website:** [kylenguyen.me](https://kylenguyen.me)
- **Feedback:** Use the "Report a bug" link in the extension.

---

## 📦 Version

Current version: **1.0.2**

---

## 📜 License

Copyright © 2026 **Trường Nguyễn**. All Rights Reserved.

This software is proprietary. Unauthorized copying or distribution is prohibited.

---

**Made with ❤️ by Trường Nguyễn**
