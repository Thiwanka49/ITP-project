# Fitplex - Gym Management System

A comprehensive web application for managing gym equipment inventory and suppliers. Built with React, TypeScript, and modern web technologies, Fitplex provides an intuitive interface for tracking gym equipment, managing suppliers, and generating detailed analytics reports.

![License](https://img.shields.io/badge/License-ISC-blue)
![Node Version](https://img.shields.io/badge/Node-18%2B-green)
![React Version](https://img.shields.io/badge/React-18.3.1-blue)

## Features

- **Equipment Inventory Management**: Add, edit, and delete gym equipment with detailed information
- **Supplier Management**: Manage supplier information and track equipment sources
- **Real-time Analytics**: View comprehensive reports on inventory value, equipment distribution, and trends
- **Category Organization**: Organize equipment by categories (Cardio, Strength, Free Weights, Accessories)
- **Status Tracking**: Track equipment status (Available, Maintenance, Out of Stock)
- **PDF Export**: Generate detailed PDF reports of equipment inventory and supplier lists
- **Responsive Design**: Fully responsive UI that works on desktop and mobile devices
- **Dark Mode Support**: Built-in dark/light theme support
- **Currency Support**: All prices displayed in Sri Lankan Rupees (Rs)

## Project Structure

```
gym-gear-hub-main/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Application pages
│   │   ├── contexts/        # React contexts for state management
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js/Express API server
│   ├── config/              # Database and storage configuration
│   ├── models/              # Data models (Equipment, Supplier)
│   ├── routes/              # API routes
│   ├── data/                # Local JSON database
│   ├── server.js
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **UI Library**: shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS 3.4.17
- **Form Management**: React Hook Form 7.61.1
- **Data Fetching**: Axios 1.13.2, TanStack Query 5.83.0
- **Routing**: React Router 6.30.1
- **Charts**: Recharts 2.15.4
- **PDF Generation**: jsPDF 2.5.1 with AutoTable 3.5.25

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MongoDB (with JSON fallback)
- **ORM**: Mongoose 9.1.4
- **CORS**: CORS 2.8.5
- **Dev Tools**: Nodemon 3.1.11

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gym-gear-hub.git
cd gym-gear-hub-main
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

### Running Locally

**Terminal 1 - Start Backend Server**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend Development Server**
```bash
npm run dev
# Application runs on http://localhost:8080
```

### Development Commands

**Frontend**
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run build:dev  # Build with development settings
npm run lint       # Run ESLint
npm run preview    # Preview production build
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
```

**Backend**
```bash
npm start          # Start production server
npm run dev        # Start with auto-reload (nodemon)
npm run seed       # Seed database with sample data
```

## API Endpoints

### Equipment Routes
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Supplier Routes
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

## Pages & Features

### Home Page
- Dashboard with key metrics
- Equipment inventory overview
- Supplier statistics
- Quick access to recent equipment
- Total inventory value in Sri Lankan Rupees

### View All / Inventory
- Complete equipment and supplier listings
- Search and filter functionality
- Inline editing for equipment and suppliers
- Bulk actions (delete, export)
- PDF export for equipment and supplier data
- Equipment detail modal with full information

### Add Equipment/Supplier
- Comprehensive form for adding new equipment
- Supplier registration during equipment addition
- Category selection
- Real-time validation
- Success notifications

### Reports & Analytics
- Inventory value tracking
- Equipment distribution by category
- Supplier performance metrics
- Monthly trend analysis
- PDF report generation with detailed analytics
- Key performance indicators (KPIs)

## Features

### Equipment Management
- Add equipment with details (name, category, price, quantity, status)
- Edit existing equipment
- Delete equipment
- Track purchase dates
- Filter by status (Available, Maintenance, Out of Stock)
- Filter by category

### Supplier Management
- Add new suppliers with contact information
- Edit supplier details
- Delete suppliers
- Track equipment per supplier
- Contact information (email, phone, address)

### Analytics & Reporting
- Inventory value calculations
- Category-wise distribution
- Supplier-wise metrics
- Monthly purchase trends
- Maintenance requirements tracking
- PDF report generation with charts and tables

### Data Management
- Local JSON storage (when MongoDB is unavailable)
- MongoDB integration for production
- Automatic data seeding
- Data persistence

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplex
NODE_ENV=development
```

## Database

The application uses MongoDB for production but includes a JSON-based fallback storage system. Sample data is automatically seeded on first run.

### Collections
- **Equipment**: Stores gym equipment information
- **Suppliers**: Stores supplier details

## Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first approach with breakpoints

## File Structure

```
src/
├── components/
│   ├── AppSidebar.tsx      # Navigation sidebar
│   ├── Layout.tsx          # Main layout wrapper
│   ├── NavLink.tsx         # Navigation links
│   ├── StatCard.tsx        # Statistics display card
│   └── ui/                 # shadcn/ui components
├── pages/
│   ├── Home.tsx            # Dashboard
│   ├── ViewAll.tsx         # Inventory management
│   ├── AddSupplier.tsx     # Add equipment & suppliers
│   ├── Reports.tsx         # Analytics & reports
│   ├── Index.tsx           # Main router
│   └── NotFound.tsx        # 404 page
├── contexts/
│   └── EquipmentContext.tsx # Global equipment state
├── hooks/
│   ├── use-mobile.tsx      # Mobile detection hook
│   └── use-toast.ts        # Toast notification hook
└── lib/
    └── utils.ts            # Utility functions
```

## Deployment

### Frontend Deployment

**Vercel**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Backend Deployment

Deploy to services like:
- Heroku
- Railway
- Render
- AWS
- DigitalOcean

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### MongoDB Connection Issues
If MongoDB is not available, the application automatically falls back to JSON-based storage in `/backend/data/db.json`.

### Port Already in Use
- Frontend: Change port in `vite.config.ts`
- Backend: Set `PORT` environment variable

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance

- Vite for fast builds and hot module replacement
- React Query for efficient server state management
- Code splitting and lazy loading
- Optimized images and assets
- Tree-shaking for production builds

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Email notifications for low stock
- [ ] Advanced filtering and sorting
- [ ] Bulk import/export (CSV, Excel)
- [ ] Equipment maintenance schedule
- [ ] Supplier ratings and reviews
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboards

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, email support@fitplex.dev or open an issue on GitHub.

## Acknowledgments

- UI Components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Charts from [Recharts](https://recharts.org)

---

**Last Updated**: January 18, 2026
