# DojoConnect Backoffice Frontend

A Next.js-based backoffice management application for DojoConnect.

## Features

- **User Management** - Manage admins, instructors, parents, and students
- **Class Management** - Create, edit, and organize martial arts classes
- **Search & Filtering** - Real-time search with debouncing for optimal performance
- **Profile Management** - Detailed user profiles with image support
- **Dashboard** - Analytics and metrics overview
- **Feedback System** - Collect and manage user feedback
- **Revenue Tracking** - Monitor payments and revenue

## Tech Stack

- **Framework:** Next.js 15.3.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom React components + lucide-react icons
- **HTTP Client:** Axios with interceptors
- **State Management:** React Hooks

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=https://apis.dojoconnect.app/api
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── dashboard/      # Dashboard routes
├── components/         # Reusable React components
│   ├── auth/          # Authentication components
│   ├── Dashboard/     # Dashboard components
│   ├── classes/       # Class management
│   ├── users/         # User management
│   ├── feedback/      # Feedback components
│   ├── revenue/       # Revenue tracking
│   └── ui/            # UI primitives
├── lib/               # Utility functions
│   ├── utils.ts       # Common utilities
│   ├── useDebounce.ts # Debounce hook
│   └── tokenStorage.ts # Token management
└── services/          # API services
    ├── http.ts        # HTTP client configuration
    ├── auth.service.ts
    ├── users.service.ts
    ├── classes.service.ts
    └── ...

public/               # Static assets
```

## Search & Filtering

The application includes optimized search functionality:

- **Debounced Search:** 300ms delay reduces API calls while typing
- **Client-side Filtering:** Fast filtering for already-loaded data
- **Server-side Search:** Optional backend search integration

### Usage Example

```typescript
import { useDebounce } from '@/lib/useDebounce';

const [searchQuery, setSearchQuery] = useState('');
const debouncedSearch = useDebounce(searchQuery, 300);

// Use debouncedSearch in API calls
```

## Key Components

### ProfileHeader
Displays user profile information with image fallback support.

### SearchFilterExport
Search bar with filter and export options in table headers.

### ClassesPage
List of classes with pagination and search functionality.

### UsersPage
User management with filtering by role and date range.

## Recent Improvements

✅ **Search Functionality** - Classes and feedback pages now have working search
✅ **Performance Optimization** - Reduced initial load with pagination
✅ **Image Display** - Profile images with fallback to default avatar
✅ **Type Safety** - Full TypeScript support throughout
✅ **Debouncing** - Efficient search with 300ms debounce

## API Integration

The app connects to a backend API at `https://apis.dojoconnect.app/api`. Services handle:

- User authentication and profiles
- Class management
- Feedback collection
- User statistics
- Revenue data

## Authentication

JWT-based authentication with token stored in localStorage. Tokens are automatically injected in all API requests.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues or questions, please contact the development team.

---

**Last Updated:** May 29, 2026
