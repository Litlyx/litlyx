
const drawerVisible = ref<boolean>(false);
const drawerComponent = ref<Component>();

const drawerClasses = ref<string>('')

type ComponentType = "DOCS" | "PRICING";

async function loadComponent(component: ComponentType): Promise<Component> {
    switch (component) {
        case "DOCS":
            const DrawerDocs = await import("../components/drawer/Docs.vue");
            return DrawerDocs.default;
        case "PRICING":
            const DrawerPricing = await import("../components/drawer/Pricing.vue");
            return DrawerPricing.default;
        default:
            throw new Error("Unknown component type");
    }
}

async function showDrawer(component: ComponentType, classes: string = "") {
    drawerComponent.value = await loadComponent(component);
    drawerVisible.value = true;
    drawerClasses.value = classes;
}

function hideDrawer() {
    drawerVisible.value = false;
}

export function useDrawer() {
    return { drawerClasses, drawerVisible, drawerComponent, showDrawer, hideDrawer };
}