import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Save, Plus, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export default function EditResumeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [title, setTitle] = useState('My Resume');
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: '1', title: '', company: '', duration: '', description: '' }
  ]);
  const [education, setEducation] = useState<Education[]>([
    { id: '1', degree: '', school: '', year: '' }
  ]);
  const [skills, setSkills] = useState('');

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { id: Date.now().toString(), title: '', company: '', duration: '', description: '' }
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { id: Date.now().toString(), degree: '', school: '', year: '' }
    ]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const saveResume = async () => {
    try {
      const resume = {
        id: params.id || Date.now().toString(),
        title,
        template: params.template || 'modern',
        lastModified: new Date().toISOString(),
        experiences,
        education,
        skills,
      };

      const stored = await AsyncStorage.getItem('resumes');
      const resumes = stored ? JSON.parse(stored) : [];
      
      const index = resumes.findIndex((r: any) => r.id === resume.id);
      if (index >= 0) {
        resumes[index] = resume;
      } else {
        resumes.push(resume);
      }

      await AsyncStorage.setItem('resumes', JSON.stringify(resumes));
      Alert.alert('Success', 'Resume saved successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save resume');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resume Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter resume title"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <TouchableOpacity onPress={addExperience} style={styles.addButton}>
              <Plus color="#3b82f6" size={20} />
            </TouchableOpacity>
          </View>
          
          {experiences.map((exp, index) => (
            <View key={exp.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Experience {index + 1}</Text>
                {experiences.length > 1 && (
                  <TouchableOpacity onPress={() => removeExperience(exp.id)}>
                    <X color="#ef4444" size={20} />
                  </TouchableOpacity>
                )}
              </View>
              
              <TextInput
                style={styles.input}
                value={exp.title}
                onChangeText={(text) => updateExperience(exp.id, 'title', text)}
                placeholder="Job Title"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                value={exp.company}
                onChangeText={(text) => updateExperience(exp.id, 'company', text)}
                placeholder="Company Name"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                value={exp.duration}
                onChangeText={(text) => updateExperience(exp.id, 'duration', text)}
                placeholder="Duration (e.g., Jan 2020 - Present)"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={exp.description}
                onChangeText={(text) => updateExperience(exp.id, 'description', text)}
                placeholder="Job Description"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education</Text>
            <TouchableOpacity onPress={addEducation} style={styles.addButton}>
              <Plus color="#3b82f6" size={20} />
            </TouchableOpacity>
          </View>
          
          {education.map((edu, index) => (
            <View key={edu.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Education {index + 1}</Text>
                {education.length > 1 && (
                  <TouchableOpacity onPress={() => removeEducation(edu.id)}>
                    <X color="#ef4444" size={20} />
                  </TouchableOpacity>
                )}
              </View>
              
              <TextInput
                style={styles.input}
                value={edu.degree}
                onChangeText={(text) => updateEducation(edu.id, 'degree', text)}
                placeholder="Degree"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                value={edu.school}
                onChangeText={(text) => updateEducation(edu.id, 'school', text)}
                placeholder="School/University"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                value={edu.year}
                onChangeText={(text) => updateEducation(edu.id, 'year', text)}
                placeholder="Year (e.g., 2020)"
                placeholderTextColor="#9ca3af"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={skills}
            onChangeText={setSkills}
            placeholder="Enter your skills (comma separated)"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveResume}>
          <Save color="#fff" size={20} />
          <Text style={styles.saveButtonText}>Save Resume</Text>
        </TouchableOpacity>
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
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  addButton: {
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
