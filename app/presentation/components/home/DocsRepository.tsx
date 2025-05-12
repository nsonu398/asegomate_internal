// app/presentation/components/home/DocsRepository.tsx
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface RepositoryTab {
  id: string;
  title: string;
  route?: string;
}

const tabs: RepositoryTab[] = [
  { id: '1', title: 'Sales', route: '/docs/sales' },
  { id: '2', title: 'Claims', route: '/docs/claims' },
  { id: '3', title: 'Marketing', route: '/docs/marketing' },
];

export const DocsRepository: React.FC = () => {
  return (
    <View style={[styles.docsRepository, { backgroundColor: '#EBF7FF', borderColor:'#0090F4', borderWidth:0.52 }]}>
      <Text style={styles.docsTitle}>Docs Repository</Text>
      <View style={styles.docsTabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.docsTab, { backgroundColor: '#FFFFFF' }]}
          >
            <Text style={styles.docsTabText}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.docsImageContainer}>
        <Image
          source={require('@/assets/images/icon-docs-repo-logo.png')}
          style={styles.docsImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  docsRepository: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  docsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  docsTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  docsTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#006FFD33',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 5.84,
    elevation: 5,
  },
  docsTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  docsImageContainer: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 100,
    height: 100,
  },
  docsImage: {
    width: '100%',
    height: '100%',
  },
});