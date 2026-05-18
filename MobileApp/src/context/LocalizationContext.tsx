import React, { createContext, useContext, useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

export type LocaleType = "en" | "hi" | "ta" | "te" | "kn" | "ml";

interface LocalizationContextProps {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LocalizationContext = createContext<LocalizationContextProps | undefined>(undefined);

const translations: Record<LocaleType, Record<string, string>> = {
  en: {
    // General
    cancel: "Cancel",
    save: "Save",
    save_changes: "Save Changes",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    active: "Active",
    inactive: "Inactive",

    // Login Screen
    login_title: "Thehost.",
    login_subtitle: "Premium Property Management",
    email_placeholder: "Email address",
    password_placeholder: "Password",
    sign_in: "Sign In",
    try_demo: "Try Demo Account",
    login_error_missing: "Enter email and password to proceed",
    login_error_failed: "Login failed. Check your connection.",
    platform_version: "Thehost Platform v1.0",

    // Navigation & Tabs
    tab_home: "Home",
    tab_tenants: "Tenants",
    tab_payments: "Payments",
    tab_expenses: "Expenses",
    tab_profile: "Profile",

    // Dashboard
    dashboard_title: "Dashboard",
    good_morning: "Good morning",
    select_property_label: "Select Property",
    add_payment: "Add payment",
    manage_expenses: "Manage expenses",
    manage_tenants: "Manage tenants",
    view_reports: "View reports",
    send_reminders: "Send reminders",
    properties: "Properties",
    new: "New",
    selected: "Selected",
    load_more: "Load more",
    no_properties: "No properties found",
    no_transactions: "No recent transactions",
    ask_ai: "Ask AI",
    beds_count: "Beds",
    managed_pgs: "Managed PGs",
    occupancy: "Occupancy",
    monthly_revenue: "Monthly Revenue",
    collected_rent: "Collected Rent",
    pending_rent: "Pending Rent",
    total_expenses: "Total Expenses",
    quick_stats: "Quick Stats",
    financial_overview: "Financial Overview",
    occupancy_rate: "Occupancy Rate",
    beds_occupied: "Beds Occupied",
    rent_collection: "Rent Collection",
    expense_ratio: "Expense Ratio",

    // Tenants
    tenants_title: "Tenants Queue",
    search_tenants: "Search by tenant name, room number...",
    no_tenants: "No tenants found in this property.",
    rent_due: "Rent Due",
    paid: "Paid",
    pending: "Pending",
    room: "Room",
    bed: "Bed",
    phone: "Phone",
    email: "Email",
    joining_date: "Joining Date",
    status: "Status",

    // Tenant Details
    tenant_details: "Tenant Details",
    personal_details: "Personal Details",
    lease_details: "Lease Details",
    room_allotment: "Room Allotment",
    payment_history: "Payment History",
    contact_info: "Contact Info",

    // Payments
    payments_title: "Payments and Rent",
    record_payment: "Record Payment",
    amount: "Amount",
    date: "Date",
    payment_method: "Payment Method",
    select_tenant: "Select Tenant",
    payment_success: "Payment recorded successfully",

    // Expenses
    expenses_title: "Expense Tracker",
    add_expense: "Add Expense",
    expense_category: "Category",
    expense_amount: "Amount",
    expense_date: "Date",
    expense_description: "Description",
    expense_success: "Expense recorded successfully",

    // Profile Screen
    profile_title: "Profile",
    personal_info: "Personal info",
    property_info: "Property info",
    wifi_curfew: "Wifi & Curfew",
    management: "Management",
    resident_join_requests: "Resident Join Requests",
    resident_join_sub: "Approve or decline applications",
    weekly_food_planner: "Weekly Food Planner",
    weekly_food_sub: "Manage daily meals and diet types",
    sign_out: "Sign Out",
    sign_out_confirm: "Are you sure you want to log out?",
    currently_managed: "Currently Managed PG",
    full_name: "Full Name",
    email_address: "E-mail Address",
    phone_number: "Phone Number",
    pg_name: "PG Name",
    pg_address: "PG Address",
    total_beds: "Total Beds",
    joining_code: "Joining Code",
    house_rules: "House Rules",
    wifi_networks: "WiFi Networks",
    gate_timings: "Gate Timings",
    gate_opens: "Gate Opens",
    gate_closes: "Gate Closes",
    emergency_contact: "Emergency Contact",
    add_floor: "Add Floor",
    select_property: "Select Property",
    language_selection: "App Language",

    // Approvals Screen
    approvals_title: "Resident Approvals",
    pending_approvals: "Pending Queue",
    approve: "Approve Resident",
    decline: "Reject",
    no_approvals: "No pending join requests",
    room_number: "Room Number",
    bed_number: "Bed Number",
    joining_code_instruction: "Residents must enter this exact code in their app to submit a join request. Pending requests will appear below.",
    no_phone_provided: "No phone number provided",
    enter_reason_decline: "Enter reason to decline joining request:",
    approved_success: "Resident approved successfully!",
    rejected_success: "Request rejected successfully.",

    // Weekly Food Planner
    food_planner_title: "Weekly Food Planner",
    select_week: "Select Week",
    select_day: "Select Day",
    week: "Week",
    repeat_week: "Repeat this week's menu",
    repeat_all_weeks: "Repeat for All Weeks",
    repeat_all_weeks_sub: "Apply this day's menu to weeks 1-4",
    diet_type: "Diet Type",
    veg: "Vegetarian",
    non_veg: "Non-Vegetarian",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    breakfast_menu: "Breakfast Menu",
    lunch_menu: "Lunch Menu",
    dinner_menu: "Dinner Menu",
    save_weekly_menu: "Save Weekly Menu",
    select_property_first: "Please select a property first.",
    menu_applied_all_weeks: "Menu applied to all 4 weeks!",
    menu_saved_success: "Menu saved successfully!",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  },
  hi: {
    // General
    cancel: "रद्द करें",
    save: "सहेजें",
    save_changes: "बदलाव सहेजें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    edit: "संपादित करें",
    delete: "हटाएं",
    add: "जोड़ें",
    active: "सक्रिय",
    inactive: "निष्क्रिय",

    // Login Screen
    login_title: "திஹோஸ்ட்.",
    login_subtitle: "प्रीमियम प्रॉपर्टी मैनेजमेंट",
    email_placeholder: "ईमेल पता",
    password_placeholder: "पासवर्ड",
    sign_in: "साइन इन करें",
    try_demo: "डेमो अकाउंट आज़माएं",
    login_error_missing: "आगे बढ़ने के लिए ईमेल और पासवर्ड दर्ज करें",
    login_error_failed: "लॉगिन विफल रहा। अपना कनेक्शन जांचें।",
    platform_version: "Thehost प्लेटफार्म v1.0",

    // Navigation & Tabs
    tab_home: "होम",
    tab_tenants: "किरायेदार",
    tab_payments: "भुगतान",
    tab_expenses: "खर्च",
    tab_profile: "प्रोफ़ाइल",

    // Dashboard
    dashboard_title: "डैशबोर्ड",
    good_morning: "शुभ प्रभात",
    select_property_label: "संपत्ति चुनें",
    add_payment: "भुगतान जोड़ें",
    manage_expenses: "खर्च प्रबंधित करें",
    manage_tenants: "किरायेदार प्रबंधित करें",
    view_reports: "रिपोर्ट देखें",
    send_reminders: "रिमाइंडर भेजें",
    properties: "संपत्तियां",
    new: "नया",
    selected: "चयनित",
    load_more: "और लोड करें",
    no_properties: "कोई संपत्ति नहीं मिली",
    no_transactions: "कोई हालिया लेनदेन नहीं",
    ask_ai: "AI से पूछें",
    beds_count: "बेड",
    managed_pgs: "प्रबंधित पीजी",
    occupancy: "अधिभोग",
    monthly_revenue: "मासिक राजस्व",
    collected_rent: "एकत्रित किराया",
    pending_rent: "लंबित किराया",
    total_expenses: "कुल खर्च",
    quick_stats: "त्वरित आँकड़े",
    financial_overview: "वित्तीय अवलोकन",
    occupancy_rate: "अधिभोग दर",
    beds_occupied: "भरे हुए बेड",
    rent_collection: "किराया संग्रह",
    expense_ratio: "व्यय अनुपात",

    // Tenants
    tenants_title: "किरायेदार सूची",
    search_tenants: "नाम या कमरा नंबर से खोजें...",
    no_tenants: "इस संपत्ति में कोई किरायेदार नहीं मिला।",
    rent_due: "किराया देय",
    paid: "भुगतान किया",
    pending: "लंबित",
    room: "कमरा",
    bed: "बेड",
    phone: "फ़ोन",
    email: "ईमेल",
    joining_date: "शामिल होने की तिथि",
    status: "स्थिति",

    // Tenant Details
    tenant_details: "किरायेदार का विवरण",
    personal_details: "व्यक्तिगत विवरण",
    lease_details: "पट्टा विवरण",
    room_allotment: "कमरा आवंटन",
    payment_history: "भुगतान इतिहास",
    contact_info: "संपर्क जानकारी",

    // Payments
    payments_title: "भुगतान और किराया",
    record_payment: "भुगतान रिकॉर्ड करें",
    amount: "राशि",
    date: "तारीख",
    payment_method: "भुगतान विधि",
    select_tenant: "किरायेदार चुनें",
    payment_success: "भुगतान सफलतापूर्वक दर्ज किया गया",

    // Expenses
    expenses_title: "व्यय ट्रैकर",
    add_expense: "खर्च जोड़ें",
    expense_category: "श्रेणी",
    expense_amount: "राशि",
    expense_date: "तारीख",
    expense_description: "विवरण",
    expense_success: "खर्च सफलतापूर्वक दर्ज किया गया",

    // Profile Screen
    profile_title: "प्रोफ़ाइल",
    personal_info: "व्यक्तिगत जानकारी",
    property_info: "संपत्ति की जानकारी",
    wifi_curfew: "वाईफाई और कर्फ्यू",
    management: "प्रबंधन",
    resident_join_requests: "निवासी शामिल होने के अनुरोध",
    resident_join_sub: "आवेदन स्वीकार या अस्वीकार करें",
    weekly_food_planner: "साप्ताहिक भोजन योजना",
    weekly_food_sub: "दैनिक भोजन और आहार प्रकार प्रबंधित करें",
    sign_out: "साइन आउट",
    sign_out_confirm: "क्या आप वाकई लॉग आउट करना चाहते हैं?",
    currently_managed: "वर्तमान में प्रबंधित पीजी",
    full_name: "पूरा नाम",
    email_address: "ईमेल पता",
    phone_number: "फ़ोन नंबर",
    pg_name: "पीजी का नाम",
    pg_address: "पीजी का पता",
    total_beds: "कुल बेड",
    joining_code: "ज्वाइनिंग कोड",
    house_rules: "घर के नियम",
    wifi_networks: "वाईफाई नेटवर्क",
    gate_timings: "गेट का समय",
    gate_opens: "गेट खुलता है",
    gate_closes: "गेट बंद होता है",
    emergency_contact: "आपातकालीन संपर्क",
    add_floor: "मंजिल जोड़ें",
    select_property: "संपत्ति चुनें",
    language_selection: "ऐप की भाषा",

    // Approvals Screen
    approvals_title: "निवासी स्वीकृति",
    pending_approvals: "लंबित कतार",
    approve: "निवासी को स्वीकृत करें",
    decline: "अस्वीकार करें",
    no_approvals: "कोई लंबित अनुरोध नहीं",
    room_number: "कमरा नंबर",
    bed_number: "बेड नंबर",
    joining_code_instruction: "निवासियों को शामिल होने का अनुरोध सबमिट करने के लिए अपने ऐप में यही कोड दर्ज करना होगा। लंबित अनुरोध नीचे दिखाई देंगे।",
    no_phone_provided: "कोई फ़ोन नंबर नहीं दिया गया",
    enter_reason_decline: "शामिल होने के अनुरोध को अस्वीकार करने का कारण दर्ज करें:",
    approved_success: "निवासी को सफलतापूर्वक स्वीकार कर लिया गया!",
    rejected_success: "अनुरोध सफलतापूर्वक अस्वीकार कर दिया गया।",

    // Weekly Food Planner
    food_planner_title: "साप्ताहिक भोजन योजना",
    select_week: "सप्ताह चुनें",
    select_day: "दिन चुनें",
    week: "सप्ताह",
    repeat_week: "इस सप्ताह के मेनू को दोहराएं",
    repeat_all_weeks: "सभी हफ़्तों के लिए दोहराएं",
    repeat_all_weeks_sub: "इस दिन के मेनू को सप्ताह 1-4 पर लागू करें",
    diet_type: "आहार प्रकार",
    veg: "शाकाहारी",
    non_veg: "मांसाहारी",
    breakfast: "नाश्ता",
    lunch: "दोपहर का भोजन",
    dinner: "रात का खाना",
    breakfast_menu: "नाश्ते का मेनू",
    lunch_menu: "दोपहर के भोजन का मेनू",
    dinner_menu: "रात के भोजन का मेनू",
    save_weekly_menu: "सापचारिक मेनू सहेजें",
    select_property_first: "कृपया पहले एक संपत्ति चुनें।",
    menu_applied_all_weeks: "मेनू सभी 4 हफ़्तों पर लागू किया गया!",
    menu_saved_success: "मेनू सफलतापूर्वक सहेजा गया!",
    mon: "सोमवार",
    tue: "मंगलवार",
    wed: "बुधवार",
    thu: "गुरुवार",
    fri: "शुक्रवार",
    sat: "शनिवार",
    sun: "रविवार",
  },
  ta: {
    // Tamil
    cancel: "ரத்து செய்",
    save: "சேமி",
    save_changes: "மாற்றங்களைச் சேமி",
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    success: "வெற்றி",
    edit: "திருத்து",
    delete: "அழி",
    add: "சேர்",
    active: "செயலில்",
    inactive: "செயலற்றது",

    // Login Screen
    login_title: "திஹோஸ்ட்.",
    login_subtitle: "பிரீமியம் சொத்து மேலாண்மை",
    email_placeholder: "மின்னஞ்சல் முகவரி",
    password_placeholder: "கடவுச்சொல்",
    sign_in: "உள்நுழைக",
    try_demo: "டெமோ கணக்கை முயற்சிக்கவும்",
    login_error_missing: "தொடர மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்",
    login_error_failed: "உள்நுழைவு தோல்வியடைந்தது. இணைப்பைச் சரிபார்க்கவும்.",
    platform_version: "திஹோஸ்ட் தளம் v1.0",

    // Navigation & Tabs
    tab_home: "முகப்பு",
    tab_tenants: "வாடகைதாரர்கள்",
    tab_payments: "பணம் செலுத்துதல்",
    tab_expenses: "செலவுகள்",
    tab_profile: "சுயவிவரம்",

    // Dashboard
    dashboard_title: "டாஷ்போர்டு",
    good_morning: "காலை வணக்கம்",
    select_property_label: "சொத்தைத் தேர்ந்தெடு",
    add_payment: "பணம் சேர்",
    manage_expenses: "செலவுகளை நிர்வகி",
    manage_tenants: "வாடகைதாரர்களை நிர்வகி",
    view_reports: "அறிக்கைகளைப் பார்",
    send_reminders: "நினைவூட்டல்களை அனுப்பு",
    properties: "சொத்துக்கள்",
    new: "புதியது",
    selected: "தேர்ந்தெடுக்கப்பட்டது",
    load_more: "மேலும் ஏற்றுக",
    no_properties: "சொத்துக்கள் எதுவும் இல்லை",
    no_transactions: "சமீபத்திய பரிவர்த்தனைகள் இல்லை",
    ask_ai: "AI-யிடம் கேள்",
    beds_count: "படுக்கைகள்",
    managed_pgs: "நிர்வகிக்கப்படும் PG-க்கள்",
    occupancy: "ஆக்கிரமிப்பு",
    monthly_revenue: "மாதாந்திர வருவாய்",
    collected_rent: "வசூலான வாடகை",
    pending_rent: "நிலுவையில் உள்ள வாடகை",
    total_expenses: "மொத்த செலவுகள்",
    quick_stats: "விரைவு புள்ளிவிவரங்கள்",
    financial_overview: "நிதி கண்ணோட்டம்",
    occupancy_rate: "ஆக்கிரமிப்பு விகிதம்",
    beds_occupied: "ஆக்கிரமிக்கப்பட்ட படுக்கைகள்",
    rent_collection: "வாடகை வசூல்",
    expense_ratio: "செலவு விகிதம்",

    // Tenants
    tenants_title: "வாடகைதாரர்கள் வரிசை",
    search_tenants: "பெயர், அறை எண்ணை வைத்து தேடவும்...",
    no_tenants: "இந்த சொத்தில் வாடகைதாரர்கள் யாரும் இல்லை.",
    rent_due: "வாடகை நிலுவை",
    paid: "செலுத்தப்பட்டது",
    pending: "நிலுவையில் உள்ளது",
    room: "அறை",
    bed: "படுக்கை",
    phone: "தொலைபேசி",
    email: "மின்னஞ்சல்",
    joining_date: "சேர்ந்த தேதி",
    status: "நிலை",

    // Tenant Details
    tenant_details: "வாடகைதாரர் விவரங்கள்",
    personal_details: "தனிப்பட்ட விவரங்கள்",
    lease_details: "குத்தகை விவரங்கள்",
    room_allotment: "அறை ஒதுக்கீடு",
    payment_history: "பணம் செலுத்திய வரலாறு",
    contact_info: "தொடர்பு தகவல்",

    // Payments
    payments_title: "பணம் மற்றும் வாடகை",
    record_payment: "பணம் செலுத்துதலைப் பதிவுசெய்",
    amount: "தொகை",
    date: "தேதி",
    payment_method: "பணம் செலுத்தும் முறை",
    select_tenant: "வாடகைதாரரைத் தேர்ந்தெடு",
    payment_success: "பணம் செலுத்துதல் வெற்றிகரமாகப் பதிவுசெய்யப்பட்டது",

    // Expenses
    expenses_title: "செலவு கண்காணிப்பு",
    add_expense: "செலவைச் சேர்",
    expense_category: "வகை",
    expense_amount: "தொகை",
    expense_date: "தேதி",
    expense_description: "விளக்கம்",
    expense_success: "செலவு வெற்றிகரமாகப் பதிவுசெய்யப்பட்டது",

    // Profile Screen
    profile_title: "சுயவிவரம்",
    personal_info: "தனிப்பட்ட தகவல்",
    property_info: "சொத்து விவரம்",
    wifi_curfew: "வைஃபை & ஊரடங்கு",
    management: "மேலாண்மை",
    resident_join_requests: "குடியிருப்பாளர் சேர்க்கை கோரிக்கைகள்",
    resident_join_sub: "விண்ணப்பங்களை ஏற்கவும் அல்லது நிராகரிக்கவும்",
    weekly_food_planner: "வாராந்திர உணவுத் திட்டம்",
    weekly_food_sub: "தினசரி உணவு மற்றும் உணவு வகைகளை நிர்வகிக்கவும்",
    sign_out: "வெளியேறு",
    sign_out_confirm: "நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?",
    currently_managed: "தற்போது நிர்வகிக்கப்படும் PG",
    full_name: "முழு பெயர்",
    email_address: "மின்னஞ்சல் முகவரி",
    phone_number: "தொலைபேசி எண்",
    pg_name: "PG பெயர்",
    pg_address: "PG முகவரி",
    total_beds: "மொத்த படுக்கைகள்",
    joining_code: "இணைப்பு குறியீடு",
    house_rules: "வீட்டு விதிகள்",
    wifi_networks: "வைஃபை நெட்வொர்க்குகள்",
    gate_timings: "கேட் நேரங்கள்",
    gate_opens: "கேட் திறக்கும் நேரம்",
    gate_closes: "கேட் மூடும் நேரம்",
    emergency_contact: "அவசர தொடர்பு",
    add_floor: "மடியைச் சேர்",
    select_property: "சொத்தைத் தேர்ந்தெடு",
    language_selection: "பயன்பாட்டு மொழி",

    // Approvals Screen
    approvals_title: "குடியிருப்பாளர் ஒப்புதல்கள்",
    pending_approvals: "நிலுவையில் உள்ள வரிசை",
    approve: "குடியிருப்பாளரை ஒப்புதல் செய்",
    decline: "நிராகரி",
    no_approvals: "நிலுவையில் உள்ள சேர்க்கை கோரிக்கைகள் இல்லை",
    room_number: "அறை எண்",
    bed_number: "படுக்கை எண்",
    joining_code_instruction: "சேர்க்கை கோரிக்கையை சமர்ப்பிக்க குடியிருப்பாளர்கள் இந்த துல்லியமான குறியீட்டை தங்கள் பயன்பாட்டில் உள்ளிட வேண்டும். நிலுவையில் உள்ள கோரிக்கைகள் கீழே தோன்றும்.",
    no_phone_provided: "தொலைபேசி எண் வழங்கப்படவில்லை",
    enter_reason_decline: "சேர்க்கை கோரிக்கையை நிராகரிப்பதற்கான காரணத்தை உள்ளிடவும்:",
    approved_success: "குடியிருப்பாளர் வெற்றிகரமாக அங்கீகரிக்கப்பட்டார்!",
    rejected_success: "கோரிக்கை வெற்றிகரமாக நிராகரிக்கப்பட்டது.",

    // Weekly Food Planner
    food_planner_title: "வாராந்திர உணவுத் திட்டம்",
    select_week: "வாரத்தைத் தேர்ந்தெடு",
    select_day: "நாளைத் தேர்ந்தெடு",
    week: "வாரம்",
    repeat_week: "இந்த வார மெனுவை மீண்டும் செய்யவும்",
    repeat_all_weeks: "அனைத்து வாரங்களுக்கும் மீண்டும் செய்யவும்",
    repeat_all_weeks_sub: "இந்த நாளின் மெனுவை 1-4 வாரங்களுக்குப் பயன்படுத்துங்கள்",
    diet_type: "உணவு வகை",
    veg: "சைவம்",
    non_veg: "அசைவம்",
    breakfast: "காலை உணவு",
    lunch: "மதிய உணவு",
    dinner: "இரவு உணவு",
    breakfast_menu: "காலை உணவு மெனு",
    lunch_menu: "மதிய உணவு மெனு",
    dinner_menu: "இரவு உணவு மெனு",
    save_weekly_menu: "வாராந்திர மெனுவைச் சேமி",
    select_property_first: "தயவுசெய்து முதலில் ஒரு சொத்தைத் தேர்ந்தெடுக்கவும்.",
    menu_applied_all_weeks: "மெனு அனைத்து 4 வாரங்களுக்கும் பயன்படுத்தப்பட்டது!",
    menu_saved_success: "மெனு வெற்றிகரமாக சேமிக்கப்பட்டது!",
    mon: "திங்கள்",
    tue: "செவ்வாய்",
    wed: "புதன்",
    thu: "வியாழன்",
    fri: "வெள்ளி",
    sat: "சனி",
    sun: "ஞாயிறு",
  },
  te: {
    // Telugu
    cancel: "రద్దు చేయి",
    save: "సేవ్ చేయి",
    save_changes: "మార్పులను సేవ్ చేయి",
    loading: "ಲೋಡ್ అవుతోంది...",
    error: "తప్పు",
    success: "విజయం",
    edit: "ఎడిట్ చేయి",
    delete: "తొలగించు",
    add: "జోడించు",
    active: "క్రియాశీలకంగా ఉంది",
    inactive: "క్రియాశీలకంగా లేదు",

    // Login Screen
    login_title: "திஹோஸ்ட்.",
    login_subtitle: "ప్రీమియం ఆస్తి నిర్వహణ",
    email_placeholder: "ఈమెయిల్ చిరునామా",
    password_placeholder: "పాస్వర్డ్",
    sign_in: "సైన్ ఇన్",
    try_demo: "డెమో ఖాతాను ప్రయత్నించండి",
    login_error_missing: "కొనసాగడానికి ఈమెయిల్ మరియు పాస్వర్డ్ నమోదు చేయండి",
    login_error_failed: "లాగిన్ విఫలమైంది. మీ కనెక్షన్‌ను తనిఖీ చేయండి.",
    platform_version: "దిహోస్ట్ ప్లాట్‌ఫారమ్ v1.0",

    // Navigation & Tabs
    tab_home: "హోమ్",
    tab_tenants: "టెనెంట్లు",
    tab_payments: "చెల్లింపులు",
    tab_expenses: "ఖర్చులు",
    tab_profile: "ప్రొఫైల్",

    // Dashboard
    dashboard_title: "డ్యాష్‌బోర్డ్",
    good_morning: "శుభోదయం",
    select_property_label: "ఆస్తిని ఎంచుకోండి",
    add_payment: "చెల్లింపును జోడించండి",
    manage_expenses: "ఖర్చులను నిర్వహించండి",
    manage_tenants: "టెనెంట్లను నిర్వహించండి",
    view_reports: "నివేదికలను చూడండి",
    send_reminders: "రిమైండర్లను పంపండి",
    properties: "ఆస్తులు",
    new: "కొత్త",
    selected: "ఎంచుకోబడింది",
    load_more: "మరిన్ని లోడ్ చేయి",
    no_properties: "ఎలాంటి ఆస్తులు కనుగొనబడలేదు",
    no_transactions: "ఇటీవలి లావాదేవీలు లేవు",
    ask_ai: "AI ని అడగండి",
    beds_count: "పడకలు",
    managed_pgs: "నిర్వహించబడుతున్న PGలు",
    occupancy: "ఆక్యుపెన్సీ",
    monthly_revenue: "నెలవారీ రాబడి",
    collected_rent: "వసూలైన అద్దె",
    pending_rent: "పెండింగ్ అద్దె",
    total_expenses: "మొత్తం ఖర్చులు",
    quick_stats: "త్వరిత గణాంకాలు",
    financial_overview: "ఆర్థిక అవలోకనం",
    occupancy_rate: "ఆక్యుపెన్సీ రేటు",
    beds_occupied: "ఆక్రమించబడిన పడకలు",
    rent_collection: "అద్దె వసూలు",
    expense_ratio: "ఖర్చుల నిష్పత్తి",

    // Tenants
    tenants_title: "టెనెంట్ల క్యూ",
    search_tenants: "పేరు లేదా రూమ్ నంబర్ ద్వారా శోధించండి...",
    no_tenants: "ఈ ఆస్తిలో టెనెంట్లు ఎవరూ లేరు.",
    rent_due: "అద్దె బాకీ",
    paid: "చెల్లించబడింది",
    pending: "పెండింగ్",
    room: "గది",
    bed: "బెడ్",
    phone: "ఫోన్",
    email: "ఈమెయిల్",
    joining_date: "చేరిన తేదీ",
    status: "స్థితి",

    // Tenant Details
    tenant_details: "టెనెంట్ వివరాలు",
    personal_details: "వ్యక్తిగత వివరాలు",
    lease_details: "లీజు వివరాలు",
    room_allotment: "గది కేటాయింపు",
    payment_history: "చెల్లింపుల చరిత్ర",
    contact_info: "సంప్రదింపు సమాచారం",

    // Payments
    payments_title: "చెల్లింపులు మరియు అద్దె",
    record_payment: "చెల్లింపును రికార్డ్ చేయి",
    amount: "మొత్తం",
    date: "తేదీ",
    payment_method: "చెల్లింపు విధానం",
    select_tenant: "టెనెంట్‌ను ఎంచుకోండి",
    payment_success: "చెల్లింపు విజయవంతంగా నమోదు చేయబడింది",

    // Expenses
    expenses_title: "ఖర్చుల ట్రాకర్",
    add_expense: "ఖర్చును జోడించు",
    expense_category: "వర్గం",
    expense_amount: "మొత్తం",
    expense_date: "తేదీ",
    expense_description: "వివరణ",
    expense_success: "ఖర్చు విజయవంతంగా నమోదు చేయబడింది",

    // Profile Screen
    profile_title: "ప్రొఫైల్",
    personal_info: "వ్యక్తిగత సమాచారం",
    property_info: "ఆస్తి సమాచారం",
    wifi_curfew: "వైఫై & కర్ఫ్యూ",
    management: "నిర్వహణ",
    resident_join_requests: "నివాసి చేరిక అభ్యర్థనలు",
    resident_join_sub: "చేరిక అభ్యర్థనలను ఆమోదించండి లేదా తిరస్కరించండి",
    weekly_food_planner: "వారపు భోజన ప్రణాళిక",
    weekly_food_sub: "రోజువారీ భోజనాలు మరియు ఆహార రకాలను నిర్వహించండి",
    sign_out: "సైన్ అవుట్",
    sign_out_confirm: "మీరు ఖచ్చితంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?",
    currently_managed: "ప్రస్తుతం నిర్వహిస్తున్న PG",
    full_name: "పూర్తి పేరు",
    email_address: "ఈమెయిల్ చిరునామా",
    phone_number: "ఫోన్ నంబర్",
    pg_name: "PG పేరు",
    pg_address: "PG చిరునామా",
    total_beds: "మొత్తం పడకలు",
    joining_code: "చేరిక కోడ్",
    house_rules: "ఇంటి నిబంధనలు",
    wifi_networks: "వైఫై నెట్‌వర్క్‌లు",
    gate_timings: "గేట్ సమయాలు",
    gate_opens: "గేట్ తెరుచు సమయం",
    gate_closes: "గేట్ మూసివేయు సమయం",
    emergency_contact: "అత్యవసర సంప్రదింపు",
    add_floor: "మంతస్తును జోడించండి",
    select_property: "ఆస్తిని ఎంచుకోండి",
    language_selection: "యాప్ భాష",

    // Approvals Screen
    approvals_title: "నివాసి ఆమోదాలు",
    pending_approvals: "పెండింగ్ క్యూ",
    approve: "నివాసిని ఆమోదించు",
    decline: "తిరస్కరించు",
    no_approvals: "పెండింగ్ చేరిక అభ్యర్థనలు లేవు",
    room_number: "రూమ్ నంబర్",
    bed_number: "బెడ్ నంబర్",
    joining_code_instruction: "చేరిక అభ్యర్థనను సమర్పించడానికి నివాసితులు వారి యాప్‌లో ఈ ఖచ్చితమైన కోడ్‌ను నమోదు చేయాలి. పెండింగ్ అభ్యర్థనలు క్రింద కనిపిస్తాయి.",
    no_phone_provided: "ఫోన్ నంబర్ అందించబడలేదు",
    enter_reason_decline: "చేరిక అభ్యర్థనను తిరస్కరించడానికి కారణాన్ని నమోదు చేయండి:",
    approved_success: "నివాసి విజయవంతంగా ఆమోదించబడ్డారు!",
    rejected_success: "అభ్యర్థన విజయవంతంగా తిరస్కరించబడింది.",

    // Weekly Food Planner
    food_planner_title: "వారపు భోజన ప్రణాళిక",
    select_week: "వారాన్ని ఎంచుకోండి",
    select_day: "రోజును ఎంచుకోండి",
    week: "వారం",
    repeat_week: "ఈ వారం మెనూను పునరావృతం చేయి",
    repeat_all_weeks: "అన్ని వారాలకూ పునరావృతం చేయి",
    repeat_all_weeks_sub: "ఈ రోజు మెనూను 1-4 వారాలకూ వర్తింపజేయి",
    diet_type: "ఆహార రకం",
    veg: "శాకాహారం",
    non_veg: "మాంసాహారం",
    breakfast: "అల్పాహారం",
    lunch: "మధ్యాహ్న భోజనం",
    dinner: "రాత్రి భోజనం",
    breakfast_menu: "అల్పాహారం మెనూ",
    lunch_menu: "మధ్యాహ్న భోజనం మెనూ",
    dinner_menu: "రాత్రి భోజనం మెనూ",
    save_weekly_menu: "వారపు మెనూను సేవ్ చేయి",
    select_property_first: "దయచేసి మొదట ఆస్తిని ఎంచుకోండి.",
    menu_applied_all_weeks: "మెనూ అన్ని 4 వారాలకూ వర్తింపజేయబడింది!",
    menu_saved_success: "మెనూ విజయవంతంగా సేవ్ చేయబడింది!",
    mon: "సోమవారం",
    tue: "మంగళవారం",
    wed: "बुధవారం",
    thu: "గురువారం",
    fri: "శుక్రవారం",
    sat: "శనివారం",
    sun: "ఆదివారం",
  },
  kn: {
    // Kannada
    cancel: "ರದ್ದುಮಾಡು",
    save: "ಉಳಿಸು",
    save_changes: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸು",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    error: "ದೋಷ",
    success: "ಯಶಸ್ಸು",
    edit: "ಎಡಿಟ್ ಮಾಡು",
    delete: "ಅಳಿಸು",
    add: "ಸೇರಿಸು",
    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",

    // Login Screen
    login_title: "திஹோஸ்ட்.",
    login_subtitle: "ಪ್ರೀಮಿಯಂ ಆಸ್ತಿ ನಿರ್ವಹಣೆ",
    email_placeholder: "ಇಮೇಲ್ ವಿಳಾಸ",
    password_placeholder: "ಪಾಸ್‌ವರ್ಡ್",
    sign_in: "ಸೈನ್ ಇನ್",
    try_demo: "ಡೆಮೊ ಖಾತೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ",
    login_error_missing: "ಮುಂದುವರಿಯಲು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    login_error_failed: "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ.",
    platform_version: "ದಿಹೋಸ್ಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ v1.0",

    // Navigation & Tabs
    tab_home: "ಮುಖಪುಟ",
    tab_tenants: "ಬಾಡಿಗೆದಾರರು",
    tab_payments: "ಪಾವತಿಗಳು",
    tab_expenses: "ವೆಚ್ಚಗಳು",
    tab_profile: "ಪ್ರೊಫೈಲ್",

    // Dashboard
    dashboard_title: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    good_morning: "ಶುಭೋದಯ",
    select_property_label: "ಆಸ್ತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    add_payment: "ಪಾವತಿಯನ್ನು ಸೇರಿಸಿ",
    manage_expenses: "ವೆಚ್ಚಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    manage_tenants: "ಬಾಡಿಗೆದಾರರನ್ನು ನಿರ್ವಹಿಸಿ",
    view_reports: "ವರದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    send_reminders: "ಜ್ಞಾಪನೆಗಳನ್ನು ಕಳುಹಿಸಿ",
    properties: "ಆಸ್ತಿಗಳು",
    new: "ಹೊಸ",
    selected: "ಆಯ್ದ",
    load_more: "ಇನ್ನಷ್ಟು ಲೋಡ್ ಮಾಡು",
    no_properties: "ಯಾವುದೇ ಆಸ್ತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    no_transactions: "ಯಾವುದೇ ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳಿಲ್ಲ",
    ask_ai: "AI ಗೆ ಕೇಳಿ",
    beds_count: "ಹಾಸಿಗೆಗಳು",
    managed_pgs: "ನಿರ್ವಹಿಸಲಾದ PGಗಳು",
    occupancy: "ಆಕ್ಯುಪೆನ್ಸಿ",
    monthly_revenue: "ಮಾಸಿಕ ಆದಾಯ",
    collected_rent: "ಸಂಗ್ರಹಿಸಿದ ಬಾಡಿಗೆ",
    pending_rent: "ಬಾಕಿ ಇರುವ ಬಾಡಿಗೆ",
    total_expenses: "ಒಟ್ಟು ವೆಚ್ಚಗಳು",
    quick_stats: "ತ್ವರಿತ ಅಂಕಿಅಂಶಗಳು",
    financial_overview: "ಹಣಕಾಸು ಅವಲೋಕನ",
    occupancy_rate: "ಆಕ್ಯುಪೆನ್ಸಿ ದರ",
    beds_occupied: "ಆಕ್ರಮಿತ ಹಾಸಿಗೆಗಳು",
    rent_collection: "ಬಾಡಿಗೆ ಸಂಗ್ರಹ",
    expense_ratio: "ವೆಚ್ಚದ ಅನುಪಾತ",

    // Tenants
    tenants_title: "ಬಾಡಿಗೆದಾರರ ಕ್ಯೂ",
    search_tenants: "ಹೆಸರು ಅಥವಾ ರೂಮ್ ನಂಬರ್ ಮೂಲಕ ಹುಡುಕಿ...",
    no_tenants: "ಈ ಆಸ್ತಿಯಲ್ಲಿ ಬಾಡಿಗೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ.",
    rent_due: "ಬಾಡಿಗೆ ಬಾಕಿ",
    paid: "ಪಾವತಿಸಲಾಗಿದೆ",
    pending: "ಬಾಕಿ",
    room: "ಕೊಠಡಿ",
    bed: "ಹಾಸಿಗೆ",
    phone: "ದೂರವಾಣಿ",
    email: "ಇಮೇಲ್",
    joining_date: "ಸೇರಿದ ದಿನಾಂಕ",
    status: "ಸ್ಥಿತಿ",

    // Tenant Details
    tenant_details: "ಬಾಡಿಗೆದಾರರ ವಿವರಗಳು",
    personal_details: "ವೈಯಕ್ತಿಕ ವಿವರಗಳು",
    lease_details: "ಗುತ್ತಿಗೆ ವಿವರಗಳು",
    room_allotment: "ಕೊಠಡಿ ಹಂಚಿಕೆ",
    payment_history: "ಪಾವತಿ ಇತಿಹಾಸ",
    contact_info: "ಸಂಪರ್ಕ ಮಾಹಿತಿ",

    // Payments
    payments_title: "ಪಾವತಿಗಳು ಮತ್ತು ಬಾಡಿಗೆ",
    record_payment: "ಪಾವತಿಯನ್ನು ದಾಖಲಿಸು",
    amount: "ಮೊತ್ತ",
    date: "ದಿನಾಂಕ",
    payment_method: "ಪಾವತಿ ವಿಧಾನ",
    select_tenant: "ಬಾಡಿಗೆದಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    payment_success: "ಪಾವತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ",

    // Expenses
    expenses_title: "ವೆಚ್ಚ ಟ್ರ್ಯಾಕರ್",
    add_expense: "ವೆಚ್ಚವನ್ನು ಸೇರಿಸು",
    expense_category: "ವರ್ಗ",
    expense_amount: "ಮೊತ್ತ",
    expense_date: "ದಿನಾಂಕ",
    expense_description: "ವಿವರಣೆ",
    expense_success: "ವೆಚ್ಚವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ",

    // Profile Screen
    profile_title: "ಪ್ರೊಫೈಲ್",
    personal_info: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
    property_info: "ಆಸ್ತಿ ಮಾಹಿತಿ",
    wifi_curfew: "ವೈಫೈ ಮತ್ತು ಕರ್ಫ್ಯೂ",
    management: "ನಿರ್ವಹಣೆ",
    resident_join_requests: "ನಿವಾಸಿ ಸೇರ್ಪಡೆ ವಿನಂತಿಗಳು",
    resident_join_sub: "ಸೇರ್ಪಡೆ ವಿನಂತಿಗಳನ್ನು ಅನುಮೋದಿಸಿ ಅಥವಾ ತಿರಸ್ಕರಿಸಿ",
    weekly_food_planner: "ವಾರದ ಆಹಾರ ಯೋಜಕ",
    weekly_food_sub: "ದೈನಂದಿನ ಊಟ ಮತ್ತು ಆಹಾರದ ಪ್ರಕಾರಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    sign_out: "ಸೈನ್ ಔಟ್",
    sign_out_confirm: "ನೀವು ನಿಜವಾಗಿಯೂ ಸೈನ್ ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ?",
    currently_managed: "ಪ್ರಸ್ತುತ ನಿರ್ವಹಿಸಲಾಗುತ್ತಿರುವ PG",
    full_name: "ಪೂರ್ಣ ಹೆಸರು",
    email_address: "ಇಮೇಲ್ ವಿಳಾಸ",
    phone_number: "ಫೋನ್ ಸಂಖ್ಯೆ",
    pg_name: "PG ಹೆಸರು",
    pg_address: "PG ವಿಳಾಸ",
    total_beds: "ಒಟ್ಟು ಹಾಸಿಗೆಗಳು",
    joining_code: "ಸೇರ್ಪಡೆ ಕೋಡ್",
    house_rules: "ಮನೆಯ ನಿಯಮಗಳು",
    wifi_networks: "ವೈಫೈ ನೆಟ್‌ವರ್ಕ್‌ಗಳು",
    gate_timings: "ಗೇಟ್ ಸಮಯಗಳು",
    gate_opens: "ಗೇಟ್ ತೆರೆಯುವ ಸಮಯ",
    gate_closes: "ಗೇಟ್ ಮುಚ್ಚುವ ಸಮಯ",
    emergency_contact: "ತುರ್ತು ಸಂಪರ್ಕ",
    add_floor: "ಮಹಡಿಯನ್ನು ಸೇರಿಸಿ",
    select_property: "ಆಸ್ತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    language_selection: "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ",

    // Approvals Screen
    approvals_title: "ನಿವಾಸಿ ಅನುಮೋದನೆಗಳು",
    pending_approvals: "ಬಾಕಿ ಇರುವ ಕ್ಯೂ",
    approve: "ನಿವಾಸಿಯನ್ನು ಅನುಮೋದಿಸಿ",
    decline: "ತಿರಸ್ಕರಿಸಿ",
    no_approvals: "ಯಾವುದೇ ಬಾಕಿ ಇರುವ ವಿನಂತಿಗಳಿಲ್ಲ",
    room_number: "ರೂಮ್ ಸಂಖ್ಯೆ",
    bed_number: "ಬೆಡ್ ಸಂಖ್ಯೆ",
    joining_code_instruction: "ಸೇರ್ಪಡೆ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲು ನಿವಾಸಿಗಳು ತಮ್ಮ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಈ ನಿಖರವಾದ ಕೋಡ್ ಅನ್ನು ನಮೂದಿಸಬೇಕು. ಬಾಕಿ ಇರುವ ವಿನಂತಿಗಳು ಕೆಳಗೆ ಗೋಚರಿಸುತ್ತವೆ.",
    no_phone_provided: "ಯಾವುದೇ ಫೋನ್ ಸಂಖ್ಯೆ ಒದಗಿಸಲಾಗಿಲ್ಲ",
    enter_reason_decline: "ಸೇರ್ಪಡೆ ವಿನಂತಿಯನ್ನು తిరಸ್ಕರಿಸಲು ಕಾರಣವನ್ನು ನಮೂದಿಸಿ:",
    approved_success: "ನಿವಾಸಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ!",
    rejected_success: "ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ.",

    // Weekly Food Planner
    food_planner_title: "ವಾರದ ಆಹಾರ ಯೋಜಕ",
    select_week: "ವಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    select_day: "ದಿನವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    week: "ವಾರ",
    repeat_week: "ಈ ವಾರದ ಮೆನುವನ್ನು ಪುನರಾವರ್ತಿಸಿ",
    repeat_all_weeks: "ಎಲ್ಲಾ ವಾರಗಳಿಗೂ ಪುನರಾವರ್ತಿಸಿ",
    repeat_all_weeks_sub: "ಈ ದಿನದ ಮೆನುವನ್ನು 1-4 ವಾರಗಳಿಗೆ ಅನ್ವಯಿಸಿ",
    diet_type: "ಆಹಾರದ ಪ್ರಕಾರ",
    veg: "ಸಸ್ಯಾಹಾರ",
    non_veg: "ಮಾಂಸಾಹಾರ",
    breakfast: "ಉಪಹಾರ",
    lunch: "ಮಧ್ಯಾಹ್ನದ ಊಟ",
    dinner: "ರಾತ್ರಿಯ ಊಟ",
    breakfast_menu: "ಉಪಹಾರ ಮೆನು",
    lunch_menu: "ಮಧ್ಯಾಹ್ನದ ಊಟದ ಮೆನು",
    dinner_menu: "ರಾತ್ರಿಯ ಊಟದ ಮೆನು",
    save_weekly_menu: "ವಾರದ ಮೆನುವನ್ನು ಉಳಿಸಿ",
    select_property_first: "ದಯವಿಟ್ಟು ಮೊದಲು ಆಸ್ತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    menu_applied_all_weeks: "ಮೆನುವನ್ನು ಎಲ್ಲಾ 4 ವಾರಗಳಿಗೆ ಅನ್ವಯಿಸಲಾಗಿದೆ!",
    menu_saved_success: "ಮೆನುವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
    mon: "ಸೋಮವಾರ",
    tue: "ಮಂಗಳವಾರ",
    wed: "ಬುಧವಾರ",
    thu: "ಗುರುವಾರ",
    fri: "ಶುಕ್ರವಾರ",
    sat: "ಶನಿವಾರ",
    sun: "ಭಾನುವಾರ",
  },
  ml: {
    // Malayalam
    cancel: "റദ്ദാക്കുക",
    save: "സൂക്ഷിക്കുക",
    save_changes: "മാറ്റങ്ങൾ സൂക്ഷിക്കുക",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    error: "പിശക്",
    success: "വിജയം",
    edit: "തിരുത്തുക",
    delete: "ഒഴിവാക്കുക",
    add: "ചേർക്കുക",
    active: "സജീവം",
    inactive: "നിഷ്ക്രിയം",

    // Login Screen
    login_title: "திஹோஸ்ட்.",
    login_subtitle: "പ്രീമിയം പ്രോപ്പർട്ടി മാനേജ്മെന്റ്",
    email_placeholder: "ഇമെയിൽ വിലാസം",
    password_placeholder: "പാസ്‌വേഡ്",
    sign_in: "സൈൻ ഇൻ",
    try_demo: "ഡെമോ അക്കൗണ്ട് പരീക്ഷിക്കുക",
    login_error_missing: "തുടരുന്നതിന് ഇമെയിലും പാസ്‌വേഡും നൽകുക",
    login_error_failed: "ലോഗിൻ പരാജയപ്പെട്ടു. കണക്ഷൻ പരിശോധിക്കുക.",
    platform_version: "ദിഹോസ്റ്റ് പ്ലാറ്റ്‌ഫോം v1.0",

    // Navigation & Tabs
    tab_home: "ഹോം",
    tab_tenants: "താമസക്കാർ",
    tab_payments: "പേയ്‌മെന്റുകൾ",
    tab_expenses: "ചെലവുകൾ",
    tab_profile: "പ്രൊഫൈൽ",

    // Dashboard
    dashboard_title: "ഡാഷ്‌ബോർഡ്",
    good_morning: "ശുഭപ്രഭാതം",
    select_property_label: "പ്രോപ്പർട്ടി തിരഞ്ഞെടുക്കുക",
    add_payment: "പേയ്‌മെന്റ് ചേർക്കുക",
    manage_expenses: "ചെലവുകൾ കൈകാര്യം ചെയ്യുക",
    manage_tenants: "താമസക്കാരെ കൈകാര്യം ചെയ്യുക",
    view_reports: "റിപ്പോർട്ടുകൾ കാണുക",
    send_reminders: "ഓർമ്മപ്പെടുത്തലുകൾ അയക്കുക",
    properties: "പ്രോപ്പർട്ടികൾ",
    new: "പുതിയത്",
    selected: "തിരഞ്ഞെടുത്തു",
    load_more: "കൂടുതൽ ലോഡ് ചെയ്യുക",
    no_properties: "പ്രോപ്പർട്ടികൾ ഒന്നും കണ്ടെത്തിയില്ല",
    no_transactions: "സമീപകാല ഇടപാടുകൾ ഒന്നുമില്ല",
    ask_ai: "AI-യോട് ചോദിക്കുക",
    beds_count: "കട്ടിലുകൾ",
    managed_pgs: "കൈകാര്യം ചെയ്യുന്ന PGകൾ",
    occupancy: "ഒക്യുപൻസി",
    monthly_revenue: "പ്രതിമാസ വരുമാനം",
    collected_rent: "ശേഖരിച്ച വാടക",
    pending_rent: "കുടിശ്ശികയുള്ള വാടക",
    total_expenses: "ആകെ ചെലവുകൾ",
    quick_stats: "ദ്രുത സ്ഥിതിവിവരക്കണക്കുകൾ",
    financial_overview: "സാമ്പത്തിക അവലോകനം",
    occupancy_rate: "ഒക്യുപൻസി നിരക്ക്",
    beds_occupied: "താമസമുള്ള കട്ടിലുകൾ",
    rent_collection: "വാടക ശേഖരണം",
    expense_ratio: "ചെലവ് അനുപാതം",

    // Tenants
    tenants_title: "താമസക്കാരുടെ ക്യൂ",
    search_tenants: "പേര് അല്ലെങ്കിൽ റൂം നമ്പർ ഉപയോഗിച്ച് തിരയുക...",
    no_tenants: "ഈ പ്രോപ്പർട്ടിയിൽ താമസക്കാർ ആരുമില്ല.",
    rent_due: "വാടക കുടിശ്ശിക",
    paid: "അടച്ചു",
    pending: "ബാക്കി",
    room: "മുറി",
    bed: "കട്ടിൽ",
    phone: "ഫോൺ",
    email: "ഇമെയിൽ",
    joining_date: "ചേർന്ന തീയതി",
    status: "നില",

    // Tenant Details
    tenant_details: "താമസക്കാരന്റെ വിവരങ്ങൾ",
    personal_details: "വ്യക്തിഗത വിവരങ്ങൾ",
    lease_details: "ലീസ് വിവരങ്ങൾ",
    room_allotment: "മുറി അനുവദിക്കൽ",
    payment_history: "പേയ്‌മെന്റ് ചരിത്രം",
    contact_info: "ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ",

    // Payments
    payments_title: "പേയ്‌മെന്റുകളും വാടകയും",
    record_payment: "പേയ്‌മെന്റ് രേഖപ്പെടുത്തുക",
    amount: "തുക",
    date: "തീയതി",
    payment_method: "പേയ്‌മെന്റ് രീതി",
    select_tenant: "താമസക്കാരനെ തിരഞ്ഞെടുക്കുക",
    payment_success: "പേയ്‌മെന്റ് വിജയകരമായി രേഖപ്പെടുത്തി",

    // Expenses
    expenses_title: "ചെലവ് ട്രാക്കർ",
    add_expense: "ചെലവ് ചേർക്കുക",
    expense_category: "വിഭാഗം",
    expense_amount: "തുക",
    expense_date: "തീയതി",
    expense_description: "വിവരണം",
    expense_success: "ചെലവ് വിജയകരമായി രേഖപ്പെടുത്തി",

    // Profile Screen
    profile_title: "പ്രൊഫൈൽ",
    personal_info: "വ്യക്തിഗത വിവരങ്ങൾ",
    property_info: "പ്രോപ്പರ್ട്ടി വിവരങ്ങൾ",
    wifi_curfew: "വൈഫൈ & കർഫ്യൂ",
    management: "മാനേജ്മെന്റ്",
    resident_join_requests: "താമസക്കാരുടെ ചേരൽ വരികൾ",
    resident_join_sub: "അപേക്ഷകൾ അംഗീകരിക്കുകയോ നിരസിക്കുകയോ ചെയ്യുക",
    weekly_food_planner: "പ്രതിവാര ഭക്ഷണ പ്ലാനർ",
    weekly_food_sub: "ദൈനംദിന ഭക്ഷണവും ഭക്ഷണ രീതികളും കൈകാര്യം ചെയ്യുക",
    sign_out: "ലോഗ് ഔട്ട് ചെയ്യുക",
    sign_out_confirm: "തീർച്ചയായും ലോഗ് ഔട്ട് ചെയ്യണമെന്നുണ്ടോ?",
    currently_managed: "നിലവിൽ കൈകാര്യം ചെയ്യുന്ന PG",
    full_name: "മുഴുവൻ പേര്",
    email_address: "ഇമെയിൽ വിലാസം",
    phone_number: "ഫോൺ നമ്പർ",
    pg_name: "PG പേര്",
    pg_address: "PG വിലാസം",
    total_beds: "ആകെ കട്ടിലുകൾ",
    joining_code: "ജോയിനിംഗ് കോഡ്",
    house_rules: "വീട്ടുനിയമങ്ങൾ",
    wifi_networks: "വൈഫൈ നെറ്റ്‌വർക്കുകൾ",
    gate_timings: "ഗേറ്റ് സമയങ്ങൾ",
    gate_opens: "ഗേറ്റ് തുറക്കുന്ന സമയം",
    gate_closes: "ഗേറ്റ് അടയ്ക്കുന്ന സമയം",
    emergency_contact: "അടിയന്തിര സമ്പർക്കം",
    add_floor: "നില ചേർക്കുക",
    select_property: "പ്രോപ്പർട്ടി തിരഞ്ഞെടുക്കുക",
    language_selection: "ആപ്പ് ഭാഷ",

    // Approvals Screen
    approvals_title: "താമസക്കാരുടെ അംഗീകാരം",
    pending_approvals: "പെൻഡിംഗ് ക്യൂ",
    approve: "താമസക്കാരനെ അംഗീകരിക്കുക",
    decline: "നിരസിക്കുക",
    no_approvals: "പെൻഡിംഗ് അപേക്ഷകൾ ഒന്നുമില്ല",
    room_number: "റൂം നമ്പർ",
    bed_number: "കട്ടിൽ നമ്പർ",
    joining_code_instruction: "അപേക്ഷ സമർപ്പിക്കുന്നതിന് താമസക്കാർ അവരുടെ ആപ്പിൽ ഈ കോഡ് നൽകണം. അപേക്ഷകൾ താഴെ കാണാം.",
    no_phone_provided: "ഫോൺ നമ്പർ നൽകിയിട്ടില്ല",
    enter_reason_decline: "നിരസിക്കാനുള്ള കാരണം നൽകുക:",
    approved_success: "താമസക്കാരനെ വിജയകരമായി അംഗീകരിച്ചു!",
    rejected_success: "അപേക്ഷ വിജയകരമായി നിരസിച്ചു.",

    // Weekly Food Planner
    food_planner_title: "പ്രതിവാര ഭക്ഷണ പ്ലാനർ",
    select_week: "ആഴ്ച തിരഞ്ഞെടുക്കുക",
    select_day: "ദിവസം തിരഞ്ഞെടുക്കുക",
    week: "ആഴ്ച",
    repeat_week: "ഈ ആഴ്ചയിലെ മെനു ആവർത്തിക്കുക",
    repeat_all_weeks: "എല്ലാ ആഴ്ചകളിലേക്കും ആവർത്തിക്കുക",
    repeat_all_weeks_sub: "ഈ ദിവസത്തെ മെനു 1-4 ആഴ്ചകളിലേക്ക് ബാധകമാക്കുക",
    diet_type: "ഭക്ഷണ രീതി",
    veg: "സസ്യാഹാരം",
    non_veg: "മാംസാഹാരം",
    breakfast: "പ്രാതൽ",
    lunch: "ഉച്ചഭക്ഷണം",
    dinner: "അത്താഴം",
    breakfast_menu: "പ്രാതൽ മെനു",
    lunch_menu: "ഉച്ചഭക്ഷണ മെനു",
    dinner_menu: "അത്താഴ മെനു",
    save_weekly_menu: "പ്രതിവാര മെനു സൂക്ഷിക്കുക",
    select_property_first: "ദയവായി ആദ്യം ഒരു പ്രോപ്പർട്ടി തിരഞ്ഞെടുക്കുക.",
    menu_applied_all_weeks: "മെനു 4 ആഴ്ചകളിലേക്കും ബാധകമാക്കി!",
    menu_saved_success: "മെനു വിജയകരമായി സൂക്ഷിച്ചു!",
    mon: "തിങ്കൾ",
    tue: "ചൊവ്വ",
    wed: "ബുധൻ",
    thu: "വ്യാഴം",
    fri: "വെള്ളി",
    sat: "ശനി",
    sun: "ഞായർ",
  }
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<LocaleType>("en");
  const [showPrompt, setShowPrompt] = useState(false);
  const [suggestedLocale, setSuggestedLocale] = useState<LocaleType | null>(null);
  const [regionName, setRegionName] = useState("");

  const setLocaleAndPersist = async (newLocale: LocaleType) => {
    setLocale(newLocale);
    try {
      await AsyncStorage.setItem("@user_language_preference", newLocale);
    } catch (e) {
      console.warn("Failed to persist language preference:", e);
    }
  };

  // Detect locale automatically on load with IP geo-lookup, defaulting ALWAYS to English
  useEffect(() => {
    const initLanguage = async () => {
      try {
        // 1. Check if user already has a saved preference
        const savedPref = await AsyncStorage.getItem("@user_language_preference");
        if (savedPref && ["en", "hi", "ta", "te", "kn", "ml"].includes(savedPref)) {
          setLocale(savedPref as LocaleType);
          return; // Skip location prompt if preference is already saved
        }

        // 2. Default is ALWAYS English ("en")
        setLocale("en");

        // 3. Try location-based IP lookup first to find the Indian state
        const response = await fetch("http://ip-api.com/json/");
        const geoData = await response.json();
        
        if (geoData && geoData.status === "success") {
          const countryCode = geoData.countryCode?.toUpperCase();
          if (countryCode === "IN") {
            const region = (geoData.region || geoData.regionName || "").toUpperCase();
            let suggested: LocaleType | null = null;
            let regionNameStr = geoData.regionName || "your region";
            
            // Map South Indian states to their respective languages, else Hindi
            if (region.includes("TN") || region.includes("TAMIL")) {
              suggested = "ta";
            } else if (region.includes("AP") || region.includes("ANDHRA") || region.includes("TG") || region.includes("TELANGANA")) {
              suggested = "te";
            } else if (region.includes("KA") || region.includes("KARNATAKA")) {
              suggested = "kn";
            } else if (region.includes("KL") || region.includes("KERALA")) {
              suggested = "ml";
            } else {
              suggested = "hi"; // Northern/other Indian states default to Hindi
            }

            // Only prompt if suggested language is set
            if (suggested) {
              setSuggestedLocale(suggested);
              setRegionName(regionNameStr);
              setShowPrompt(true);
            }
          }
        }
      } catch (err) {
        console.warn("Geographical IP check failed, keeping default English:", err);
      }
    };
    initLanguage();
  }, []);

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  const isRTL = false; // All South Indian & English languages are Left-to-Right

  const getSuggestedLanguageName = (code: LocaleType | null): string => {
    switch (code) {
      case "hi": return "Hindi (हिन्दी)";
      case "te": return "Telugu (తెలుగు)";
      case "ta": return "Tamil (தமிழ்)";
      case "kn": return "Kannada (ಕನ್ನಡ)";
      case "ml": return "Malayalam (മലയാളം)";
      default: return "English";
    }
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale: setLocaleAndPersist, t, isRTL }}>
      {children}
      
      <Modal
        visible={showPrompt}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          // If modal is closed, stick with default English and save it
          setLocaleAndPersist("en");
          setShowPrompt(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header Icon */}
            <View style={styles.iconContainer}>
              <Text style={{ fontSize: 28 }}>🗺️</Text>
            </View>

            {/* Title */}
            <Text style={styles.modalTitle}>Language Suggestion</Text>
            
            {/* Subtitle */}
            <Text style={styles.modalSubtitle}>
              We noticed you are accessing the app from <Text style={{ fontWeight: "800", color: "#1C1C1C" }}>{regionName}</Text>.{"\n"}
              Would you like to switch to <Text style={{ fontWeight: "800", color: "#1C1C1C" }}>{getSuggestedLanguageName(suggestedLocale)}</Text>?
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={async () => {
                  if (suggestedLocale) {
                    await setLocaleAndPersist(suggestedLocale);
                  }
                  setShowPrompt(false);
                }}
                style={styles.primaryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  Switch to {getSuggestedLanguageName(suggestedLocale)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await setLocaleAndPersist("en");
                  setShowPrompt(false);
                }}
                style={styles.secondaryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Keep English</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LocalizationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LocalizationProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 30,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1C1C1C",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#71717A",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#1C1C1C",
    borderRadius: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#F4F4F5",
    borderRadius: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#1C1C1C",
    fontSize: 14,
    fontWeight: "700",
  },
});
