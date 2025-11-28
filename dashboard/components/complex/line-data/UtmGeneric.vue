<script setup lang="ts">
import LineDataTemplate, { type LineDataProps } from './LineDataTemplate.vue';
import type { UtmKey } from './selectors/SelectRefer.vue';


const props = defineProps<{
  advanced_data: {
    raw_selected: string
  },
  refreshToken: number,
  sharedLink?: string
}>();

const emits = defineEmits<{
  (event: 'init', data: any): void
}>()

const { data: utms, status: utms_status, refresh } = useAuthFetch<{ _id: string, count: number }[]>(() => `/api/data/utm?utm_type=${props.advanced_data.raw_selected.split('_')[1]}`,
  {
    headers: { 'x-limit': '10' },
    lazy: true
  }
);

watch(() => props.refreshToken, async () => {
  loading.value = true;
  await refresh();        // rifà il fetch
  loading.value = false;
});

const showMoreDataItems = ref<{ _id: string, count: number }[]>([]);
const loading = ref<boolean>(true);


const utmDataMap: Record<UtmKey, LineDataProps> = {
  'utm_term': {
    loading: false,
    title: 'UTM Term',
    sub: 'Term breakdown by usage',
    data: utms.value ?? [],
    showMoreData: {
      items: showMoreDataItems.value,
      loading: loading.value
    }
  },
  'utm_campaign': {
    loading: false,
    title: 'UTM Campaign',
    sub: 'Campaign breakdown by usage',
    data: utms.value ?? [],
    showMoreData: {
      items: showMoreDataItems.value,
      loading: loading.value
    }
  },
  'utm_medium': {
    loading: false,
    title: 'UTM Medium',
    sub: 'Medium breakdown by usage',
    data: utms.value ?? [],
    showMoreData: {
      items: showMoreDataItems.value,
      loading: loading.value
    }
  },
  'utm_source': {
    loading: false,
    title: 'UTM Source',
    sub: 'Source breakdown by usage',
    data: utms.value ?? [],
    showMoreData: {
      items: showMoreDataItems.value,
      loading: loading.value
    }
  },
  'utm_content': {
    loading: false,
    title: 'UTM Content',
    sub: 'Content breakdown by usage',
    data: utms.value ?? [],
    showMoreData: {
      items: showMoreDataItems.value,
      loading: loading.value
    }
  }
}


function buildLineDataProps(): LineDataProps {
  const target = utmDataMap[props.advanced_data.raw_selected as UtmKey];
  if (target) return {
    ...target,
    loading: utms_status.value !== 'success',
    data: utms.value ?? [],
    showMoreData: {
      items: showMoreDataItems.value,
      loading: loading.value
    }
  }
  return {
    loading: utms_status.value !== 'success',
    title: props.advanced_data.raw_selected,
    sub: 'Custom utm parameter',
    data: utms.value ?? [],
    showMoreData: {
      items: showMoreDataItems.value,
      loading: loading.value
    }
  }

}

const data = ref<LineDataProps>(buildLineDataProps());

function updateData() {
  data.value = buildLineDataProps();
  emits('init', data.value);
}

onMounted(() => {
  updateData()
})

watch(props, () => {
  updateData()
});

watch(utms_status, () => {
  updateData()
})

async function showMore() {
  loading.value = true;
  const raw = await useAuthFetchSync<{ _id: string; count: number }[]>(`/api/data/utm?utm_type=${props.advanced_data.raw_selected.split('_')[1]}`, {
    headers: { 'x-limit': '1000' }
  });
  showMoreDataItems.value = raw;
  loading.value = false;
  updateData();
}

</script>

<template>
  <LineDataTemplate @show-more="showMore()" :data="data" />
</template>
