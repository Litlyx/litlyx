


export function useBarCardDialog() {
    const showDialog = useState('show-bar-card-dialog', () => false);
    const dialogBarData = useState<any[]>('bar-card-dialog-data', () => []);
    const isDataLoading = useState('bar-card-dialog-data-loading', () => false);
    function closeDialog() {
        showDialog.value = false;
    }
    return { showDialog, dialogBarData, closeDialog, isDataLoading };
}