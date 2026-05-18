import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, User, ChevronRight, ChevronDown, Building, Building2 } from "@/lib/icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get('window');

function TenantItem({ name, room, rent, status, isLast, onPress }: { name: string; room: string; rent: string; status: string; isLast?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className={`flex-row items-center py-4 px-4 ${!isLast ? 'border-b border-zinc-50' : ''}`}>
      <View className="h-12 w-12 bg-surface-bg rounded-full items-center justify-center mr-4 border border-zinc-200">
        <User size={20} color="#1C1C1C" strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Text className="text-text-primary text-base font-bold">{name}</Text>
        <Text className="text-text-secondary text-xs font-medium mt-0.5">{room} • ₹{rent}/mo</Text>
      </View>
      <View className="items-center flex-row">
        <View className={`px-2 py-0.5 rounded-md mr-3 ${status === 'Paid' ? 'bg-[#CCFF00]' : 'bg-zinc-100'}`}>
           <Text className={`text-[10px] font-black uppercase tracking-widest ${status === 'Paid' ? 'text-black' : 'text-zinc-500'}`}>{status}</Text>
        </View>
        <ChevronRight size={18} color="#A1A1AA" strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}

export default function TenantsScreen({ navigation }: any) {
  const { profile, properties, selectedProperty, refreshProperties } = useAuth();
  const insets = useSafeAreaInsets();
  
  const PAGE_SIZE = 6;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState<any[]>([]);
  const [totalTenants, setTotalTenants] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (selectedProperty?.id) {
        fetchTenants(selectedProperty.id, 0, false, search);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedProperty?.id, search]);

  const fetchTenants = async (pgId: string, pageNum: number = 0, isInitial: boolean = false, searchQuery: string = search) => {
    if (!pgId) return;
    try {
      if (pageNum === 0 && !refreshing) setLoading(true);
      if (pageNum > 0) setLoadingMore(true);

      let query = supabase
        .from("tenants")
        .select("*")
        .eq("pg_id", pgId)
        .order("name", { ascending: true });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,room_number.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }
      
      const newTenants = data || [];
      
      if (pageNum === 0) {
        setTenants(newTenants);
        setTotalTenants(newTenants.length);
      } else {
        setTenants(prev => [...prev, ...newTenants]);
      }
      
      // Disable pagination temporarily for debugging
      setHasMore(false);
      setPage(pageNum);
    } catch (err: any) {
      console.error("Error fetching tenants:", err.message || err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProperties();
    if (selectedProperty) {
      await fetchTenants(selectedProperty.id, 0, true);
    } else {
      setRefreshing(false);
    }
  }, [selectedProperty]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore && selectedProperty) {
      fetchTenants(selectedProperty.id, page + 1, false, search);
    }
  };

  // Filtering is now handled on the backend via the fetchTenants query
  const filteredTenants = tenants;

  return (
    <View className="flex-1 bg-surface-bg" style={{ paddingTop: insets.top }}>
      
      {/* Header */}
      <View className="items-center py-4 mb-2 flex-row justify-center relative">
        <Text className="text-text-primary text-lg font-black tracking-tight">Tenants</Text>
      </View>

      <FlatList
        className="flex-1"
        data={filteredTenants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#CCFF00" />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            {/* Search */}
            <View className="bg-white rounded-2xl h-14 flex-row items-center px-4 border border-zinc-200 mb-6 mt-2" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
              <Search size={20} color="#A1A1AA" strokeWidth={2.5} style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Search by name..." placeholderTextColor="#A1A1AA"
                className="flex-1 text-sm text-text-primary font-bold h-full"
                value={search} onChangeText={setSearch}
              />
            </View>

            {/* Select Property Dropdown */}
            <View className="mb-8">
              <View className="mb-3 px-1 flex-row justify-between items-center">
                <Text className="text-text-primary text-xl font-bold tracking-tight">Property</Text>
                <TouchableOpacity onPress={() => navigation.navigate("PropertyDetails")}>
                  <Text className="text-text-primary font-bold text-sm">Add New</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate("PropertySelector")}
                className="bg-white rounded-2xl h-16 flex-row items-center px-5 border border-zinc-200 justify-between" 
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="h-10 w-10 bg-[#CCFF00] rounded-full items-center justify-center mr-3">
                    <Building2 size={20} color="#1C1C1C" strokeWidth={2.5} />
                  </View>
                  <View>
                    <Text className="text-text-primary text-base font-black">{selectedProperty?.name || "Select Property"}</Text>
                    <Text className="text-text-secondary text-xs font-medium">{selectedProperty?.address || "No properties available"}</Text>
                  </View>
                </View>
                <ChevronDown size={24} color="#1C1C1C" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Tenants List Header */}
            <View className="mb-4 px-1 flex-row justify-between items-center">
              <Text className="text-text-primary text-xl font-bold tracking-tight">Current Tenants</Text>
              <View className="bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                <Text className="text-text-secondary font-bold text-xs">{totalTenants} Total</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View className={`${index === 0 ? 'rounded-t-[32px]' : ''} ${index === filteredTenants.length - 1 ? 'rounded-b-[32px] mb-10' : ''} bg-white border-x border-zinc-200 ${index === 0 ? 'border-t' : ''} ${index === filteredTenants.length - 1 ? 'border-b' : ''}`} style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
            <TenantItem 
              onPress={() => navigation.navigate("TenantDetails", { tenant: item, properties })}
              name={item.name}
              room={item.room_number || "N/A"}
              rent={item.rent_amount?.toLocaleString() || "0"}
              status={item.status || "Paid"}
              isLast={index === filteredTenants.length - 1}
            />
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="bg-white rounded-[32px] p-10 items-center border border-zinc-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
              <Text className="text-text-secondary font-bold">No tenants found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-6">
              <ActivityIndicator size="small" color="#CCFF00" />
            </View>
          ) : <View style={{ height: insets.bottom + 20 }} />
        }
      />
    </View>
  );
}
