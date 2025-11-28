import type { DateRange } from 'reka-ui';
import { CalendarDate } from '@internationalized/date'
import type { Slice } from '~/shared/services/DateService';

const sharedLink = ref<string>('');
const sharedPassword = ref<string>('');
const needPassword = ref<boolean>();

const timeValue = ref<DateRange>({
    start: new CalendarDate(new Date().getFullYear(), new Date().getUTCMonth() + 1, 1),
    end: new CalendarDate(new Date().getFullYear(), new Date().getUTCMonth() + 1, new Date().getDate())
}) as Ref<DateRange>;

const sharedFrom = computed(() => {
    if (!timeValue.value.start) return '0';
    return new Date(timeValue.value.start.toString()).getTime().toString();
});

const sharedTo = computed(() => {
    if (!timeValue.value.end) return '0';
    return new Date(timeValue.value.end.toString()).getTime().toString();
});

const sharedSlice = computed<Slice>(() => {
    const dayDiff = (parseInt(sharedTo.value) - parseInt(sharedFrom.value)) / (1000 * 60 * 60 * 24);
    if (dayDiff <= 3) return 'hour';
    if (dayDiff <= 31 * 2) return 'day';
    return 'month';
});


export function useShared() {
    const route = useRoute();
    const isShared = ref<boolean>(false);
    if (route.fullPath.includes('/shared/')) isShared.value = true;
    return { needPassword, sharedPassword, timeValue, sharedLink, isShared, sharedSlice, sharedFrom, sharedTo }
}