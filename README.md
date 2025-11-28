# NexusCRM - Modern Multi-Tenant CRM Application

A complete, modern multi-tenant CRM web application built with React, Node.js, Express, Prisma, and PostgreSQL.

## Features

### Multi-Tenant Architecture
- **Multiple Companies**: Users can belong to multiple companies with different roles
- **Role-Based Access Control**: ADMIN, STAFF, and CUSTOMER roles with granular permissions
- **Workspace Switching**: Seamlessly switch between companies and roles
- **Tenant Isolation**: Complete data isolation between companies

### User Management
- **Unified User System**: Single account across all companies
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Profile Management**: Update profile information and change password

### CRM Modules
- **Customers**: Manage customer information and track interactions
- **Leads**: Track sales pipeline with status management
- **Contacts**: Maintain contact directory
- **Tasks**: Create and manage tasks with priorities and due dates
- **Notes**: Keep track of important information
- **Activities**: Activity timeline for all CRM actions

### Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Framer Motion animations throughout
- **Beautiful Components**: Modern card-based design with gradients

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** with custom design system
- **React Router DOM** for routing
- **React Hook Form + Zod** for form validation
- **Axios** for API calls
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/modern_crm"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth & tenant middleware
│   │   ├── routes/             # API routes
│   │   ├── validators/         # Request validators
│   │   ├── utils/              # Utility functions
│   │   ├── types/              # TypeScript types
│   │   └── index.ts            # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React contexts
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── dashboard/      # Dashboard pages
│   │   │   └── crm/            # CRM module pages
│   │   ├── services/           # API services
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Companies
- `POST /api/companies` - Create company
- `GET /api/companies/my` - Get user's companies
- `GET /api/companies/search` - Search companies
- `POST /api/companies/join` - Join company as customer
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### User Company Roles
- `GET /api/user-company-roles/my-roles` - Get user's roles
- `POST /api/user-company-roles/invite` - Invite user to company
- `PUT /api/user-company-roles/:id` - Update user role
- `DELETE /api/user-company-roles/:id` - Remove user
- `DELETE /api/user-company-roles/leave/:companyId` - Leave company

### CRM Modules
Each module supports CRUD operations:
- `GET /api/{module}` - List with pagination
- `GET /api/{module}/:id` - Get single item
- `POST /api/{module}` - Create new item
- `PUT /api/{module}/:id` - Update item
- `DELETE /api/{module}/:id` - Delete item

Modules: `customers`, `leads`, `contacts`, `tasks`, `notes`, `activities`

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard stats
- `GET /api/dashboard/staff` - Staff dashboard
- `GET /api/dashboard/customer` - Customer dashboard

## User Flow

1. **Landing Page**: Introduction to NexusCRM
2. **Sign Up**: Create a new account
3. **Role Selection**: 
   - Create a new company (become ADMIN)
   - Join existing company as CUSTOMER
4. **Dashboard**: Role-based dashboard view
5. **CRM Modules**: Manage customers, leads, tasks, etc.
6. **Workspace Switching**: Switch between companies/roles

## Multi-Tenant Permission Rules

### ADMIN
- Full access to all CRM data
- Can invite/remove users
- Can manage company settings
- Can delete company

### STAFF
- Access to customers, leads, contacts
- Can create/edit/delete CRM data
- Cannot manage users or company settings

### CUSTOMER
- Limited view access
- Can see assigned tasks
- Can view activities
- Cannot modify CRM data

## License

MIT License - feel free to use this project for learning or commercial purposes.

