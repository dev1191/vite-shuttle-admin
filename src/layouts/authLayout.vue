<script setup lang="ts">
import { ref } from 'vue'
import { Layout, Typography } from 'ant-design-vue'
import { BulbOutlined, GlobalOutlined } from '@ant-design/icons-vue'

const { Content } = Layout

// Theme state
const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<template>
  <Layout class="h-screen flex">
    <div class="flex flex-col lg:flex-row h-full w-full">
      <!-- Left Side (70%) -->
      <!-- Left Side (only show on lg and above) -->
      <div
        class="hidden lg:flex flex-col justify-center items-center lg:w-2/2 bg-gradient-to-br from-green-400 to-emerald-600 text-white p-10 relative :dark:bg-gradient-to-br :dark:from-gray-800 :dark:to-gray-900 transition-colors duration-300"
      >
        <!-- Logo -->
        <div class="absolute top-6 left-8 flex items-center space-x-2">
          <img src="#" alt="logo" class="h-8" />
          <span class="font-semibold text-lg">Art Design Pro</span>
        </div>

        <!-- Illustration -->
        <img
          src="https://illustrations.popsy.co/green/dashboard.svg"
          alt="Login Illustration"
          class="max-w-md mt-20"
        />

        <!-- Tagline -->
        <div class="text-center mt-10 px-4">
          <Typography.Title :level="4" class="text-white">
            An Admin template focused on user experience
          </Typography.Title>
          <Typography.Paragraph class="text-white/80">
            A sleek and practical interface for a great user experience
          </Typography.Paragraph>
        </div>
      </div>

      <!-- Right Side -->
      <Content
        class="w-full lg:w-1/2 flex flex-col justify-center items-center relative px-2 sm:px-4 md:px-6 py-6 border-l border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        <!-- Top Right Actions -->
        <div
          class="absolute top-4 right-4 sm:top-4 sm:right-4 flex items-center space-x-3 sm:space-x-4"
        >
          <ThemeSwitch />
        </div>

        <!-- Auth Form Slot -->
        <div class="w-full max-w-md sm:max-w-lg md:max-w-md">
          <RouterView />
        </div>
      </Content>
    </div>
  </Layout>
</template>
