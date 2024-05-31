

export function getDeviceFromScreenSize(width: number, height: number) {
    const totalArea = width * height;

    const mobileArea = 375 * 667;
    const tabletMinArea = 768 * 1366
    const tabletMaxArea = 1024 * 1366

    const isMobile = totalArea <= mobileArea;
    const isTablet = totalArea >= tabletMinArea && totalArea <= tabletMaxArea;

    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet'
    return 'desktop';
}
