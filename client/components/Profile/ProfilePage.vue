<template>
    <main>
        <header>
            <h2>@{{ $store.state.username }}'s profile</h2>

            <p id="show-modal" @click="showFollowerModal = true">Followers: {{ $store.state.followers.length }}</p>
            <modal :show="showFollowerModal" @close="showFollowerModal = false">
                <template #header>
                    <h3>Your followers:</h3>
                </template>
                <template #body>
                    <div 
                    v-if="$store.state.followers.length > 0"
                    v-for="follower in $store.state.followers">
                        {{ follower.followerName }}
                        <FollowButton :followedUsername="follower.followerName"></FollowButton>
                    </div>
                    <h5
                    v-if="$store.state.followers.length === 0">
                        No followers to display
                    </h5>
                </template>
            </modal>

            <p id="show-modal" @click="showFollowingModal = true">Following: {{ $store.state.following.length }}</p>
            <modal :show="showFollowingModal" @close="showFollowingModal = false">
                <template #header>
                    <h3>Who you are following:</h3>
                </template>
                <template #body>
                    <div 
                    v-if="$store.state.following.length > 0"
                    v-for="follower in $store.state.following">
                        {{ follower.followedName }}
                        <FollowButton :followedUsername="follower.followedName"></FollowButton>
                    </div>
                    <h5
                    v-if="$store.state.following.length === 0">
                        You are not following any users
                    </h5>
                </template>
            </modal>
        </header>
        <div class="profile-allCategories">
            <CategoryBar
            @filterCategory="filterCategory"
            @unfilterCategory="unfilterCategory"
            v-for="category in $store.state.categories"
            :key="category.id"
            :category="category"
            :clickedCategory="clickedCategory"
            >
            </CategoryBar>
            <AddCategoryButton class="profile-addCategoryButton">
            </AddCategoryButton>
        </div>
        <div>
            <ProfileFeed
                :clickedCategory="clickedCategory">
            </ProfileFeed>
        </div>
    </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue'
import CategoryBar from '@/components/Category/CategoryBar.vue'
import AddCategoryButton from '@/components/Category/AddCategoryButton.vue'
import ProfileFeed from '@/components/Profile/ProfileFeed.vue'
import FollowButton from '@/components/Follow/FollowButton.vue'
import Modal from '@/components/Modal/Modal.vue'

export default {
    name: 'ProfilePage',
    components: {FreetComponent, CategoryBar, AddCategoryButton, ProfileFeed, Modal, FollowButton},
    data() {
        return {
            clickedCategory: null,
            showFollowerModal: false,
            showFollowingModal: false,
            alerts: {},
        }
    },
    methods: {
        filterCategory(value) {
            this.clickedCategory = value;
        },
        unfilterCategory(value) {
            this.clickedCategory = null;
        }
    },
}
</script>

<style>
.profile-allCategories {
    overflow-x: scroll;
    display: flex;
}

.profile-addCategoryButton {
    margin-top:2em;
    margin-bottom: 2em;
}
</style>