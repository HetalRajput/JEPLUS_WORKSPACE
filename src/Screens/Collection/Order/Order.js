import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';

const OrderScreen = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [items, setItems] = useState([]); // State for item list

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle adding a new item
  const handleAddItem = () => {
    const newItem = {
      id: Math.random().toString(), // Generate a unique ID for the item
      name: `Item ${items.length + 1}`, // Example item name
    };
    setItems([...items, newItem]); // Add the new item to the list
  };

  return (
    <View style={styles.container}>
      {/* Search Input Field */}
      <Searchbar
        placeholder="Search items..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Item List */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        // Show a message when no items are added
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items added yet.</Text>
        </View>
      )}

      {/* Add Item Button */}
      <FAB
        style={[
          styles.fab,
          items.length === 0 ? styles.fabCenter : styles.fabBottomRight,
        ]}
        icon="plus"
        onPress={handleAddItem}
        color="#FFFFFF" // Custom color for the icon (white)
        customSize={56} // Optional: Custom size for the FAB
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 80, // Add padding to avoid overlap with the FAB
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#FF6F61', // Custom background color for the FAB (coral)
  },
  fabCenter: {
    alignSelf: 'center',
    bottom: '50%', // Center the FAB vertically
  },
  fabBottomRight: {
    right: 16,
    bottom: 16, // Move the FAB to the bottom-right corner
  },
});

export default OrderScreen;