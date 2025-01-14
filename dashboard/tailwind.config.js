/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [],
    theme: {
        extend: {
            screens: {
                "m-cards-wrap": '1830px'
            },
            fontSize: {

            },
            colors: {
                card: {
                    DEFAULT: 'var(--card-color)',
                },
                bg: {
                    DEFAULT: 'var(--bg-color)',
                },
                menu: {
                    DEFAULT: '#1d1d1f'
                },
                text: {
                    DEFAULT: '#FFFFFF',
                    sub: '#909aa1',
                    dirty: '#dadde0'
                },
                accent: {
                    DEFAULT: '#5680F8',
                    light: '#2c91ed',
                    sub: '#99A7F1',
                },
                "lyx-primary": {
                    DEFAULT: '#5680F8',
                    dark: '#222A42',
                    hover: '#2A3450'
                },
                "lyx-lightmode-text": {
                    DEFAULT: '#0A0A0A',
                    dark: '#121212',
                    darker: '#212121',
                },
                "lyx-text": {
                    DEFAULT: '#FFFFFF',
                    dark: '#D4D4D4',
                    darker: '#6A6A6A',
                },
                "lyx-lightmode-widget": {
                    DEFAULT: '#D9D9E0',
                    light: '#EEEDEF',
                    lighter: '#FF0000'
                },
                "lyx-widget": {
                    DEFAULT: '#0E0E0E',
                    light: '#1E1E1E',
                    lighter: '#262626'
                },
                "lyx-lightmode-background": {
                    DEFAULT: '#F2F2F2',
                    light: '#D4D4D4',
                    lighter: '#6A6A6A'
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
            }
        },
    },
    plugins: [],
}