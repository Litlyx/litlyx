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
                    DEFAULT: 'var(--current-card-color)',
                },
                bg: {
                    DEFAULT: '#151517',
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
            }
        },
    },
    plugins: [],
}