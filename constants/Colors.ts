/**
 * Magical Storybook Theme Colors
 * Colors are defined for both light and dark modes with a consistent magical aesthetic
 */

// Primary magical colors
const primaryLight = '#7C3AED'; // Deep magical purple
const primaryDark = '#A855F7';  // Lighter purple for dark mode

const accentLight = '#FB923C'; // Warm sunset orange
const accentDark = '#FDBA74';  // Lighter orange for dark mode

export const Colors = {
  light: {
    text: '#2B2A40',        // Dark readable text
    background: '#FAFAFF',  // Light magical background
    tint: primaryLight,     // Deep magical purple
    icon: '#6B7280',        // Neutral icon color
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryLight,
    card: '#FFFFFF',        // Pure white for cards
    border: '#E9E5F5',      // Soft magical border
    input: '#F5F3FF',       // Light magical input background
    secondary: '#F3F0FF',   // Soft lavender
    accent: accentLight,    // Warm sunset orange
    success: '#059669',     // Gentle green
    warning: '#D97706',     // Warm amber
  },
  dark: {
    text: '#E5E5F0',        // Light readable text
    background: '#0F0F1A',  // Dark magical background
    tint: primaryDark,      // Lighter purple for dark mode
    icon: '#9BA1A6',        // Neutral icon color
    tabIconDefault: '#6B7280',
    tabIconSelected: primaryDark,
    card: '#1A1A2E',        // Dark card background
    border: '#3A3A4E',      // Dark border
    input: '#252540',       // Dark input background
    secondary: '#2A2A3E',   // Dark lavender
    accent: accentDark,     // Lighter orange for dark mode
    success: '#10B981',     // Brighter green for dark mode
    warning: '#F59E0B',     // Brighter amber for dark mode
  },
};
