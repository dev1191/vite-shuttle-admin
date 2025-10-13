<script setup lang="ts">
import { ref, reactive } from 'vue'

const newGeneral = reactive({
  general: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
})

const countries = [{ value: 'India', text: 'India' }]
const currenices = [{ value: '$', text: '$' }]
const languages = [{ value: 'en', text: 'English' }]
const timezones = [{ tzCode: 'Asia/Kathmandu', text: 'Asia/Kathmandu' }]
const dateFormat = [{ value: 'MMM D, YYYY', text: 'MMM D, YYYY' }]
const timeFormat = [{ value: 'hh:mm A', text: 'hh:mm A' }]

const isLoading = ref(false)

const onSave = () => {
  console.log('Form submitted', newGeneral.general)
}
</script>

<template>
  <a-form ref="addGeneralForm" :model="newGeneral.general" layout="vertical" @finish="onSave">
    <!-- First Row: Name, Email, Phone -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Name is required' }]"
        >
          <a-input v-model:value="newGeneral.general.name" placeholder="Name" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Email address"
          name="email"
          :rules="[{ required: true, message: 'Email is required' }]"
        >
          <a-input v-model:value="newGeneral.general.email" placeholder="Email address" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Phone"
          name="phone"
          :rules="[{ required: true, message: 'Phone is required' }]"
        >
          <a-input v-model:value="newGeneral.general.phone" placeholder="Phone" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Address" name="address">
          <a-input.TextArea
            v-model:value="newGeneral.general.address"
            rows="3"
            placeholder="Address"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-divider />

    <!-- Google Key and API Base URL -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Google Key"
          name="google_key"
          :rules="[{ required: true, message: 'Google Key is required' }]"
        >
          <a-input v-model:value="newGeneral.general.google_key" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="API Base URL"
          name="api_base_url"
          :rules="[{ required: true, message: 'API URL is required' }]"
        >
          <a-input v-model:value="newGeneral.general.api_base_url" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-divider />

    <!-- Selects: Country, Currency, Language -->
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item label="Default Country">
          <a-select
            v-model:value="newGeneral.general.default_country"
            show-search
            allow-clear
            placeholder="Select country"
          >
            <a-select-option v-for="c in countries" :key="c.value" :value="c.value">{{
              c.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item label="Default Currency">
          <a-select
            v-model:value="newGeneral.general.default_currency"
            show-search
            allow-clear
            placeholder="Select currency"
          >
            <a-select-option v-for="c in currenices" :key="c.value" :value="c.value">{{
              c.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item label="Default Language">
          <a-select
            v-model:value="newGeneral.general.default_language"
            show-search
            allow-clear
            placeholder="Select language"
          >
            <a-select-option v-for="l in languages" :key="l.value" :value="l.value">{{
              l.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Timezone, Date Format, Time Format -->
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item label="Timezone">
          <a-select
            v-model:value="newGeneral.general.timezone"
            show-search
            allow-clear
            placeholder="Select timezone"
          >
            <a-select-option v-for="t in timezones" :key="t.tzCode" :value="t.tzCode">{{
              t.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Date Format">
          <a-select v-model:value="newGeneral.general.date_format" placeholder="Date format">
            <a-select-option v-for="d in dateFormat" :key="d.value" :value="d.value">{{
              d.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="Time Format">
          <a-select v-model:value="newGeneral.general.time_format" placeholder="Time format">
            <a-select-option v-for="t in timeFormat" :key="t.value" :value="t.value">{{
              t.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Tax and Fee -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Tax (%)"
          name="tax"
          :rules="[{ required: true, message: 'Tax is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.general.tax"
            min="0"
            max="100"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Fee (%)"
          name="fee"
          :rules="[{ required: true, message: 'Fee is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.general.fee"
            min="0"
            max="100"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Background & Driver intervals -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Background Location Update Interval (ms)"
          name="background_location_update_interval"
          :rules="[{ required: true, message: 'This field is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.general.background_location_update_interval"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Driver Online Location Update Interval (ms)"
          name="driver_online_location_update_interval"
          :rules="[{ required: true, message: 'This field is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.general.driver_online_location_update_interval"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Max Distance & Prebooking Time -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="Radius Range for Stops (Meters)" name="max_distance">
          <a-input-number v-model:value="newGeneral.general.max_distance" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Last Advance Booking Time (Minutes)" name="prebooking_time">
          <a-input-number v-model:value="newGeneral.general.prebooking_time" style="width: 100%" />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Submit -->
    <a-form-item style="text-align: right; margin-top: 16px">
      <a-button type="primary" :loading="isLoading" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
