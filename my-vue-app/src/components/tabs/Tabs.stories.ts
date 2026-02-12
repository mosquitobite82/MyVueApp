import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Tabs from './Tabs.vue';
import TabPanel from './TabPanel.vue';
import ExampleChild from './ExampleChildComponent.vue';

const meta = {
  component: Tabs,
  title: 'Components/Tabs',
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic tabs with Vuetify's built-in horizontal slide transitions.
 * Watch how tabs smoothly slide left when moving forward and right when moving backward.
 */
export const Default: Story = {
  render: (args) => ({
    components: { Tabs, TabPanel },
    setup() {
      const tabs = [
        { title: 'Tab One', value: 'one' },
        { title: 'Tab Two', value: 'two' },
        { title: 'Tab Three', value: 'three' },
      ];
      const events = ref<string[]>([]);

      function addEvent(msg: string) {
        events.value.push(`${new Date().toLocaleTimeString()}: ${msg}`);
        if (events.value.length > 10) events.value.shift();
      }

      return { args, tabs, events, addEvent };
    },
    template: `
      <div>
        <Tabs 
          :tabs="tabs" 
          @tab-change="(val, dir) => addEvent(\`Tab change to \${val} (\${dir})\`)"
          @transition-complete="addEvent('Transition complete')"
        >
          <template #tab-one>
            <TabPanel 
              value="one"
              @activated="addEvent('Tab One activated')"
              @deactivated="addEvent('Tab One deactivated')"
              @transition-complete="addEvent('Tab One transition complete')"
            >
              <v-sheet class="pa-5" color="purple-lighten-4">
                <h3>Tab One Content</h3>
                <p>This tab receives notifications when it becomes active.</p>
              </v-sheet>
            </TabPanel>
          </template>
          
          <template #tab-two>
            <TabPanel 
              value="two"
              @activated="addEvent('Tab Two activated')"
              @deactivated="addEvent('Tab Two deactivated')"
              @transition-complete="addEvent('Tab Two transition complete')"
            >
              <v-sheet class="pa-5" color="orange-lighten-4">
                <h3>Tab Two Content</h3>
                <p>Each tab can independently listen for activation events.</p>
              </v-sheet>
            </TabPanel>
          </template>
          
          <template #tab-three>
            <TabPanel 
              value="three"
              @activated="addEvent('Tab Three activated')"
              @deactivated="addEvent('Tab Three deactivated')"
              @transition-complete="addEvent('Tab Three transition complete')"
            >
              <v-sheet class="pa-5" color="green-lighten-4">
                <h3>Tab Three Content</h3>
                <p>Transitions are tracked and children are notified.</p>
              </v-sheet>
            </TabPanel>
          </template>
        </Tabs>

        <v-card class="mt-4">
          <v-card-title>Event Log</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="(event, i) in events" :key="i">
                {{ event }}
              </v-list-item>
              <v-list-item v-if="events.length === 0">
                No events yet. Click on tabs to see events.
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </div>
    `,
  }),
  args: {},
};

/**
 * Using the composable API for tab notifications
 */
export const WithComposable: Story = {
  render: (args) => ({
    components: { Tabs, ExampleChild },
    setup() {
      const tabs = [
        { title: 'Profile', value: 'profile' },
        { title: 'Settings', value: 'settings' },
        { title: 'Activity', value: 'activity' },
      ];
      return { args, tabs };
    },
    template: `
      <Tabs :tabs="tabs">
        <template #tab-profile>
          <ExampleChild value="profile" title="Profile Tab" color="blue-lighten-4">
            <p class="mt-4">This component uses the useTabPanel composable to track its state.</p>
          </ExampleChild>
        </template>
        
        <template #tab-settings>
          <ExampleChild value="settings" title="Settings Tab" color="purple-lighten-4">
            <p class="mt-4">Each tab independently tracks activation and transition events.</p>
          </ExampleChild>
        </template>
        
        <template #tab-activity>
          <ExampleChild value="activity" title="Activity Tab" color="green-lighten-4">
            <p class="mt-4">Check the console for detailed event logs.</p>
          </ExampleChild>
        </template>
      </Tabs>
    `,
  }),
  args: {},
};

/**
 * Controlled tabs with v-model for programmatic navigation.
 * The slide direction adapts automatically based on which direction you're navigating.
 */
export const Controlled: Story = {
  render: (args) => ({
    components: { Tabs, TabPanel },
    setup() {
      const tabs = [
        { title: 'Step 1', value: 'step1' },
        { title: 'Step 2', value: 'step2' },
        { title: 'Step 3', value: 'step3' },
      ];
      const currentTab = ref('step1');

      function nextStep() {
        const index = tabs.findIndex((t) => t.value === currentTab.value);
        if (index < tabs.length - 1) {
          currentTab.value = tabs[index + 1].value;
        }
      }

      function prevStep() {
        const index = tabs.findIndex((t) => t.value === currentTab.value);
        if (index > 0) {
          currentTab.value = tabs[index - 1].value;
        }
      }

      return { args, tabs, currentTab, nextStep, prevStep };
    },
    template: `
      <div>
        <Tabs :tabs="tabs" v-model="currentTab">
          <template #tab-step1>
            <v-sheet class="pa-5">
              <h3>Step 1</h3>
              <p>Welcome to the wizard!</p>
              <v-btn @click="nextStep" color="primary">Next</v-btn>
            </v-sheet>
          </template>
          
          <template #tab-step2>
            <v-sheet class="pa-5">
              <h3>Step 2</h3>
              <p>Configure your options.</p>
              <v-btn @click="prevStep" class="mr-2">Back</v-btn>
              <v-btn @click="nextStep" color="primary">Next</v-btn>
            </v-sheet>
          </template>
          
          <template #tab-step3>
            <v-sheet class="pa-5">
              <h3>Step 3</h3>
              <p>Review and complete!</p>
              <v-btn @click="prevStep">Back</v-btn>
            </v-sheet>
          </template>
        </Tabs>
        
        <v-alert class="mt-4" type="info">
          Current tab: {{ currentTab }}
        </v-alert>
      </div>
    `,
  }),
  args: {},
};
