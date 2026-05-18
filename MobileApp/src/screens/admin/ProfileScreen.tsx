import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { 
  User, Mail, Phone, Building, Building2, LogOut, Wrench, 
  Check, X, ChevronDown, Calendar, Users, Clock, Globe, Lock, Plus, UserCircle2, Edit2 
} from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LocalizationContext";
import { supabase } from "@/lib/supabase";

const InputField = ({ label, value, onChangeText, placeholder, keyboardType = "default", icon: Icon, multiline = false, editable = true, secureTextEntry = false }: any) => (
  <View className="mb-5">
    <Text className="text-zinc-500 text-[11px] font-medium mb-1.5 ml-1">{label}</Text>
    <View className={`bg-zinc-50 rounded-2xl ${multiline ? 'h-28 py-4' : 'h-14 items-center'} flex-row px-4 border border-zinc-200 ${!editable ? 'opacity-50' : ''}`}>
      {Icon && <Icon size={18} color="#A1A1AA" style={{ marginRight: 12, marginTop: multiline ? 2 : 0 }} />}
      <TextInput
        className="flex-1 text-zinc-900 font-semibold text-[15px] h-full"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#D4D4D8"
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        textAlignVertical={multiline ? "top" : "center"}
        editable={editable}
      />
    </View>
  </View>
);

const InfoRow = ({ label, value, icon: Icon, hideBorder = false }: any) => (
  <View className="flex-row items-center mb-2">
    <View className="w-10 items-center justify-center mr-3">
      {Icon && <Icon size={20} color="#71717A" strokeWidth={1.5} />}
    </View>
    <View className={`flex-1 ${hideBorder ? '' : 'border-b border-zinc-100'} pb-4 pt-2`}>
      <Text className="text-zinc-400 text-[11px] font-medium mb-1">{label}</Text>
      <Text className="text-zinc-900 text-[15px] font-semibold">{value || "Not provided"}</Text>
    </View>
  </View>
);

const ActionRow = ({ title, subtitle, icon: Icon, onPress, hideBorder = false }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center justify-between py-3"
    activeOpacity={0.7}
  >
    <View className="flex-row items-center flex-1">
      <View className="h-10 w-10 bg-zinc-50 rounded-full items-center justify-center mr-4">
        <Icon size={18} color="#1C1C1C" strokeWidth={2} />
      </View>
      <View className={`flex-1 ${hideBorder ? '' : 'border-b border-zinc-100'} pb-3 pt-1`}>
        <Text className="text-zinc-900 font-semibold text-[15px] mb-0.5">{title}</Text>
        {subtitle && <Text className="text-zinc-500 text-[12px]">{subtitle}</Text>}
      </View>
    </View>
    <View className={`pb-3 ${hideBorder ? '' : 'border-b border-zinc-100'}`}>
      <ChevronDown size={18} color="#A1A1AA" strokeWidth={2} style={{ transform: [{ rotate: '-90deg' }] }} />
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }: any) {
  const { profile, session, signOut, properties, selectedProperty, setSelectedProperty, refreshProperties } = useAuth();
  const insets = useSafeAreaInsets();
  const { t, locale, setLocale } = useTranslation();

  // Loading indicator state
  const [loading, setLoading] = useState(false);

  // Profile details editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(profile?.full_name ?? "");
  const [profilePhone, setProfilePhone] = useState((profile as any)?.address ?? "");

  // PG Details editing (Selected PG)
  const [pgName, setPgName] = useState(selectedProperty?.name ?? "");
  const [pgAddress, setPgAddress] = useState(selectedProperty?.address ?? "");
  const [pgTotalBeds, setPgTotalBeds] = useState(selectedProperty?.total_beds?.toString() ?? "");
  const [pgRules, setPgRules] = useState(selectedProperty?.rules ?? "");
  const [pgCode, setPgCode] = useState(selectedProperty?.joining_code ?? "");

  // Wifi SSID & Curfew settings
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [gateOpening, setGateOpening] = useState("");
  const [gateClosing, setGateClosing] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Wifi floor details state
  const [wifiFloors, setWifiFloors] = useState<{ floor: string; ssid: string; password?: string }[]>([]);

  // PG Modal drop-down state
  const [isPgSelectorVisible, setIsPgSelectorVisible] = useState(false);

  // Sync state whenever selected property or profile changes
  useEffect(() => {
    if (selectedProperty) {
      setPgName(selectedProperty.name || "");
      setPgAddress(selectedProperty.address || "");
      setPgTotalBeds(selectedProperty.total_beds?.toString() || "");
      setPgRules(selectedProperty.rules || "");
      setPgCode(selectedProperty.joining_code || "");
      fetchPgSettings();
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.full_name || "");
      setProfilePhone((profile as any).address || "");
    }
  }, [profile]);

  // Fetch WiFi & curfew configurations
  const fetchPgSettings = async () => {
    if (!selectedProperty?.id) return;
    try {
      const { data, error } = await supabase
        .from("pg_settings")
        .select("*")
        .eq("pg_id", selectedProperty.id)
        .maybeSingle();

      if (!error && data) {
        setWifiSsid(data.wifi_ssid || "");
        setWifiPassword(data.wifi_password || "");
        setGateOpening(data.gate_opening_time || "");
        setGateClosing(data.gate_closing_time || "");
        setEmergencyContact(data.emergency_contact || "");
        
        if (data.wifi_ssid && data.wifi_ssid.startsWith("[")) {
          try {
            const parsed = JSON.parse(data.wifi_ssid);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setWifiFloors(parsed);
            } else {
              setWifiFloors([{ floor: "1st Floor", ssid: data.wifi_ssid, password: data.wifi_password || "" }]);
            }
          } catch (err) {
            setWifiFloors([{ floor: "1st Floor", ssid: data.wifi_ssid, password: data.wifi_password || "" }]);
          }
        } else {
          setWifiFloors([{ floor: "1st Floor", ssid: data.wifi_ssid || "", password: data.wifi_password || "" }]);
        }
      } else {
        setWifiSsid("");
        setWifiPassword("");
        setGateOpening("");
        setGateClosing("");
        setEmergencyContact("");
        setWifiFloors([{ floor: "1st Floor", ssid: "", password: "" }]);
      }
    } catch (err) {
      console.error("Error fetching wifi & curfew settings:", err);
    }
  };

  const handleSaveProfileAndPg = async () => {
    if (!profile?.id || !selectedProperty?.id) return;
    
    setLoading(true);
    try {
      // 1. Update personal details
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: profileName,
          address: profilePhone // Storing phone in address column per existing database architecture
        })
        .eq("id", profile.id);

      if (profileError) throw profileError;

      // 2. Update PG details
      const { error: pgError } = await supabase
        .from("pg_details")
        .update({
          name: pgName,
          address: pgAddress,
          total_beds: parseInt(pgTotalBeds) || 0,
          rules: pgRules
        })
        .eq("id", selectedProperty.id);

      if (pgError) throw pgError;

      // 3. Update Wifi & Curfew settings
      const wifiFloorsString = JSON.stringify(wifiFloors);
      const { data: settingsExists } = await supabase
        .from("pg_settings")
        .select("id")
        .eq("pg_id", selectedProperty.id)
        .maybeSingle();

      if (settingsExists) {
        const { error: settingsError } = await supabase
          .from("pg_settings")
          .update({
            wifi_ssid: wifiFloorsString,
            wifi_password: wifiFloors[0]?.password || "",
            gate_opening_time: gateOpening,
            gate_closing_time: gateClosing,
            emergency_contact: emergencyContact
          })
          .eq("pg_id", selectedProperty.id);

        if (settingsError) throw settingsError;
      } else {
        const { error: settingsError } = await supabase
          .from("pg_settings")
          .insert({
            pg_id: selectedProperty.id,
            wifi_ssid: wifiFloorsString,
            wifi_password: wifiFloors[0]?.password || "",
            gate_opening_time: gateOpening,
            gate_closing_time: gateClosing,
            emergency_contact: emergencyContact
          });

        if (settingsError) throw settingsError;
      }

      // Refresh properties in AuthContext to update UI
      await refreshProperties();

      setIsEditingProfile(false);
      Alert.alert(t("success"), t("save_changes"));
    } catch (err: any) {
      Alert.alert(t("error"), err.message || "Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t("sign_out"),
      t("sign_out_confirm"),
      [
        { text: t("cancel"), style: "cancel" },
        { 
          text: t("sign_out"), 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error("Error signing out: ", error);
              Alert.alert(t("error"), "Failed to sign out.");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#F5F5F7]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="items-center pt-2 pb-6">
        <Text className="text-zinc-900 text-base font-bold tracking-tight mb-6">{t("profile_title")}</Text>
        
        {/* Profile Avatar */}
        <View className="relative">
          <View className="w-24 h-24 rounded-full bg-zinc-200 border-4 border-[#F5F5F7] shadow-sm items-center justify-center overflow-hidden">
            <UserCircle2 size={48} color="#A1A1AA" strokeWidth={1.5} />
          </View>
          <TouchableOpacity 
            onPress={() => setIsEditingProfile(!isEditingProfile)}
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-zinc-100 shadow-sm"
          >
            <Edit2 size={14} color="#1C1C1C" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pb-8">
          
          {/* Select Property Dropdown - Normal matching Tenants Screen Style */}
          <TouchableOpacity 
            onPress={() => setIsPgSelectorVisible(true)}
            className="bg-white rounded-2xl h-16 flex-row items-center px-5 border border-zinc-200 justify-between mb-6" 
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 bg-[#CCFF00] rounded-full items-center justify-center mr-3">
                <Building2 size={20} color="#1C1C1C" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">{t("currently_managed")}</Text>
                <Text className="text-text-primary text-base font-black">{selectedProperty?.name || t("select_property")}</Text>
              </View>
            </View>
            <ChevronDown size={24} color="#1C1C1C" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Personal Info Card */}
          <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm" style={{ elevation: 2 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-zinc-900 text-lg font-bold">{t("personal_info")}</Text>
              {!isEditingProfile ? (
                <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
                  <Text className="text-zinc-900 font-semibold text-[13px]">{t("edit")}</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {isEditingProfile ? (
              <View>
                <InputField label={t("full_name")} value={profileName} onChangeText={setProfileName} placeholder="Terry Melton" icon={User} />
                <InputField label={t("email_address")} value={session?.user?.email ?? ""} placeholder="terry@example.com" icon={Mail} editable={false} />
                <InputField label={t("phone_number")} value={profilePhone} onChangeText={setProfilePhone} placeholder="+1 201 555-0123" icon={Phone} />
              </View>
            ) : (
              <View>
                <InfoRow label={t("full_name")} value={profileName} icon={User} />
                <InfoRow label={t("email_address")} value={session?.user?.email} icon={Mail} />
                <InfoRow label={t("phone_number")} value={profilePhone} icon={Phone} hideBorder />
              </View>
            )}
          </View>

          {/* Property Info Card */}
          <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm" style={{ elevation: 2 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-zinc-900 text-lg font-bold">{t("property_info")}</Text>
              {!isEditingProfile ? (
                <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
                  <Text className="text-zinc-900 font-semibold text-[13px]">{t("edit")}</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {isEditingProfile ? (
              <View>
                <InputField label={t("pg_name")} value={pgName} onChangeText={setPgName} placeholder="TheHost Premium PG" icon={Building} />
                <InputField label={t("pg_address")} value={pgAddress} onChangeText={setPgAddress} placeholder="70 Rainey Street" icon={Building2} />
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <InputField label={t("total_beds")} value={pgTotalBeds} onChangeText={setPgTotalBeds} placeholder="50" keyboardType="numeric" icon={Building} />
                  </View>
                  <View className="flex-1">
                    <InputField label={t("joining_code")} value={pgCode} onChangeText={setPgCode} placeholder="THOST1" icon={Lock} editable={false} />
                  </View>
                </View>
                <InputField label={t("house_rules")} value={pgRules} onChangeText={setPgRules} placeholder="No loud music after 10 PM." icon={Wrench} multiline={true} />
              </View>
            ) : (
              <View>
                <InfoRow label={t("pg_name")} value={pgName} icon={Building} />
                <InfoRow label={t("pg_address")} value={pgAddress} icon={Building2} />
                <InfoRow label={t("total_beds")} value={pgTotalBeds} icon={Users} />
                <InfoRow label={t("joining_code")} value={pgCode} icon={Lock} />
                <InfoRow label={t("house_rules")} value={pgRules} icon={Wrench} hideBorder />
              </View>
            )}
          </View>

          {/* Wifi & Curfew Info Card */}
          <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm" style={{ elevation: 2 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-zinc-900 text-lg font-bold">{t("wifi_curfew")}</Text>
              {!isEditingProfile ? (
                <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
                  <Text className="text-zinc-900 font-semibold text-[13px]">{t("edit")}</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {isEditingProfile ? (
              <View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-zinc-500 text-[11px] font-medium ml-1">{t("wifi_networks")}</Text>
                  <TouchableOpacity 
                    onPress={() => setWifiFloors([...wifiFloors, { floor: `Floor ${wifiFloors.length + 1}`, ssid: "", password: "" }])}
                    className="flex-row items-center bg-zinc-100 px-3 py-1.5 rounded-full"
                  >
                    <Plus size={12} color="#1C1C1C" strokeWidth={3} style={{ marginRight: 4 }} />
                    <Text className="text-zinc-900 text-[10px] font-bold">{t("add_floor")}</Text>
                  </TouchableOpacity>
                </View>
                
                {wifiFloors.map((item, index) => (
                  <View key={index} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 mb-4">
                    <View className="flex-row justify-between items-center mb-4">
                      <TextInput
                        className="text-zinc-900 font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-zinc-200 min-w-[100px]"
                        value={item.floor}
                        onChangeText={(txt) => {
                          const updated = [...wifiFloors];
                          updated[index].floor = txt;
                          setWifiFloors(updated);
                        }}
                        placeholder="Floor Name"
                      />
                      {wifiFloors.length > 1 ? (
                        <TouchableOpacity 
                          onPress={() => {
                            const updated = wifiFloors.filter((_, i) => i !== index);
                            setWifiFloors(updated);
                          }}
                          className="h-8 w-8 items-center justify-center bg-red-50 rounded-full"
                        >
                          <X size={14} color="#EF4444" strokeWidth={2.5} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <InputField label="SSID Network Name" value={item.ssid} onChangeText={(txt: string) => {
                        const updated = [...wifiFloors];
                        updated[index].ssid = txt;
                        setWifiFloors(updated);
                      }} placeholder="Network" icon={Globe} />
                    <InputField label="WiFi Password" value={item.password || ""} onChangeText={(txt: string) => {
                        const updated = [...wifiFloors];
                        updated[index].password = txt;
                        setWifiFloors(updated);
                      }} placeholder="Password" icon={Lock} />
                  </View>
                ))}

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <InputField label={t("gate_opens")} value={gateOpening} onChangeText={setGateOpening} placeholder="06:00 AM" icon={Clock} />
                  </View>
                  <View className="flex-1">
                    <InputField label={t("gate_closes")} value={gateClosing} onChangeText={setGateClosing} placeholder="10:30 PM" icon={Clock} />
                  </View>
                </View>
                <InputField label={t("emergency_contact")} value={emergencyContact} onChangeText={setEmergencyContact} placeholder="+91 99999 99999" icon={Phone} />
              </View>
            ) : (
              <View>
                <View className="mb-4">
                  <Text className="text-zinc-400 text-[11px] font-medium mb-3 ml-12">{t("wifi_networks")}</Text>
                  {wifiFloors.map((item, index) => (
                    <View key={index} className="flex-row items-center mb-3">
                      <View className="w-10 items-center justify-center mr-3">
                        {index === 0 ? <Globe size={20} color="#71717A" strokeWidth={1.5} /> : null}
                      </View>
                      <View className="flex-1 bg-zinc-50 rounded-2xl p-3 border border-zinc-100 flex-row justify-between items-center">
                        <View>
                          <Text className="text-zinc-500 text-[11px] font-medium mb-0.5">{item.floor}</Text>
                          <Text className="text-zinc-900 text-[14px] font-semibold">{item.ssid || "Not set"}</Text>
                        </View>
                        <Text className="text-zinc-500 text-[12px] font-mono">{item.password || "No pass"}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                
                <InfoRow label={t("gate_timings")} value={`${gateOpening || "N/A"} - ${gateClosing || "N/A"}`} icon={Clock} />
                <InfoRow label={t("emergency_contact")} value={emergencyContact} icon={Phone} hideBorder />
              </View>
            )}
          </View>

          {isEditingProfile ? (
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity 
                onPress={() => setIsEditingProfile(false)}
                className="flex-1 bg-zinc-100 rounded-[20px] h-14 items-center justify-center"
              >
                <Text className="text-zinc-900 font-bold text-[15px]">{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSaveProfileAndPg}
                disabled={loading}
                className="flex-1 bg-zinc-900 rounded-[20px] h-14 items-center justify-center shadow-sm"
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-[15px]">{t("save_changes")}</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Quick Actions / Settings Options */}
          <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm" style={{ elevation: 2 }}>
            <Text className="text-zinc-900 text-lg font-bold mb-4">{t("management")}</Text>
            <ActionRow 
              title={t("resident_join_requests")} 
              subtitle={t("resident_join_sub")} 
              icon={Users} 
              onPress={() => navigation.navigate("Approvals")} 
            />
            <ActionRow 
              title={t("weekly_food_planner")} 
              subtitle={t("weekly_food_sub")} 
              icon={Calendar} 
              onPress={() => navigation.navigate("MenuPlanner")} 
              hideBorder
            />
          </View>

          {/* Premium Language Selection Card */}
          <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm" style={{ elevation: 2 }}>
            <Text className="text-zinc-900 text-lg font-bold mb-4">{t("language_selection")}</Text>
            <View className="flex-row flex-wrap justify-between gap-y-3">
              {[
                { code: "en", label: "English" },
                { code: "te", label: "Telugu (తెలుగు)" },
                { code: "ta", label: "Tamil (தமிழ்)" },
                { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
                { code: "ml", label: "Malayalam (മലയാളം)" },
                { code: "hi", label: "Hindi (हिन्दी)" },
              ].map((item) => {
                const isSelected = locale === item.code;
                return (
                  <TouchableOpacity
                    key={item.code}
                    onPress={() => setLocale(item.code as any)}
                    className="rounded-2xl py-3 border-2 items-center justify-center flex-row"
                    style={{ width: '48%', backgroundColor: isSelected ? '#1C1C1C' : '#F4F4F5', borderColor: isSelected ? '#1C1C1C' : '#F4F4F5' }}
                    activeOpacity={0.8}
                  >
                    <Text className={`text-xs font-black ${isSelected ? 'text-white' : 'text-zinc-900'}`}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sign Out Card */}
          <TouchableOpacity 
            onPress={handleSignOut}
            className="bg-white rounded-[32px] p-5 border border-zinc-100 flex-row items-center justify-between shadow-sm"
            style={{ elevation: 2 }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 bg-red-50 rounded-full items-center justify-center mr-4">
                <LogOut size={18} color="#EF4444" strokeWidth={2} />
              </View>
              <Text className="text-zinc-900 text-[15px] font-semibold">{t("sign_out")}</Text>
            </View>
            <ChevronDown size={18} color="#A1A1AA" strokeWidth={2} style={{ transform: [{ rotate: '-90deg' }] }} />
          </TouchableOpacity>
        </View>

        <View style={{ height: Platform.OS === 'ios' ? insets.bottom + 120 : 100 }} />
      </ScrollView>

      {/* Dynamic PG Selector Dropdown Modal */}
      <Modal
        visible={isPgSelectorVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPgSelectorVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10 max-h-[80%] shadow-2xl" style={{ elevation: 24 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-zinc-900 text-xl font-bold">{t("select_property")}</Text>
              <TouchableOpacity 
                onPress={() => setIsPgSelectorVisible(false)}
                className="h-10 w-10 bg-zinc-100 rounded-full items-center justify-center"
              >
                <X size={20} color="#1C1C1C" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {properties.map((item) => {
                const isSelected = selectedProperty?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setSelectedProperty(item);
                      setIsPgSelectorVisible(false);
                    }}
                    className={`mb-3 rounded-[24px] p-4 border-2 flex-row items-center justify-between ${
                      isSelected ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-zinc-100'
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className={`h-12 w-12 rounded-2xl items-center justify-center mr-4 ${isSelected ? 'bg-[#CCFF00]' : 'bg-zinc-100'}`}>
                        <Building2 size={20} color={isSelected ? '#1C1C1C' : '#71717A'} strokeWidth={2.5} />
                      </View>
                      <View className="flex-1">
                        <Text className={`text-[15px] font-bold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>{item.name}</Text>
                        <Text className={`text-[12px] mt-0.5 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`} numberOfLines={1}>{item.address}</Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <Check size={20} color="#CCFF00" strokeWidth={3} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
