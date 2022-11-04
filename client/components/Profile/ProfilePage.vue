<template>
    <main>
        <header>
            <h2>@{{ $store.state.username }}'s profile</h2>
        </header>
        <div>
            <FreetComponent
                v-for="freet in $store.getters.getUserFreets"
                :key="freet.id"
                :freet="freet"
            />
        </div>
    </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue'

export default {
    name: 'ProfilePage',
    components: {FreetComponent},
    data() {
        return {
            alerts: {}
        }
    },
}
</script>