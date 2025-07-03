# CRM Pro - Professional CRM System in Vue.js

A modern, responsive Customer Relationship Management (CRM) system built with Vue 3, TypeScript, and Tailwind CSS.

![Dashboard](https://github.com/user-attachments/assets/1a5ce2f6-2e5b-4fa4-a851-fedef3347023)

## Features

### 🏗️ Modern Architecture
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive design
- **Vue Router** for navigation
- **Pinia** for state management

### 📊 Dashboard
- Key business metrics overview
- Sales pipeline visualization
- Recent activities feed
- Interactive widgets

### 👥 Contact Management
![Contacts](https://github.com/user-attachments/assets/9389a866-844c-4609-99bc-e7407327e5fb)

- Complete CRUD operations
- Contact status management (Lead, Prospect, Customer)
- Search and filtering
- Responsive card layout
- Contact information management

### 💼 Sales Pipeline
![Pipeline](https://github.com/user-attachments/assets/70ebb326-ee8f-46da-bd0c-183589ef99db)

- Visual Kanban-style pipeline
- Deal management across stages:
  - Prospecting
  - Qualified
  - Proposal
  - Negotiation
  - Closed
- Value and probability tracking
- Deal-to-contact linking

### 📅 Activity Management
- Activity tracking with multiple types:
  - Calls
  - Emails
  - Meetings
  - Tasks
  - Demos
- Status management (Scheduled, Completed, Cancelled, Overdue)
- Activity-to-contact and activity-to-deal linking

### 🔐 Authentication
- Login system with form validation
- Route protection
- Session management

### 🎨 UI/UX Features
- Fully responsive design
- Professional interface
- Form validation with error handling
- Loading states
- Modal dialogs
- Search and filtering
- Status badges and icons

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chronokairo/crm_vue.git
cd crm_vue
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

### Login
- Navigate to the login page
- Enter any valid email and password (6+ characters)
- The system uses mock authentication for demonstration

### Dashboard
- View key business metrics
- Monitor sales pipeline overview
- Check recent activities

### Managing Contacts
- Add new contacts with complete information
- Edit existing contacts
- Filter by status (Lead, Prospect, Customer)
- Search contacts by name, email, or company

### Managing Deals
- Create deals and assign to contacts
- Track deals through the sales pipeline
- Set deal values and probability percentages
- Move deals between stages

### Managing Activities
- Schedule various types of activities
- Link activities to contacts and deals
- Mark activities as completed
- Filter by type and status

## Project Structure

```
src/
├── components/
│   ├── base/           # Reusable UI components
│   ├── layout/         # Layout components
│   └── ...
├── pages/              # Main application pages
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
├── types/              # TypeScript type definitions
├── assets/             # Static assets and styles
└── utils/              # Utility functions
```

## Technology Stack

- **Frontend Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: Vue Router
- **State Management**: Pinia
- **Icons**: Heroicons
- **HTTP Client**: Axios (ready for API integration)

## Future Enhancements

- Real API integration
- Advanced authentication with JWT
- Drag & drop for pipeline management
- Calendar integration
- Advanced reporting and analytics
- Email integration
- File attachments
- Advanced user permissions
- Data export functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
