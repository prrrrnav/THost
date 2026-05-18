import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LocalizationContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Calendar } from "@/lib/icons";

const DietInput = ({ label, value, onChangeText, placeholder, isVeg = true }: any) => (
  <View className="mb-4">
    <View className="flex-row items-center mb-1.5 ml-1">
      <View className={`w-2 h-2 rounded-full mr-1.5 ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
      <Text className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">{label}</Text>
    </View>
    <View className="bg-zinc-50 rounded-2xl h-24 py-3 px-4 border border-zinc-200">
      <TextInput
        className="flex-1 text-zinc-900 font-semibold text-[14px] h-full"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#D4D4D8"
        multiline={true}
        textAlignVertical="top"
      />
    </View>
  </View>
);

const MealCard = ({ title, vegLabel, vegValue, onVegChange, nonVegLabel, nonVegValue, onNonVegChange, vegPlaceholder, nonVegPlaceholder }: any) => (
  <View className="bg-white rounded-[28px] p-5 border border-zinc-100 shadow-sm mb-5">
    <Text className="text-zinc-900 text-lg font-bold mb-4">{title}</Text>
    <DietInput 
      label={vegLabel} 
      value={vegValue} 
      onChangeText={onVegChange} 
      placeholder={vegPlaceholder} 
      isVeg={true}
    />
    <DietInput 
      label={nonVegLabel} 
      value={nonVegValue} 
      onChangeText={onNonVegChange} 
      placeholder={nonVegPlaceholder} 
      isVeg={false}
    />
  </View>
);

export default function MenuScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { selectedProperty } = useAuth();
  const { t } = useTranslation();

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [repeatAllWeeks, setRepeatAllWeeks] = useState(false);

  // Meal states (Veg and Non-Veg)
  const [breakfastVeg, setBreakfastVeg] = useState("");
  const [breakfastNonVeg, setBreakfastNonVeg] = useState("");
  const [lunchVeg, setLunchVeg] = useState("");
  const [lunchNonVeg, setLunchNonVeg] = useState("");
  const [dinnerVeg, setDinnerVeg] = useState("");
  const [dinnerNonVeg, setDinnerNonVeg] = useState("");

  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);

  useEffect(() => {
    fetchWeeklyMenu();
  }, [selectedDay, selectedWeek, selectedProperty]);

  const parseDishes = (dishesStr: string) => {
    try {
      const parsed = JSON.parse(dishesStr || "{}");
      if (parsed && (parsed.veg !== undefined || parsed.nonVeg !== undefined)) {
        return { veg: parsed.veg || "", nonVeg: parsed.nonVeg || "" };
      }
    } catch (e) {
      // Legacy simple string format
    }
    return { veg: dishesStr || "", nonVeg: "" };
  };

  const fetchWeeklyMenu = async () => {
    if (!selectedProperty?.id) return;
    try {
      setMenuLoading(true);
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("pg_id", selectedProperty.id)
        .eq("week_number", selectedWeek)
        .eq("day_of_week", selectedDay);

      if (error) throw error;

      // Reset
      setBreakfastVeg(""); setBreakfastNonVeg("");
      setLunchVeg(""); setLunchNonVeg("");
      setDinnerVeg(""); setDinnerNonVeg("");

      if (data && data.length > 0) {
        data.forEach((item: any) => {
          const { veg, nonVeg } = parseDishes(item.dishes || "");
          if (item.meal_type === "Breakfast") { setBreakfastVeg(veg); setBreakfastNonVeg(nonVeg); }
          if (item.meal_type === "Lunch") { setLunchVeg(veg); setLunchNonVeg(nonVeg); }
          if (item.meal_type === "Dinner") { setDinnerVeg(veg); setDinnerNonVeg(nonVeg); }
        });
      }
    } catch (e: any) {
      console.error("Error fetching menu:", e);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleSaveMenu = async () => {
    if (!selectedProperty?.id) {
      Alert.alert(t("error"), t("select_property_first"));
      return;
    }
    try {
      setLoading(true);
      
      const meals = [
        { type: "Breakfast", dishes: JSON.stringify({ veg: (breakfastVeg || "").trim(), nonVeg: (breakfastNonVeg || "").trim() }) },
        { type: "Lunch", dishes: JSON.stringify({ veg: (lunchVeg || "").trim(), nonVeg: (lunchNonVeg || "").trim() }) },
        { type: "Dinner", dishes: JSON.stringify({ veg: (dinnerVeg || "").trim(), nonVeg: (dinnerNonVeg || "").trim() }) }
      ];

      const weeksToUpdate = repeatAllWeeks ? [1, 2, 3, 4] : [selectedWeek];

      // 1. Fetch all existing records in one single fast query
      const { data: existingRecords, error: fetchErr } = await supabase
        .from("menu_items")
        .select("id, week_number, meal_type")
        .eq("pg_id", selectedProperty.id)
        .eq("day_of_week", selectedDay)
        .in("week_number", weeksToUpdate);

      if (fetchErr) throw fetchErr;

      const toInsert: any[] = [];
      const updates: any[] = [];

      for (const week of weeksToUpdate) {
        for (const m of meals) {
          const match = existingRecords?.find(
            (r: any) => r.week_number === week && r.meal_type === m.type
          );

          if (match) {
            updates.push(
              supabase
                .from("menu_items")
                .update({
                  dishes: m.dishes,
                  updated_at: new Date().toISOString()
                })
                .eq("id", match.id)
            );
          } else {
            toInsert.push({
              pg_id: selectedProperty.id,
              day_of_week: selectedDay,
              meal_type: m.type,
              dishes: m.dishes,
              week_number: week,
              updated_at: new Date().toISOString()
            });
          }
        }
      }

      // 2. Perform bulk insert for all new items in a single query
      if (toInsert.length > 0) {
        const { error: insertErr } = await supabase
          .from("menu_items")
          .insert(toInsert);
        if (insertErr) throw insertErr;
      }

      // 3. Perform concurrent parallel updates for existing items
      if (updates.length > 0) {
        const results = await Promise.all(updates);
        for (const res of results) {
          if (res.error) throw res.error;
        }
      }

      Alert.alert(t("success"), repeatAllWeeks 
        ? `${t("menu_applied_all_weeks")}` 
        : `${t("menu_saved_success")}`
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert(t("error"), err.message || "Failed to update food menu.");
    } finally {
      setLoading(false);
    }
  };

  const getDayKey = (dayName: string) => {
    switch (dayName) {
      case "Monday": return "mon";
      case "Tuesday": return "tue";
      case "Wednesday": return "wed";
      case "Thursday": return "thu";
      case "Friday": return "fri";
      case "Saturday": return "sat";
      case "Sunday": return "sun";
      default: return "mon";
    }
  };

  return (
    <View className="flex-1 bg-[#F5F5F7]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-white border border-zinc-200 rounded-full items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} color="#1C1C1C" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-zinc-900 text-lg font-bold tracking-tight">{t("food_planner_title")}</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* Repeat Week Settings Card */}
        <View className="bg-white rounded-[28px] p-5 border border-zinc-100 shadow-sm mb-6 mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center flex-1 pr-4">
              <View className="h-10 w-10 bg-[#CCFF00]/20 rounded-full items-center justify-center mr-3">
                <Calendar size={18} color="#99CC00" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-zinc-900 font-bold text-base mb-0.5">{t("repeat_all_weeks")}</Text>
                <Text className="text-zinc-500 text-[11px]">{t("repeat_all_weeks_sub")}</Text>
              </View>
            </View>
            <Switch
              value={repeatAllWeeks}
              onValueChange={setRepeatAllWeeks}
              trackColor={{ false: '#E4E4E7', true: '#1C1C1C' }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#E4E4E7"
            />
          </View>
        </View>

        {/* Filters */}
        <View className="mb-6">
          <Text className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-3 ml-1">
            {t("select_week")}
          </Text>
          <View className="flex-row gap-2 mb-4">
            {[1, 2, 3, 4].map((weekNum) => {
              const isSelected = selectedWeek === weekNum;
              return (
                <TouchableOpacity
                  key={weekNum}
                  onPress={() => setSelectedWeek(weekNum)}
                  className={`flex-1 py-2.5 rounded-2xl items-center border-2 ${
                    isSelected ? 'bg-zinc-900 border-zinc-900 shadow-sm' : 'bg-white border-zinc-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-600'}`}>
                    {t("week")} {weekNum}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <Text className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-3 ml-1 mt-2">
            {t("select_day")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
              const isSelected = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  className={`px-5 py-2.5 rounded-full mr-2.5 border-2 ${
                    isSelected ? 'bg-zinc-900 border-zinc-900 shadow-sm' : 'bg-white border-zinc-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-600'}`}>{t(getDayKey(day))}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {menuLoading ? (
          <View className="py-20 items-center justify-center bg-white rounded-[32px] border border-zinc-100 shadow-sm">
            <ActivityIndicator color="#1C1C1C" size="large" />
          </View>
        ) : (
          <View className="mb-6">
            <MealCard 
              title={t("breakfast_menu")}
              vegLabel={t("veg")}
              vegValue={breakfastVeg} 
              onVegChange={setBreakfastVeg}
              nonVegLabel={t("non_veg")}
              nonVegValue={breakfastNonVeg} 
              onNonVegChange={setBreakfastNonVeg}
              vegPlaceholder="E.g., Paneer Butter Masala, Roti, Dal"
              nonVegPlaceholder="E.g., Chicken Curry, Egg Bhurji"
            />
            <MealCard 
              title={t("lunch_menu")}
              vegLabel={t("veg")}
              vegValue={lunchVeg} 
              onVegChange={setLunchVeg}
              nonVegLabel={t("non_veg")}
              nonVegValue={lunchNonVeg} 
              onNonVegChange={setLunchNonVeg}
              vegPlaceholder="E.g., Paneer Butter Masala, Roti, Dal"
              nonVegPlaceholder="E.g., Chicken Curry, Egg Bhurji"
            />
            <MealCard 
              title={t("dinner_menu")}
              vegLabel={t("veg")}
              vegValue={dinnerVeg} 
              onVegChange={setDinnerVeg}
              nonVegLabel={t("non_veg")}
              nonVegValue={dinnerNonVeg} 
              onNonVegChange={setDinnerNonVeg}
              vegPlaceholder="E.g., Paneer Butter Masala, Roti, Dal"
              nonVegPlaceholder="E.g., Chicken Curry, Egg Bhurji"
            />

            <TouchableOpacity 
              onPress={handleSaveMenu}
              disabled={loading}
              className="bg-[#CCFF00] rounded-[24px] h-14 items-center justify-center mt-2 shadow-sm border border-[#AACC00]"
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#1C1C1C" />
              ) : (
                <Text className="text-zinc-900 font-bold text-base">{t("save_weekly_menu")}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>
    </View>
  );
}
