import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { useStore, Product } from '@/store/useStore';

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Modern Lounge Chair',
    price: 299.99,
    description: 'Elegant mid-century modern design with premium comfort',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    name: 'Minimalist Desk Lamp',
    price: 79.99,
    description: 'Adjustable LED lamp with sleek aluminum finish',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '3',
    name: 'Ceramic Plant Pot',
    price: 34.99,
    description: 'Hand-crafted ceramic pot with drainage system',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '4',
    name: 'Vintage Record Player',
    price: 199.99,
    description: 'Classic turntable with modern features',
    image: 'https://images.unsplash.com/photo-1542820242-a6c6bcb6b3b3?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '5',
    name: 'Leather Messenger Bag',
    price: 149.99,
    description: 'Handcrafted leather bag with multiple compartments',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useStore();

  const filteredProducts = ALL_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Search Products</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => addItem(item)}
              >
                <ShoppingBag size={20} color="#fff" />
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  searchInput: {
    margin: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#FF385C',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#FF385C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

Oli, [4/8/2025 7:01 PM]
"import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react-native';
import { useStore, Product } from '@/store/useStore';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [shoeProducts, setShoeProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useStore();

 
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const shoesCollection = collection(db, 'shoedb');
        const shoesQuery = query(shoesCollection);
        const querySnapshot = await getDocs(shoesQuery);
        
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        setShoeProducts(products);
      } catch (err) {
        console.error('Error fetching shoes:', err);
        setError('Failed to load shoes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchShoes();
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery) return [];
    
    return shoeProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5); 
  }, [searchQuery, shoeProducts]);

  const handleSelectProduct = (product: Product) => {
    addItem(product);
    //router.push(/product/${product.id});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
        <Text style={styles.loadingText}>Loading shoes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            setShoeProducts([]);
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for shoes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

Oli, [4/8/2025 7:01 PM]
{searchQuery ? (
        <ScrollView style={styles.suggestionsContainer}>
          {suggestions.length > 0 ? (
            suggestions.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.suggestionItem}
                onPress={() => handleSelectProduct(product)}
              >
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.suggestionImage} 
                  
                />
                <View style={styles.suggestionText}>
                  <Text style={styles.suggestionName}>{product.name}</Text>
                  <Text style={styles.suggestionPrice}>${product.price?.toFixed(2)}</Text>
                </View>
                <ChevronRight size={20} color="#888" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <Search size={40} color="#ccc" />
              <Text style={styles.noResultsText}>No shoes found</Text>
              <Text style={styles.noResultsSubText}>Try different keywords</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.searchPrompt}>
          <Search size={40} color="#ccc" />
          <Text style={styles.promptText}>Search for your favorite shoes</Text>
          <Text style={styles.promptSubText}>Try brand names like "Nike" or types like "running shoes"</Text>
          
          {shoeProducts.length > 0 && (
            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Popular Now</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {shoeProducts.slice(0, 5).map(product => (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.popularItem}
                    onPress={() => handleSelectProduct(product)}
                  >
                    <Image 
                      source={{ uri: product.image }} 
                      style={styles.popularImage}
                    />
                    <Text style={styles.popularName}>{product.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

Oli, [4/8/2025 7:01 PM]
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  suggestionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  suggestionImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionPrice: {
    fontSize: 14,
    color: '#FF385C',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    color: '#333',
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  searchPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    color: '#333',
    textAlign: 'center',
  },
  promptSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF385C',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  popularSection: {
    marginTop: 40,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  popularItem: {
    width: 120,
    marginLeft: 20,
  },
  popularImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  popularName: {
    fontSize: 14,
    fontWeight: '500',
  },
});"
