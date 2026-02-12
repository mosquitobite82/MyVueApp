import { computed, inject, watch, onMounted, onUnmounted, type Ref } from 'vue';

export interface TabsContext {
  activeTab: Ref<string>;
  isTransitioning: Ref<boolean>;
  previousTab: Ref<string | null>;
}

export interface UseTabPanelOptions {
  value: string;
  onActivated?: () => void;
  onDeactivated?: () => void;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
}

/**
 * Composable for child components to access tab state and receive notifications
 */
export function useTabPanel(options: UseTabPanelOptions) {
  const tabsContext = inject<TabsContext>('tabsContext');

  if (!tabsContext) {
    console.warn('useTabPanel must be used within a Tabs component');
    return {
      isActive: computed(() => false),
      isTransitioning: computed(() => false),
      wasPrevious: computed(() => false),
    };
  }

  const isActive = computed(() => tabsContext.activeTab.value === options.value);
  const isTransitioning = computed(() => tabsContext.isTransitioning.value);
  const wasPrevious = computed(() => tabsContext.previousTab.value === options.value);

  // Watch for activation/deactivation
  if (options.onActivated || options.onDeactivated) {
    watch(isActive, (active, wasActive) => {
      if (active && !wasActive && options.onActivated) {
        options.onActivated();
      } else if (!active && wasActive && options.onDeactivated) {
        options.onDeactivated();
      }
    });
  }

  // Watch for transitions
  if (options.onTransitionStart || options.onTransitionComplete) {
    watch(isTransitioning, (transitioning, wasTransitioning) => {
      if (transitioning && !wasTransitioning && (isActive.value || wasPrevious.value)) {
        options.onTransitionStart?.();
      } else if (!transitioning && wasTransitioning && isActive.value) {
        options.onTransitionComplete?.();
      }
    });
  }

  onMounted(() => {
    if (isActive.value && options.onActivated) {
      options.onActivated();
    }
  });

  return {
    isActive,
    isTransitioning,
    wasPrevious,
  };
}
