
export function useSelectMenuStyle() {
    return {
        uiMenu: {
            select: 'bg-lyx-lightmode-widget-light !ring-lyx-lightmode-widget dark:!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter dark:!ring-lyx-widget-lighter',
            base: '!bg-lyx-lightmode-widget dark:!bg-lyx-widget',
            option: {
                base: 'hover:!bg-lyx-lightmode-widget-light dark:hover:!bg-lyx-widget-lighter cursor-pointer',
                active: '!bg-lyx-lightmode-widget-light dark:!bg-lyx-widget-lighter'
            }
        }
    }
}