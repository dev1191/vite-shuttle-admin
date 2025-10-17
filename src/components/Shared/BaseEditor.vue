<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'

interface Props {
  label: string
  name: string
  modelValue: string
  height?: string | number
  placeholder?: string
  toolbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 400,
  label: '',
  name: '',
  placeholder: 'Enter content...',
  toolbar: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<any>(null)
const html = ref(props.modelValue)

const toolbarConfig = {
  excludeKeys: ['group-more-style', 'bgColor', 'color', 'emotion', 'todo', 'video', 'fontFamily'],
}
const editorConfig = { placeholder: props.placeholder }

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

// keep sync
watch(
  () => props.modelValue,
  (val) => {
    if (val !== html.value) html.value = val
  },
)
watch(html, (val) => emit('update:modelValue', val))

onBeforeUnmount(() => {
  if (editorRef.value) editorRef.value.destroy()
})
i18nChangeLanguage('en')
</script>

<template>
  <a-form-item :label="label" :name="name">
    <div class="editor—wrapper">
      <Toolbar
        v-if="props.toolbar"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
      />
      <Editor
        v-model="html"
        :defaultConfig="editorConfig"
        mode="default"
        :style="{ height: props.height + 'px', overflowY: 'hidden' }"
        @onCreated="handleCreated"
      />
    </div>
  </a-form-item>
</template>

<style scoped>
.editor—wrapper {
  border: 1px solid #ccc;
  z-index: 1000; /* If you need */
  border-radius: 50px;
}
.w-e-bar {
  border-radius: 50px;
}

.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;

  i {
    margin-right: 5px;
  }
}

.editor-toolbar {
  border-bottom: 1px solid #ccc;
}
</style>
