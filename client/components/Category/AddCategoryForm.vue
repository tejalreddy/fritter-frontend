<!-- Form for creating categories (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddCategoryForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/categories',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'name', label: 'Category Name', value: ''}
      ],
      title: 'Create a new category',
      refreshCategories: true,
      callback: () => {
        const message = 'Successfully created a category!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
