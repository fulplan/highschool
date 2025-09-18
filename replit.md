# Shawarma Boss POS - Replit Setup

## Overview
This is a complete Point of Sale (POS) system for Shawarma Boss. It consists of:
- **Frontend**: Progressive Web App (PWA) built with vanilla JavaScript, Bootstrap, and Tailwind CSS
- **Backend**: Express.js sync server with JSON file storage for data persistence
- **Database**: JSON file-based storage (converted from SQLite for Replit compatibility)

## Recent Changes (September 18, 2025)
- Converted from GitHub import to Replit-compatible setup
- Migrated backend from SQLite to JSON file storage for better compatibility
- Set up frontend workflow on port 5000 (http-server)
- Set up backend workflow on port 8000 (Express.js)
- Both workflows are running successfully

## Project Architecture
- **Frontend served on**: port 5000 (0.0.0.0:5000)
- **Backend API on**: port 8000 (localhost:8000)
- **Data storage**: server/data.json
- **Authentication**: Admin (admin/admin123) and Staff (staff1/staff123)

## Key Features
- Offline-first PWA functionality using localStorage
- Real-time menu management
- Order processing and receipt generation
- Role-based access (Admin/Staff)
- Sales reporting and analytics
- Inventory management with stock alerts
- Optional server sync for multi-terminal setups

## Workflows
1. **Frontend**: Serves PWA on port 5000 using http-server
2. **Backend**: Runs Express.js API server on port 8000

## Dependencies
- **Backend**: express, cors, body-parser, dotenv
- **Frontend**: Served via http-server (no build process needed)

## Configuration Notes
- Backend converted from SQLite to JSON storage for Replit compatibility
- Frontend uses CDN resources (Bootstrap, Tailwind, Font Awesome, Chart.js)
- No build process required - ready to run
- Configured for both development and production deployment

## User Preferences
- Clean, minimal setup preferred
- Focus on functionality over complex tooling
- Maintain offline-first approach while adding sync capabilities

The application is production-ready and fully functional in the Replit environment.