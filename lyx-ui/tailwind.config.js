/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [],
    theme: {
        extend: {
            colors: {
                "lyx-primary": {
                    DEFAULT: '#5680F8',
                    dark: '#222A42',
                    hover: '#2A3450'
                },
                "lyx-text": {
                    DEFAULT: '#FFFFFF',
                    dark: '#D4D4D4',
                    darker: '#6A6A6A'
                },
                "lyx-widget": {
                    DEFAULT: '#151515',
                    light: '#1E1E1E',
                    lighter: '#262626'
                },
                "lyx-background": {
                    DEFAULT: '#0A0A0A',
                    light: '#121212',
                    lighter: '#212121'
                },
                "lyx-danger": {
                    DEFAULT: '#F86956',
                    dark: '#4A2D29'
                },
                "lyx-chart": {
                    purple: {
                        DEFAULT: '#5655D7',
                        dark: '#282844'
                    },
                    green: {
                        DEFAULT: '#1D9B86',
                        dark: '#213734'
                    },
                    cyan: {
                        DEFAULT: '#4ABDE8',
                        dark: '#273D48'
                    },
                    orange: {
                        DEFAULT: '#F56524',
                        dark: '#492C22'
                    }
                }
            },
        },
    },
    plugins: [],
}