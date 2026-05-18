import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, TextInput, Alert,
  KeyboardAvoidingView, Platform, StyleSheet
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Zap, Droplets, Wrench, Globe, Building2,
  ChevronRight, ChevronDown, ReceiptText, X, Check
} from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

function ActionItem({
  Icon, label, isLast, onPress,
}: {
  Icon: any; label: string; isLast?: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center py-5 px-4 ${!isLast ? "border-b border-zinc-50" : ""}`}
    >
      <View className="mr-4 h-10 w-10 bg-zinc-50 rounded-full items-center justify-center">
        <Icon size={20} color="#1C1C1C" strokeWidth={2} />
      </View>
      <Text className="flex-1 text-text-primary text-[15px] font-bold">{label}</Text>
      <ChevronRight size={18} color="#A1A1AA" strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

class ErrorBoundary extends React.Component<
  { children: any },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("ExpensesScreen ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={ss.errorContainer}>
          <Text style={ss.errorTitle}>Something went wrong</Text>
          <Text style={ss.errorBody}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function ExpensesScreenContent() {
  const insets = useSafeAreaInsets();
  const { selectedProperty, setSelectedProperty, properties } = useAuth();

  const [loading, setLoading] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNote, setExpenseNote] = useState("");

  const fetchExpensesData = useCallback(async () => {
    if (!selectedProperty?.id) return;
    try {
      setLoading(true);
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("pg_transactions")
        .select("*")
        .eq("pg_id", selectedProperty.id)
        .eq("type", "Expense")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setRecentExpenses(data);
        const monthlyTotal = data.reduce((acc, curr) => {
          const d = new Date(curr.created_at);
          if (d >= startOfMonth) return acc + Number(curr.amount || 0);
          return acc;
        }, 0);
        setTotalExpenses(monthlyTotal);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedProperty?.id]);

  useEffect(() => {
    fetchExpensesData();
  }, [fetchExpensesData]);

  const handleLogExpense = async () => {
    if (!expenseAmount || isNaN(Number(expenseAmount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.from("pg_transactions").insert({
        pg_id: selectedProperty.id,
        title: selectedCategory || "Other Expense",
        amount: Number(expenseAmount),
        type: "Expense",
        status: "Paid",
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setExpenseAmount("");
      setExpenseNote("");
      await fetchExpensesData();
      setShowLogModal(false);
    } catch (err) {
      console.error("Error logging expense:", err);
      Alert.alert("Error", "Failed to log expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-bg" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="items-center py-4 mb-2 flex-row justify-between px-5">
        <Text className="text-text-primary text-xl font-black tracking-tight">Expenses</Text>
        {loading && <ActivityIndicator size="small" color="#1C1C1C" />}
      </View>

      <ScrollView
        style={ss.scrollView}
        contentContainerStyle={ss.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Selector */}
        <View className="mb-6">
          <View className="mb-3 px-1">
            <Text className="text-text-secondary text-xs font-black uppercase tracking-widest">
              Selected Property
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowPropertyPicker(true)}
            className="bg-white rounded-3xl py-4 flex-row items-center px-5 border border-zinc-200 justify-between"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 bg-[#CCFF00] rounded-full items-center justify-center mr-3">
                <Building2 size={20} color="#1C1C1C" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-text-primary text-base font-black">
                  {selectedProperty?.name || "Select Property"}
                </Text>
                <Text className="text-text-secondary text-xs font-medium">
                  {selectedProperty?.address || "No address set"}
                </Text>
              </View>
            </View>
            <ChevronDown size={20} color="#A1A1AA" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View className="bg-[#1C1C1C] rounded-[32px] p-6 mb-8 shadow-lg relative overflow-hidden">
          <View className="absolute -top-10 -right-10 h-40 w-40 bg-white/5 rounded-full" />
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white/60 text-sm font-bold uppercase tracking-widest">
              Spent this month
            </Text>
            <ReceiptText size={20} color="rgba(255,255,255,0.4)" />
          </View>
          <Text className="text-white text-5xl font-black tracking-tighter mb-1">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </Text>
          <Text className="text-white/40 text-xs font-medium">
            Auto-calculated from logged expenses
          </Text>
        </View>

        {/* Log New Expense */}
        <View className="mb-8">
          <View className="mb-4 px-1">
            <Text className="text-text-primary text-xl font-bold tracking-tight">Log new expense</Text>
          </View>
          <View className="bg-white rounded-[32px] p-2 border border-zinc-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
            <ActionItem Icon={Zap} label="Electricity Bill" onPress={() => { setSelectedCategory("Electricity Bill"); setShowLogModal(true); }} />
            <ActionItem Icon={Droplets} label="Water Bill" onPress={() => { setSelectedCategory("Water Bill"); setShowLogModal(true); }} />
            <ActionItem Icon={Wrench} label="Maintenance & Repairs" onPress={() => { setSelectedCategory("Maintenance & Repairs"); setShowLogModal(true); }} />
            <ActionItem Icon={Globe} label="Internet / Wi-Fi" onPress={() => { setSelectedCategory("Internet / Wi-Fi"); setShowLogModal(true); }} />
            <ActionItem Icon={ReceiptText} label="Other Expenses" isLast onPress={() => { setSelectedCategory("Other Expense"); setShowLogModal(true); }} />
          </View>
        </View>

        {/* Recent History */}
        <View className="mb-10">
          <View className="mb-4 px-1">
            <Text className="text-text-primary text-xl font-bold tracking-tight">Recent history</Text>
          </View>
          {recentExpenses.length === 0 ? (
            <View className="bg-white rounded-[32px] p-10 items-center justify-center border border-zinc-200 border-dashed">
              <ReceiptText size={40} color="#E4E4E7" />
              <Text className="text-text-secondary font-bold mt-4 text-center text-sm">
                No expenses recorded yet for this property.
              </Text>
            </View>
          ) : (
            <View className="bg-white rounded-[32px] p-3 border border-zinc-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
              {recentExpenses.map((ex, idx) => (
                <View
                  key={ex.id}
                  className={`p-4 flex-row items-center ${idx !== recentExpenses.length - 1 ? "border-b border-zinc-50" : ""}`}
                >
                  <View className="h-10 w-10 bg-zinc-50 rounded-full items-center justify-center mr-4">
                    <Zap size={18} color="#1C1C1C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary text-base font-bold">{ex.title}</Text>
                    <Text className="text-text-secondary text-xs font-medium">
                      {new Date(ex.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="text-[#FF3D00] font-black text-base">
                    -₹{Number(ex.amount).toLocaleString("en-IN")}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>

      {/* Property Picker Modal */}
      <Modal visible={showPropertyPicker} transparent animationType="slide" onRequestClose={() => setShowPropertyPicker(false)}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-text-primary text-2xl font-black tracking-tight">Select Property</Text>
              <TouchableOpacity onPress={() => setShowPropertyPicker(false)} className="h-10 w-10 bg-zinc-100 rounded-full items-center justify-center">
                <X size={20} color="#1C1C1C" strokeWidth={3} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {properties.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => { setSelectedProperty(p); setShowPropertyPicker(false); }}
                  className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${selectedProperty?.id === p.id ? "bg-zinc-50 border-zinc-300" : "bg-white border-zinc-200"}`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className={`h-10 w-10 rounded-full items-center justify-center mr-4 ${selectedProperty?.id === p.id ? "bg-[#CCFF00]" : "bg-zinc-100"}`}>
                      <Building2 size={18} color={selectedProperty?.id === p.id ? "#000" : "#A1A1AA"} />
                    </View>
                    <View>
                      <Text className="font-bold text-base text-text-primary">{p.name}</Text>
                      <Text className="text-text-secondary text-xs mt-0.5">{p.address || "No address"}</Text>
                    </View>
                  </View>
                  {selectedProperty?.id === p.id && (
                    <View className="h-6 w-6 rounded-full bg-[#CCFF00] items-center justify-center">
                      <Check size={14} color="#000000" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Log Expense Modal */}
      <Modal visible={showLogModal} transparent animationType="slide" onRequestClose={() => setShowLogModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={ss.flex1}>
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10 shadow-2xl">
              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text className="text-text-primary text-2xl font-black tracking-tight">Log Expense</Text>
                  <Text className="text-text-secondary text-sm font-bold uppercase tracking-widest">{selectedCategory}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowLogModal(false)} className="h-10 w-10 bg-zinc-100 rounded-full items-center justify-center">
                  <X size={20} color="#1C1C1C" strokeWidth={3} />
                </TouchableOpacity>
              </View>

              <View className="mb-6">
                <Text className="text-text-secondary text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Amount Paid</Text>
                <View className="bg-zinc-50 rounded-2xl h-16 flex-row items-center px-4 border border-zinc-200">
                  <Text className="text-text-primary font-black text-xl mr-2">₹</Text>
                  <TextInput
                    className="flex-1 text-text-primary font-black text-xl h-full"
                    value={expenseAmount}
                    onChangeText={setExpenseAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    autoFocus
                  />
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-text-secondary text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Optional Note</Text>
                <View className="bg-zinc-50 rounded-2xl h-16 flex-row items-center px-4 border border-zinc-200">
                  <TextInput
                    className="flex-1 text-text-primary font-bold text-base h-full"
                    value={expenseNote}
                    onChangeText={setExpenseNote}
                    placeholder="Electricity for March..."
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogExpense}
                disabled={loading}
                className="bg-[#1C1C1C] rounded-2xl h-16 items-center justify-center shadow-lg"
              >
                {loading
                  ? <ActivityIndicator color="#FFF" />
                  : <Text className="text-white font-black text-lg">Record Expense</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const ss = StyleSheet.create({
  flex1: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
  errorTitle: { color: "#EF4444", fontWeight: "bold", marginBottom: 8 },
  errorBody: { fontSize: 12, color: "#6B7280" },
});

export default function ExpensesScreen() {
  return (
    <ErrorBoundary>
      <ExpensesScreenContent />
    </ErrorBoundary>
  );
}
