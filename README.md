# CinemaHub - Award-Winning Movie Discovery Platform

A stunning, modern movie discovery platform built with Next.js, TypeScript, Tailwind CSS, and powered by The Movie Database (TMDB) API. This project showcases advanced React patterns, smooth animations, and a beautiful user interface that would impress any client or recruiter.

## ✨ Features

- **🎬 Hero Section**: Dynamic featured movies with smooth transitions
- **🔍 Advanced Search**: Real-time movie search with debouncing
- **🏷️ Genre Filtering**: Filter movies by genre with beautiful UI
- **📱 Responsive Design**: Perfect on all devices
- **🌙 Dark/Light Theme**: Seamless theme switching
- **⚡ Performance**: Optimized with React Query caching
- **🎭 Movie Details**: Comprehensive movie information with cast and crew
- **🎨 Smooth Animations**: Framer Motion animations throughout
- **♿ Accessibility**: WCAG compliant design
- **🚀 Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **API**: The Movie Database (TMDB)
- **Theme**: next-themes
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn (preferred) or npm
- TMDB API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd disney-movies
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add your TMDB API key:

   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

   Get your free API key from [TMDB](https://www.themoviedb.org/settings/api)

   **Security Note**: The API key is kept server-side only for security. It's not exposed to the client.

4. **Run the development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Features

### Award-Winning UI/UX

- **Modern Glassmorphism**: Subtle glass effects and backdrop blur
- **Smooth Animations**: Carefully crafted micro-interactions
- **Typography**: Beautiful font hierarchy with Geist fonts
- **Color System**: Carefully designed color palette with dark/light themes
- **Spacing**: Consistent spacing system following design principles

### Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: Intelligent data caching with React Query
- **Bundle Size**: Optimized bundle with tree shaking

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Clear focus indicators

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and utilities
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation
│   ├── hero-section.tsx  # Hero section with featured movies
│   ├── movie-grid.tsx    # Movie grid with animations
│   └── movie-details-modal.tsx # Movie details modal
├── lib/                  # Utilities and services
│   ├── types.ts          # TypeScript type definitions
│   ├── tmdb.ts           # TMDB API service
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🎯 Key Components

### Navigation

- Responsive navigation with mobile menu
- Search functionality with real-time results
- Genre filtering with visual feedback
- Theme toggle with smooth transitions

### Hero Section

- Auto-rotating featured movies
- Smooth image transitions
- Call-to-action buttons
- Progress indicators

### Movie Grid

- Responsive grid layout
- Hover effects and animations
- Lazy loading for performance
- Infinite scroll capability

### Movie Details Modal

- Comprehensive movie information
- Cast and crew details
- Production information
- Financial data display

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🔧 Customization

### Adding New Features

- **User Authentication**: Add NextAuth.js for user accounts
- **Favorites**: Implement user favorites with local storage or database
- **Reviews**: Add user review system
- **Recommendations**: Implement ML-based recommendations

### Styling

- Modify `app/globals.css` for global styles
- Update Tailwind config for custom colors/spacing
- Customize shadcn/ui components in `components/ui/`

## 📱 Mobile Optimization

- Touch-friendly interface
- Optimized images for mobile
- Responsive typography
- Mobile-first design approach

## 🎨 Portfolio Ready

This project is designed to showcase:

- **Modern Development Practices**: TypeScript, component architecture
- **UI/UX Skills**: Beautiful, accessible design
- **Performance**: Optimized loading and smooth animations
- **Code Quality**: Clean, maintainable code structure
- **API Integration**: Professional API service implementation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue or contact me directly.

---

**Built with ❤️ for your portfolio**
