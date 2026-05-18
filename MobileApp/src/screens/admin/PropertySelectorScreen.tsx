import React from "react";
import { View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { X, Building2, Plus, Edit2 } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";

export default function PropertySelectorScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { properties, selectedProperty, setSelectedProperty } = useAuth();

  return (
    <View className="flex-1 bg-[#0D0D0F]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-zinc-800 pb-6">
        <View className="flex-1 mr-4">
          <Text className="text-white text-2xl font-black tracking-tight">Select Property</Text>
          <Text className="text-zinc-500 text-sm font-medium mt-1">
            Choose a property to manage its details and tenants.
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-zinc-800 rounded-full items-center justify-center"
        >
          <X size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => {
          const isSelected = selectedProperty?.id === item.id;
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedProperty(item);
                navigation.goBack();
              }}
              className={`mb-4 rounded-2xl p-5 border flex-row items-center justify-between ${
                isSelected ? 'bg-zinc-800/80 border-[#CCFF00]/50' : 'bg-[#161618] border-zinc-800'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className={`h-12 w-12 rounded-full items-center justify-center mr-4 ${isSelected ? 'bg-[#CCFF00]' : 'bg-zinc-800'}`}>
                  <Building2 size={24} color={isSelected ? '#1C1C1C' : '#FFFFFF'} strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                  <Text className={`text-lg font-black ${isSelected ? 'text-[#CCFF00]' : 'text-white'}`}>{item.name}</Text>
                  <Text className="text-zinc-400 text-xs font-medium mt-1 pr-4" numberOfLines={1}>{item.address}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("PropertyDetails", { property: item })}
                className="h-10 w-10 bg-zinc-800 rounded-full items-center justify-center ml-2"
              >
                <Edit2 size={16} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />

      <View className="px-6 pb-10">
        <TouchableOpacity 
          onPress={() => navigation.navigate("PropertyDetails")}
          className="bg-[#CCFF00] rounded-2xl h-16 flex-row items-center justify-center shadow-lg shadow-[#CCFF00]/20"
        >
          <Plus size={20} color="#000" strokeWidth={3} style={{ marginRight: 8 }} />
          <Text className="text-black font-black text-lg">Add New Property</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
