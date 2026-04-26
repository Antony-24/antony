# Antony Francis Portfolio

A premium, single-page personal portfolio built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

## Features
- **Dark Theme**: Sleek, modern aesthetic with glassmorphism effects.
- **Hero Section**: Includes a professional headshot and animated typography.
- **Projects Section**: Interactive project cards with an auto-scrolling thumbnail effect on hover.
- **About & Skills**: Detailed experience timeline and interactive skills grid.
- **Contact Form**: Comprehensive form for client enquiries (configured for `555jinson@gmail.com`).
- **Responsive Design**: Fully optimized for all device sizes.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Image Replacement
The current images are high-quality AI-generated placeholders. You can replace them in the `public/images/` directory:
- `professional_headshot_developer.png`: Your profile photo.
- `tourismooze_1.png`, `tourismooze_2.png`: Project screenshots.
- `psychiatrist.png`, `dashboard.png`: Additional project work.

## Email Integration
The contact form is set up to log submissions. To receive emails, you can integrate a service like [Formspree](https://formspree.io/) or [Resend](https://resend.com/) in the `src/components/Contact.tsx` file.
