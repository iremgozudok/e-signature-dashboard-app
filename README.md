# Digital Signature Platform

A comprehensive digital signature and timestamping platform built with Vue.js 3, TypeScript, and modern web technologies. This application provides secure document signing, timestamping, and recipient management capabilities with a beautiful, responsive user interface.

## 🚀 Features

### Core Functionality
- **Digital Document Signing**: Upload and sign PDF documents with custom signatures
- **Timestamping**: Add trusted timestamps to documents for legal validity
- **PDF Preview**: Built-in PDF viewer with page navigation
- **File Management**: Upload, preview, download, and delete documents
- **Recipient Management**: Manage registered recipients for document sharing
- **Profile Management**: User profile settings and signature customization

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Multi-language Support**: Available in Turkish and English
- **Dark Theme**: Modern dark UI with zinc color scheme
- **Drag & Drop**: Intuitive file upload with drag and drop functionality
- **Real-time Feedback**: Toast notifications and confirmation dialogs
- **Search & Filter**: Advanced search capabilities for files and recipients

### Security & Validation
- **File Type Validation**: Only PDF files are accepted for signing/timestamping
- **File Size Limits**: Configurable storage and file count limits
- **Duplicate Prevention**: Prevents uploading duplicate files
- **Authentication**: Secure login system with route guards

## 🛠️ Technology Stack

### Frontend Framework
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### UI & Styling
- **PrimeVue 4** - Comprehensive Vue.js UI component library
- **PrimeIcons** - Icon library for PrimeVue components
- **Tailwind CSS 4** - Utility-first CSS framework
- **Aura Theme** - Modern design system from PrimeVue

### State Management & Routing
- **Pinia** - Vue.js state management library
- **Vue Router 4** - Official router for Vue.js applications
- **Vue I18n** - Internationalization plugin

### PDF & File Handling
- **pdf-vue3** - PDF viewer component for Vue 3
- **vue3-signature-pad** - Digital signature pad component
- **SortableJS** - Drag and drop functionality

### Development Tools
- **Vue TSC** - TypeScript compiler for Vue
- **@vitejs/plugin-vue** - Vue plugin for Vite
- **@types/sortablejs** - TypeScript definitions

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.