<script lang="ts">
import { defineComponent, ref, onMounted} from 'vue';

export default defineComponent({
    setup (_, { slots }) {
        const show = ref(false);
        onMounted(() => {
            show.value = true;
        });

        return () => (show.value && slots.default ? slots.default() : (slots.placeholder?.()));
    },
});
</script>
