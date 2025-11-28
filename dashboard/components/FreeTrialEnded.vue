<script lang="ts" setup>
import { DialogDeleteAccount } from '#components';
import { LockIcon, LogOut, MoonIcon, SunIcon, TrashIcon } from 'lucide-vue-next';

const router = useRouter();
const { user, clear } = useUserSession();

const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

const showPlans = ref<boolean>(false);

async function logout() {
    await clear();
    router.push('/login');
}

const dialog = useDialog();

async function showDeleteAccountDialog() {
    dialog.open({
        body: DialogDeleteAccount,
        title: 'Delete account',
        async onSuccess() {
            deleteAccount();
        },
    })
}

async function deleteAccount() {
    await useCatch({
        toast: true,
        toastTitle: 'Error deleting account data',
        async action() {
            await useAuthFetchSync('/api/user/delete', { method: 'DELETE' })
        },
        async onSuccess(_, showToast) {
            showToast('Deleting scheduled', { description: 'Account deleted successfully.', position: 'top-right' })
            dialog.close();
            await clear();
            router.push('/');
        },
    })
}

const feedbackText = ref<string>('');
const feedbackOpen = ref<boolean>(false);
function sendFeedback() {
    useCatch({
        toast: true,
        toastTitle: 'Error sending feedback',
        async action() {
            await useAuthFetchSync('/api/feedback/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { text: feedbackText.value }
            });
        },
        onSuccess(_, showToast) {
            feedbackOpen.value = false;
            showToast('Feedback sent', { description: 'Feedback sent successfully', position: 'top-right' });
        },
    })
}


</script>

<template>
    <div class="w-full h-dvh flex flex-col items-center p-8 overflow-auto poppins">
        <!-- <div class="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between mb-8 ">
            <img class="h-[5dvh]" :src="isDark ? 'logo-white.svg' : 'logo-black.svg'">
            <div>
                <div class="flex gap-2">
                    <Button @click="isDark = !isDark" variant="outline" v-if="isDark">
                        <SunIcon></SunIcon>
                    </Button>
                    <Button @click="isDark = !isDark" variant="outline" v-if="!isDark">
                        <MoonIcon></MoonIcon>
                    </Button>

                    <Popover v-model:open="feedbackOpen">
                        <PopoverTrigger>
                            <Button variant="outline"> Feedback </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="flex flex-col gap-4">
                                <Label> Share everything with us. </Label>
                                <Textarea v-model="feedbackText" placeholder="Leave your feedback here"
                                    class="resize-none h-24"></Textarea>
                                <Button @click="sendFeedback()"> Send </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="secondary">
                                Manage account
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent :side-offset="10" class="w-56">
                            <DropdownMenuLabel class="truncate px-2">
                                {{ user?.email }}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="showDeleteAccountDialog()">
                                    <TrashIcon></TrashIcon>
                                    <span> Delete Account </span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="logout()">
                                    <LogOut></LogOut>
                                    <span> Log out </span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div> -->
        <Card v-if="!showPlans" class="mt-[15dvh] min-w-[60dvw]">
            <CardContent class="p-4">
                <div class="flex items-center text-center flex-col gap-4">
                    <LockIcon class="size-8"></LockIcon>
                    <PageHeader title="Dashboard Locked"
                        description="Your free trial has ended. Subscribe below to unlock your dashboard and access your stats." />

                    <div class="flex items-center gap-4">
                        <Button @click="showPlans = true"> Manage my Plan</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <div v-else class="mt-[5dvh]">
            <ManagePlans></ManagePlans>
        </div>
    </div>

</template>