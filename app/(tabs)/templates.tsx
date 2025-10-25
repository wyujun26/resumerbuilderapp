import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText } from 'lucide-react-native';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and creative roles',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    description: 'Traditional format ideal for corporate and executive positions',
    preview: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold and artistic layout for designers and creative professionals',
    preview: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and elegant design that highlights your content',
    preview: 'https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'academic',
    name: 'Academic CV',
    description: 'Comprehensive format for academic and research positions',
    preview: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'technical',
    name: 'Technical Skills',
    description: 'Optimized for showcasing technical expertise and projects',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function TemplatesScreen() {
  const router = useRouter();

  const selectTemplate = (templateId: string) => {
    router.push(`/edit-resume?template=${templateId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Resume Templates</Text>
          <Text style={styles.subtitle}>Choose a template that matches your style</Text>
        </View>

        <View style={styles.templateGrid}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => selectTemplate(template.id)}
            >
              <Image
                source={{ uri: template.preview }}
                style={styles.templateImage}
                resizeMode="cover"
              />
              <View style={styles.templateOverlay}>
                <FileText color="#fff" size={32} />
              </View>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>{template.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  templateGrid: {
    padding: 20,
  },
  templateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateImage: {
    width: '100%',
    height: 200,
  },
  templateOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 200,
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: {
    padding: 16,
  },
  templateName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
