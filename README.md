# NexusCRM - Modern Multi-Tenant CRM Application

A complete, modern multi-tenant CRM web application built with React, Node.js, Express, Prisma, and PostgreSQL, featuring real-time WebRTC voice calling.

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
- **Customers**: View users who joined as customers (Admin only)
- **Leads**: Track sales pipeline with status management
- **Contacts**: Maintain contact directory
- **Issues**: Customer support system with call logging
- **Tasks**: Create and manage tasks with priorities and due dates
- **Notes**: Keep track of important information
- **Activities**: Activity timeline for all CRM actions

### Issue Management System
- **Customers create issues**: Only customers can submit support issues
- **Admins resolve issues**: Admins can view, update status, and resolve issues
- **Call system**: Admins can log calls for each issue with duration, status, and notes
- **Call history**: View all calls made for each issue

### 🔊 WebRTC Voice Calling (NEW!)
- **Browser-based calling**: No phone or third-party apps needed
- **Customer-to-Admin calls**: Customers can call support directly from their dashboard
- **Real-time notifications**: Admins receive incoming call popups with accept/reject
- **Call flow**: Request → Ringing → Accept → Connect → End
- **Call status indicators**: Shows online agents and connection status
- **Free & peer-to-peer**: Uses WebRTC + Socket.io (no paid APIs like Twilio)

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
- **Socket.io Client** for real-time communication
- **WebRTC** for peer-to-peer audio

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcrypt** for password hashing
- **Express Validator** for input validation
- **Socket.io** for WebSocket signaling

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Modern browser with WebRTC support (Chrome, Firefox, Edge, Safari)

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
│   │   ├── socket/             # Socket.io signaling server
│   │   │   └── index.ts        # WebRTC signaling logic
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
│   │   │   └── calling/        # Voice calling components
│   │   │       ├── ActiveCallUI.jsx
│   │   │       ├── CallSupportButton.jsx
│   │   │       └── IncomingCallModal.jsx
│   │   ├── context/            # React contexts
│   │   │   └── CallContext.jsx # Call state management
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useWebRTC.js    # WebRTC hook
│   │   ├── lib/                # Utility libraries
│   │   │   ├── socket.js       # Socket.io client
│   │   │   └── webrtc.js       # WebRTC utilities
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

## Voice Calling System

### Architecture

```
┌─────────────┐     Socket.io      ┌─────────────┐
│   Customer  │◄──────────────────►│   Server    │
│   Browser   │                    │  (Node.js)  │
└──────┬──────┘                    └──────┬──────┘
       │                                   │
       │         WebRTC P2P               │
       │◄─────────────────────────────────┤
       │                                   │
       ▼                                   ▼
┌─────────────┐     Socket.io      ┌─────────────┐
│    Admin    │◄──────────────────►│   Server    │
│   Browser   │                    │  (Node.js)  │
└─────────────┘                    └─────────────┘
```

### Call Flow

1. **Customer initiates call**: Click "Call Support" button
2. **Signaling**: Socket.io notifies all online admins in the company
3. **Admin accepts**: Admin clicks "Accept" on incoming call modal
4. **WebRTC negotiation**: 
   - Admin creates offer → sends via Socket.io
   - Customer receives offer → creates answer
   - ICE candidates exchanged
5. **P2P connection**: Direct audio stream between browsers
6. **Call ends**: Either party can end the call

### Components

| Component | Description |
|-----------|-------------|
| `CallSupportButton` | Customer dashboard button to initiate calls |
| `IncomingCallModal` | Admin popup showing incoming call with accept/reject |
| `ActiveCallUI` | Bottom bar during active call with mute/end controls |
| `CallContext` | Global state management for calls |
| `useWebRTC` | Hook for WebRTC peer connection management |

### Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `register` | Client → Server | Register user with socket |
| `call-request` | Client → Server | Customer requests call |
| `incoming-call` | Server → Admin | Notify admin of incoming call |
| `call-accept` | Admin → Server | Admin accepts call |
| `call-connected` | Server → Both | Call established |
| `webrtc-offer` | Peer → Peer | SDP offer |
| `webrtc-answer` | Peer → Peer | SDP answer |
| `webrtc-ice-candidate` | Peer → Peer | ICE candidate exchange |
| `call-end` | Either → Server | End active call |

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
6. **Voice Support**: Customers can call support, admins receive calls
7. **Workspace Switching**: Switch between companies/roles

## Multi-Tenant Permission Rules

### ADMIN
- Full access to all CRM data
- Can invite/remove users
- Can manage company settings
- Can delete company
- **Receives incoming support calls**

### STAFF
- Access to customers, leads, contacts
- Can create/edit/delete CRM data
- Cannot manage users or company settings

### CUSTOMER
- Limited view access
- Can see assigned tasks
- Can view activities
- Cannot modify CRM data
- **Can initiate support calls**

## Browser Requirements

For WebRTC voice calling to work, users need:
- **Chrome 74+**, **Firefox 66+**, **Safari 12.1+**, or **Edge 79+**
- Microphone access permission
- HTTPS (required for production, localhost works for development)

## Troubleshooting

### Voice calling not working?

1. **Check microphone permissions**: Browser must have microphone access
2. **Check console for errors**: Look for WebRTC or Socket.io errors
3. **Verify both users are connected**: Check "Call Center Active" status
4. **Try different browsers**: Some older browsers don't support WebRTC
5. **Check firewall**: P2P connections may be blocked by corporate firewalls

### Common Issues

| Issue | Solution |
|-------|----------|
| No audio | Check microphone permissions in browser settings |
| Call not connecting | Ensure both parties have stable internet |
| Admin not receiving calls | Verify admin is logged in and socket is connected |
| "No agents available" | No admin is currently online for that company |

## License

MIT License - feel free to use this project for learning or commercial purposes.
