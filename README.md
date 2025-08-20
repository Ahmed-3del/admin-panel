<div align="center">
  <strong>ABWAB-digital</strong><br />
  A modern admin dashboard template using Next.js 15, Tailwind CSS v4, App Router, TypeScript, and Shadcn UI.
</div>
<br />
<br />


<br />


The project follows a colocation-first file structure using the App Router. Feature-specific pages live alongside their components to maintain separation of concerns and reduce cross-import complexity.

```txt
src/
├── app/                      # Next.js App Router entry
│   ├── (external)/           # Public pages (e.g., marketing, feedback)
│
│   ├── (main)/               # Main application layout
│   │   ├── dashboard/
│   │   │   ├── layout.tsx    # Shared layout for dashboard routes
│   │   │   ├── default/      # Default overview dashboard
│   │   │   │   ├── components/
│   │   │   │   └── page.tsx
│   │   │   ├── ecommerce/
│   │   │   │   ├── components/
│   │   │   │   └── page.tsx
│   │   │   ├── email/
│   │   │   │   ├── components/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── components/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   ├── components/
│   │   │   │   └── page.tsx
│   ├── auth/                  # Auth section
│   │   ├── layout.tsx  
│   │   ├── login/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── components/        # Shared auth components (e.g., buttons)
│
├── components/
│   ├── ui/                    # Reusable UI primitives (button, input, etc.)
│   ├── common/                # Shared layout/global components used across multiple areas
│
├── middleware.ts              # Middleware for handling auth/redirects
├── navigation/                # Navigation config for sidebar
├── hooks/                     # Custom React hooks
├── utils/                     # Utility/helper functions
├── server/                    # Server-only functions and server actions
├── config/                    # Project-wide configuration (e.g. theme, layout)
├── constants/                 # Static values like roles, app-level enums, routes, dummy data
```


## Getting Started

To set up and run this admin dashboard locally, follow these steps:

1. **Clone the repository**
   ```bash
   ```
   
2. **Install dependencies**
   ```bash
    npm install
   ```
   > While installing, you may be prompted to use the `--force` or `--legacy-peer-deps` flag.  
   > This is expected and safe — it’s due to a dependency from the Shadcn registry that references a breaking library version.

3. **Start the development server**
   ```bash
   npm run dev
   ```

Once running, the app will be available at [http://localhost:3000](http://localhost:3000)



