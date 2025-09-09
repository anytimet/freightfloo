# FreightFloo - Freight Marketplace

A modern freight marketplace platform built with Next.js, TypeScript, and Tailwind CSS, inspired by uShip.com but with a unique design and features.

## Features

- **User Authentication**: Secure sign-up and sign-in for shippers and carriers
- **Shipment Posting**: Easy-to-use form for posting freight shipments
- **Marketplace**: Browse and filter available shipments
- **Bidding System**: Carriers can bid on shipments
- **Dashboard**: Manage shipments and bids
- **Real-time Updates**: Track shipment status and bid updates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Untitled UI components
- **Authentication**: NextAuth.js
- **Database**: Prisma with SQLite
- **Icons**: Heroicons
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd freightfloo
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

4. Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
freightfloo/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── marketplace/       # Marketplace page
│   └── shipment/          # Shipment pages
├── components/            # Reusable components
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── public/                # Static assets
```

## Key Pages

- **Landing Page** (`/`): Hero section, features, and call-to-action
- **Marketplace** (`/marketplace`): Browse available shipments
- **Post Shipment** (`/shipment/new`): Create new shipment listings
- **Dashboard** (`/dashboard`): Manage shipments and bids
- **Authentication** (`/auth/signin`, `/auth/signup`): User authentication

## Database Schema

The application uses the following main entities:

- **Users**: Shippers, carriers, or both
- **Shipments**: Freight listings with details
- **Bids**: Carrier offers on shipments
- **Reviews**: User feedback system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@freightfloo.com or create an issue in the repository.
