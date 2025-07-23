/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6a1b9a',
                secondary: '#ab47bc',
                accent: '#f48fb1',
                light: '#f3e5f5',
                dark: '#4a0072',
            },
            fontFamily: {
                'tajawal': ['Tajawal', 'sans-serif']
            },
            backgroundImage: {
                'hero-pattern': "url('https://images.unsplash.com/photo-1580502304784-8985b7eb7260?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            }
        },
    },
    plugins: [],
}
