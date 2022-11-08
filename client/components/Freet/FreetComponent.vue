<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <section class="freet-user-info">
        <h3 class="author">
          @{{ freet.author }}
        </h3>
        <FollowButton class="follow-button"
        v-if="$store.state.username"
        :followedUsername="freet.author"></FollowButton>
      </section>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button class="button-6"
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button class="button-6"
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button class="button-6"
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button class="button-6"
          @click="deleteFreet">
          🗑️ Delete
        </button>
        <AddToCategoryButton class="freet-category-button"
          :freet="freet">
        </AddToCategoryButton>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <div class="freet-like-info">
      <LikeComponent
        v-if="$store.state.username !== null && !editing"
        :freet="freet">
      </LikeComponent>
      <p class="freet-like-text"
        v-if="freet.numLikes !== 1">
        {{ freet.numLikes }} likes
      </p>
      <p class="freet-like-text"
        v-if="freet.numLikes === 1">
        {{ freet.numLikes }} like
      </p>
    </div>
      <p class="freet-categories"
        v-if="freet.categories.length > 0 && $store.state.username !== freet.author">
        Categories: {{freet.categories.map(category => category.name).join(', ')}}
      </p>
      <p class="freet-categories"
        v-if="freet.categories.length === 0 && $store.state.username !== freet.author">
        Categories: No categories selected
      </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import LikeComponent from '@/components/Like/LikeComponent.vue';
import AddToCategoryButton from '@/components/Category/AddToCategoryButton.vue';
import FollowButton from '@/components/Follow/FollowButton.vue';

export default {
  name: 'FreetComponent',
  components: {LikeComponent, AddToCategoryButton, FollowButton},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    border-radius: .30rem;
    background-color: rgba(116, 165, 127, .1);
    fill-opacity: 10;
    padding: 20px;
    position: relative;
    margin:10px;
}

.freet-user-info {
  display: flex;
  flex-direction: row;
}

.follow-button {
  margin-top: .7em;
  margin-left: .4em;
}

.freet-category-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.freet-categories {
  position: absolute;
  top: 0px;
  right: 10px;
  font-size: 16px;
}

.content {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: .25rem;
  padding: 15px;
}

.info {
  position: absolute;
  bottom: 0px;
  right: 10px;
  font-size: 16px;
}

.freet-like-info {
  display: flex;
}

.freet-like-text {
  margin-left: .8em;
  margin-top: .7em;
}

</style>