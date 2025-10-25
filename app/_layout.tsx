import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="edit-resume" 
          options={{ 
            title: 'Edit Resume',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="preview" 
          options={{ 
            title: 'Preview Resume',
            presentation: 'modal'
          }} 
        />
      </Stack>
    </>
  );
}
