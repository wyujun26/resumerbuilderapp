import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Download, Share2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function PreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const stored = await AsyncStorage.getItem('resumes');
      if (stored) {
        const resumes = JSON.parse(stored);
        const found = resumes.find((r: any) => r.id === params.id);
        setResume(found);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const generatePDF = async () => {
    if (!resume) return;

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #3b82f6; margin-bottom: 10px; }
            h2 { color: #374151; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            .section { margin-bottom: 20px; }
            .item { margin-bottom: 15px; }
            .title { font-weight: bold; color: #111827; }
            .subtitle { color: #6b7280; font-style: italic; }
            .description { margin-top: 5px; color: #374151; }
          </style>
        </head>
        <body>
          <h1>${resume.title}</h1>
          
          <h2>Work Experience</h2>
          ${resume.experiences.map((exp: any) => `
            <div class="item">
              <div class="title">${exp.title}</div>
              <div class="subtitle">${exp.company} | ${exp.duration}</div>
              <div class="description">${exp.description}</div>
            </div>
          `).join('')}
          
          <h2>Education</h2>
          ${resume.education.map((edu: any) => `
            <div class="item">
              <div class="title">${edu.degree}</div>
              <div class="subtitle">${edu.school} | ${edu.year}</div>
            </div>
          `).join('')}
          
          <h2>Skills</h2>
          <div class="description">${resume.skills}</div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  if (!resume) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{resume.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {resume.experiences.map((exp: any) => (
            <View key={exp.id} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.title}</Text>
              <Text style={styles.itemSubtitle}>{exp.company} | {exp.duration}</Text>
              <Text style={styles.itemDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resume.education.map((edu: any) => (
            <View key={edu.id} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemSubtitle}>{edu.school} | {edu.year}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.itemDescription}>{resume.skills}</Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={generatePDF}>
          <Download color="#fff" size={20} />
          <Text style={styles.actionButtonText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    backgroundColor: '#3b82f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 16,
  },
  item: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actions: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
