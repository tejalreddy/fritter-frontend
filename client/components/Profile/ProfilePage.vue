<template>
    <main>
        <header>
            <h2 class="profile-header">@{{ $store.state.username }}'s profile</h2>
            <section class="profile-follower-info">
                <h4 class="profile-text">Followers: {{ $store.state.followers.length }}</h4>
                <h4>Following: {{ $store.state.following.length }}</h4>
            </section>
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

export default {
    name: 'ProfilePage',
    components: {FreetComponent, CategoryBar, AddCategoryButton, ProfileFeed, FollowButton},
    data() {
        return {
            clickedCategory: null,
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

<style scoped>
.profile-allCategories {
    overflow-x: scroll;
    display: flex;
}

.profile-addCategoryButton {
    margin-top:2em;
    margin-bottom: 2em;
}

.profile-follower-info {
    display: flex;
    justify-content: center;
    padding:0px;
    margin:0px;
}

.profile-text {
    margin-right: 35px;
}

.profile-header {
    display: flex;
    justify-content: center;
    padding:0px;
    margin:0px;
    margin-top: 1em;
    
}

.profile-modal-followers {
    display: flex;
    flex-direction: row;
}

</style>