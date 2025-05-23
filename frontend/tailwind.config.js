/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'ui-sans-serif', 'system-ui'],
            }
        },
    },
    plugins: [
        function ({ addVariant, e }) {
            addVariant('darkblue', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.darkblue .${e(`darkblue${separator}${className}`)}`;
                });
            });
        },
    ],
}

