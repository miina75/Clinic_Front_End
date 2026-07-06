# Clinic Management System

A modern, responsive web application for managing clinic operations, patient records, doctor schedules, visits, prescriptions, and billing. Built with React, Vite, and Tailwind CSS for optimal performance and user experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)

---

## 📋 Overview

The Clinic Management System is a comprehensive solution designed to streamline clinic operations and improve patient care management. It provides healthcare professionals with an intuitive platform to manage patient information, doctor schedules, medical visits, prescriptions, and billing records all in one place.

### Key Capabilities

- **Patient Management**: Create, update, and manage patient records with comprehensive health information
- **Doctor Directory**: Maintain detailed doctor profiles with specialties and availability
- **Visit Tracking**: Schedule and track patient visits with diagnosis records
- **Prescription Management**: Issue and manage medication prescriptions for patient treatments
- **Billing System**: Generate invoices and track payment status for clinic services
- **User Authentication**: Secure login with role-based access control (Admin, Receptionist, Doctor, Patient)
- **Responsive Design**: Fully responsive interface supporting desktop, tablet, and mobile devices
- **Dark Mode**: Built-in dark theme toggle for comfortable viewing in any lighting condition

---

## ✨ Features

### Core Functionality

✅ **Authentication & Authorization**
- Secure login and registration
- Password recovery functionality
- Role-based access control (4 user roles)
- Session management

✅ **Patient Management**
- Complete patient profile management
- Demographic and contact information
- Medical history tracking
- Search and filter capabilities

✅ **Doctor Management**
- Doctor profile creation and management
- Specialty and expertise tracking
- Contact information and availability
- Search by name or specialty

✅ **Medical Records**
- Visit scheduling and documentation
- Diagnosis and treatment tracking
- Prescription issuance and management
- Medication and dosage details

✅ **Billing & Payments**
- Invoice generation
- Payment status tracking (Paid, Pending, Cancelled)
- Amount management per visit
- Billing date recording

✅ **User Experience**
- Real-time search and filtering across all modules
- Intuitive dashboard with key metrics
- Recent visits summary
- Dark/Light mode toggle
- Fully responsive design (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

### Frontend
- **React 18.x** - UI library for building interactive components
- **Vite 8.x** - Next-generation frontend build tool for fast development
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Tabler Icons** - Professional icon library with 4,000+ icons

### Development & Build
- **Node.js** - JavaScript runtime
- **PostCSS** - CSS transformation tool
- **ES Modules** - Modern JavaScript module system

### Architecture
- **Component-based design** - Reusable UI components in `src/components/ui`
- **Context API** - State management for authentication
- **Responsive layouts** - Mobile-first approach with Tailwind breakpoints
- **API-driven** - RESTful API integration for data persistence

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- A clinic management API backend running (see [API Configuration](#api-configuration))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clinic-management-system.git
   cd clinic-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set your API endpoint:
   ```
   VITE_CLINIC_API=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` directory

---

## 📁 Project Structure

```
src/
├── components/
│   └── ui/                    # Reusable shared UI components
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── FormField.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Table.jsx
│       ├── SearchBar.jsx
│       ├── LoadingMessage.jsx
│       └── FormActions.jsx
├── context/
│   └── AuthContext.jsx        # Authentication state management
├── pages/
│   ├── Dashboard.jsx          # Main dashboard with metrics
│   ├── Patients.jsx           # Patient list and management
│   ├── Doctors.jsx            # Doctor list and management
│   ├── Visits.jsx             # Medical visits tracking
│   ├── Prescriptions.jsx      # Prescription management
│   ├── Bills.jsx              # Billing and invoices
│   ├── Users.jsx              # User account management
│   └── auth/
│       ├── Login.jsx          # User login with password recovery
│       └── Register.jsx       # New user registration
├── services/
│   ├── AddEditDoctors.jsx
│   ├── AddEditPatients.jsx
│   ├── AddEditPrescriptions.jsx
│   ├── AddEditVisits.jsx
│   ├── AddEditBills.jsx
│   └── AddEditUsers.jsx
├── Layout/
│   ├── MainLayout.jsx         # Main application layout
│   └── Sidebar.jsx            # Navigation sidebar
├── App.jsx                    # Root application component
├── App.css
├── index.css
└── main.jsx
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
VITE_CLINIC_API=http://localhost:5000/api

# Optional: Add other configurations as needed
```

### Tailwind CSS

Tailwind CSS is pre-configured in `tailwind.config.js`. Customize it by:
- Modifying color schemes in `theme.colors`
- Adjusting breakpoints in `theme.screens`
- Adding custom utilities in `theme.extend`

### Dark Mode

Dark mode is fully supported and can be toggled via the sidebar. Persistence is handled via localStorage.

---

## 🔐 Authentication & Authorization

### User Roles

1. **Admin** - Full system access, user management, all operations
2. **Receptionist** - Patient registration, appointment scheduling
3. **Doctor** - View and manage patient records, prescriptions, visits
4. **Patient** - View personal health information

### Login Features

- Secure authentication with password hashing
- Password recovery/reset functionality
- Automatic session management
- Role-based UI rendering

**Test Credentials** (if available from your backend):
```
Username: admin
Password: admin123
```

---

## 🔌 API Integration

The application communicates with a RESTful API backend. Key endpoints:

### Users
- `GET /Users` - List all users
- `GET /Users/:id` - Get user details
- `POST /Users` - Create new user
- `PUT /Users/:id` - Update user
- `DELETE /Users/:id` - Delete user

### Patients
- `GET /Patient` - List all patients
- `GET /Patient/:id` - Get patient details
- `POST /Patient` - Create patient
- `PUT /Patient/:id` - Update patient
- `DELETE /Patient/:id` - Delete patient

### Doctors
- `GET /Doctor` - List all doctors
- `GET /Doctor/:id` - Get doctor details
- `POST /Doctor` - Create doctor
- `PUT /Doctor/:id` - Update doctor
- `DELETE /Doctor/:id` - Delete doctor

### Visits
- `GET /Visit` - List all visits
- `GET /Visit/:id` - Get visit details
- `POST /Visit` - Schedule visit
- `PUT /Visit/:id` - Update visit
- `DELETE /Visit/:id` - Delete visit

### Prescriptions
- `GET /Prescription` - List all prescriptions
- `POST /Prescription` - Create prescription
- `PUT /Prescription/:id` - Update prescription
- `DELETE /Prescription/:id` - Delete prescription

### Bills
- `GET /Bill` - List all bills
- `POST /Bill` - Create bill
- `PUT /Bill/:id` - Update bill
- `DELETE /Bill/:id` - Delete bill

---

## 📱 Responsive Design

The application is fully responsive across all device sizes:

- **Mobile** (< 640px) - Single column layout, touch-optimized buttons
- **Tablet** (640px - 1024px) - Two-column layout for forms and tables
- **Desktop** (> 1024px) - Full three-column layout, expanded navigation
- **Large Desktop** (> 1280px) - Maximum width container for optimal readability

---

## 🌙 Dark Mode

Toggle dark mode via the sun/moon icon in the sidebar. The preference is saved to browser localStorage and persists across sessions.

---

## 📊 Dashboard

The dashboard provides:
- **Key Metrics**: Total patients, doctors, visits, and bills at a glance
- **Quick Links**: Navigate directly to relevant sections
- **Recent Visits**: Display of the 5 most recent patient visits
- **Status Overview**: Real-time data from all clinic operations

---

## 🔍 Search & Filtering

All list pages include real-time search functionality:
- **Patients**: Search by first/last name
- **Doctors**: Search by name or specialty
- **Users**: Search by username or email
- **Prescriptions**: Filter by medication name
- **Visits**: Filter by diagnosis
- **Bills**: Filter by payment status

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint JavaScript/JSX files (if configured)
npm run lint
```

### Component Development

All UI components are located in `src/components/ui/` and follow a consistent pattern:
- Reusable and composable
- Accept className for styling flexibility
- Support all standard HTML attributes
- Optimized for responsive design

### Adding New Features

1. Create a new page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/Layout/Sidebar.jsx`
4. Use shared components from `src/components/ui/`
5. Follow existing API patterns for data fetching

---

## 🚀 Performance

- **Code Splitting**: Vite automatically optimizes bundle size
- **Fast Refresh**: Instant UI updates during development
- **Optimized Images**: Responsive image handling
- **Minified Production Build**: 96.95 KB gzipped
- **Lazy Loading**: Route-based code splitting

---

## 🔒 Security Considerations

- Passwords are hashed before transmission (implementation in backend)
- Role-based access control prevents unauthorized access
- API requests include error handling and validation
- CORS configuration should be set up on the backend
- Environment variables protect sensitive configuration

---

## 📝 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

## 🐛 Troubleshooting

### API Connection Issues
- Verify `VITE_CLINIC_API` environment variable is correct
- Ensure backend API is running and accessible
- Check browser console for CORS errors

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

### Dark Mode Not Working
- Check browser localStorage permissions
- Clear browser cache and reload
- Verify system dark mode preference

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use meaningful variable and function names
- Follow React best practices
- Keep components small and focused
- Add comments for complex logic
- Use Tailwind CSS for styling

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💼 Author

**Clinic Management System Team**

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Icons from [Tabler Icons](https://tabler-icons.io/)

---

## 📞 Support

For support, email support@clinic-system.com or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Email notifications for appointments
- [ ] SMS reminders for patient visits
- [ ] PDF report generation
- [ ] Advanced analytics and reporting
- [ ] Insurance integration
- [ ] Telemedicine capabilities
- [ ] Mobile native app (React Native)
- [ ] Multi-language support
- [ ] API documentation with Swagger
- [ ] Automated backups and data recovery

---

**Last Updated**: July 2024  
**Version**: 1.0.0
