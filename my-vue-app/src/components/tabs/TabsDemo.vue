<template>
  <v-container>
    <h1 class="text-h4 mb-4">Tabs Component Demo</h1>
    
    <v-alert type="info" class="mb-6">
      <strong>Directional Slide Transitions:</strong> Watch how tabs slide left when moving forward 
      (e.g., Tab 1 → 2) and slide right when moving backward (e.g., Tab 2 → 1).
    </v-alert>
    
    <v-card class="mb-6">
      <v-card-title>Basic Tabs with Event Logging</v-card-title>
      <v-card-text>
        <Tabs 
          :tabs="basicTabs" 
          @tab-change="(val, dir) => logEvent(`Tab changed to ${val} (${dir})`)"
          @transition-complete="logEvent"
        >
          <template #tab-dashboard>
            <TabPanel
              value="dashboard"
              @activated="logEvent('Dashboard activated')"
              @deactivated="logEvent('Dashboard deactivated')"
            >
              <v-sheet class="pa-5" color="blue-lighten-5">
                <h3>Dashboard</h3>
                <p>Welcome to your dashboard. Watch the slide direction as you navigate!</p>
                <v-btn color="primary" class="mt-2">View Stats</v-btn>
              </v-sheet>
            </TabPanel>
          </template>
          
          <template #tab-users>
            <ExampleChild value="users" title="Users Panel" color="purple-lighten-5">
              <p class="mt-4">
                This panel uses the useTabPanel composable to track its state.
                Open the console to see detailed logs.
              </p>
              <v-text-field label="Search users" prepend-icon="mdi-magnify" />
            </ExampleChild>
          </template>
          
          <template #tab-settings>
            <TabPanel value="settings">
              <v-sheet class="pa-5" color="orange-lighten-5">
                <h3>Settings</h3>
                <v-switch label="Enable notifications" />
                <v-switch label="Dark mode" />
                <v-btn color="primary" class="mt-2">Save</v-btn>
              </v-sheet>
            </TabPanel>
          </template>
        </Tabs>
        
        <v-divider class="my-4" />
        
        <div>
          <h4>Event Log (Last 5 events)</h4>
          <v-chip
            v-for="(event, i) in eventLog"
            :key="i"
            class="ma-1"
            size="small"
          >
            {{ event }}
          </v-chip>
          <p v-if="eventLog.length === 0" class="text-grey">
            No events yet. Switch between tabs to see events.
          </p>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mb-6">
      <v-card-title>Controlled Tabs with Wizard</v-card-title>
      <v-card-text>
        <Tabs :tabs="wizardTabs" v-model="wizardStep">
          <template #tab-step1>
            <v-sheet class="pa-5">
              <h3>Step 1: Basic Information</h3>
              <v-text-field v-model="form.name" label="Name" class="mt-4" />
              <v-text-field v-model="form.email" label="Email" type="email" />
              <v-btn color="primary" @click="nextStep" class="mt-4">Next</v-btn>
            </v-sheet>
          </template>
          
          <template #tab-step2>
            <v-sheet class="pa-5">
              <h3>Step 2: Preferences</h3>
              <v-select
                v-model="form.role"
                :items="['Admin', 'User', 'Guest']"
                label="Role"
                class="mt-4"
              />
              <v-textarea v-model="form.bio" label="Bio" />
              <v-btn @click="prevStep" class="mt-4 mr-2">Back</v-btn>
              <v-btn color="primary" @click="nextStep" class="mt-4">Next</v-btn>
            </v-sheet>
          </template>
          
          <template #tab-step3>
            <v-sheet class="pa-5">
              <h3>Step 3: Review</h3>
              <v-list class="mt-4">
                <v-list-item>
                  <v-list-item-title>Name</v-list-item-title>
                  <v-list-item-subtitle>{{ form.name || 'Not set' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ form.email || 'Not set' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Role</v-list-item-title>
                  <v-list-item-subtitle>{{ form.role || 'Not set' }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <v-btn @click="prevStep" class="mt-4 mr-2">Back</v-btn>
              <v-btn color="success" @click="submit" class="mt-4">Submit</v-btn>
            </v-sheet>
          </template>
        </Tabs>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Dynamic Tabs</v-card-title>
      <v-card-text>
        <div class="mb-4">
          <v-btn @click="addDynamicTab" color="primary" class="mr-2">Add Tab</v-btn>
          <v-btn @click="removeDynamicTab" :disabled="dynamicTabs.length <= 1">
            Remove Last Tab
          </v-btn>
        </div>
        
        <Tabs :tabs="dynamicTabs" v-model="currentDynamicTab">
          <template v-for="tab in dynamicTabs" :key="tab.value" #[`tab-${tab.value}`]>
            <v-sheet class="pa-5">
              <h3>{{ tab.title }}</h3>
              <p>This is dynamically generated content for {{ tab.title }}.</p>
              <p class="text-caption">Tab value: {{ tab.value }}</p>
            </v-sheet>
          </template>
        </Tabs>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, TabPanel } from './index';
import ExampleChild from './ExampleChildComponent.vue';
import type { Tab } from './index';

const basicTabs: Tab[] = [
  { title: 'Dashboard', value: 'dashboard' },
  { title: 'Users', value: 'users' },
  { title: 'Settings', value: 'settings' },
];

const eventLog = ref<string[]>([]);

function logEvent(msg: string) {
  const timestamp = new Date().toLocaleTimeString();
  eventLog.value.unshift(`${timestamp}: ${msg}`);
  if (eventLog.value.length > 5) eventLog.value.pop();
}

// Wizard form
const wizardTabs: Tab[] = [
  { title: 'Basic Info', value: 'step1' },
  { title: 'Preferences', value: 'step2' },
  { title: 'Review', value: 'step3' },
];

const wizardStep = ref('step1');
const form = ref({
  name: '',
  email: '',
  role: '',
  bio: '',
});

function nextStep() {
  const index = wizardTabs.findIndex((t) => t.value === wizardStep.value);
  if (index < wizardTabs.length - 1) {
    wizardStep.value = wizardTabs[index + 1].value;
  }
}

function prevStep() {
  const index = wizardTabs.findIndex((t) => t.value === wizardStep.value);
  if (index > 0) {
    wizardStep.value = wizardTabs[index - 1].value;
  }
}

function submit() {
  alert('Form submitted! Check console for details.');
  console.log('Form data:', form.value);
}

// Dynamic tabs
const dynamicTabs = ref<Tab[]>([
  { title: 'Tab 1', value: 'dynamic-1' },
]);
const currentDynamicTab = ref('dynamic-1');
let dynamicCounter = 1;

function addDynamicTab() {
  dynamicCounter++;
  const newTab = { title: `Tab ${dynamicCounter}`, value: `dynamic-${dynamicCounter}` };
  dynamicTabs.value.push(newTab);
  currentDynamicTab.value = newTab.value;
}

function removeDynamicTab() {
  if (dynamicTabs.value.length > 1) {
    const removed = dynamicTabs.value.pop();
    if (removed && currentDynamicTab.value === removed.value) {
      currentDynamicTab.value = dynamicTabs.value[dynamicTabs.value.length - 1].value;
    }
  }
}
</script>
