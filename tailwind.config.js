/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            backgroundImage: {
                'pattern': "url('/background.png')",
            }
        },
    },
    plugins: [],
};