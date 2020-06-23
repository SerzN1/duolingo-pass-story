export function disableCSSAnimations() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        *,
        *:after,
        *:before {
            transition-property: none !important;
            animation: none !important;
        }
    `;

    document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.appendChild(style);
    })
}
