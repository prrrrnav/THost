/**
 * Icon shim — requires Lucide icons individually from their CJS source files.
 * Using require() avoids ESM/CJS interop issues (ReferenceError) with Metro.
 */

// Navigation
const Home = require("../../node_modules/lucide-react-native/dist/cjs/icons/house.js");
const Users = require("../../node_modules/lucide-react-native/dist/cjs/icons/users.js");
const Wallet = require("../../node_modules/lucide-react-native/dist/cjs/icons/wallet.js");
const User = require("../../node_modules/lucide-react-native/dist/cjs/icons/user.js");
const ReceiptText = require("../../node_modules/lucide-react-native/dist/cjs/icons/receipt-text.js");

// Dashboard
const Bell = require("../../node_modules/lucide-react-native/dist/cjs/icons/bell.js");
const Building = require("../../node_modules/lucide-react-native/dist/cjs/icons/building.js");
const IndianRupee = require("../../node_modules/lucide-react-native/dist/cjs/icons/indian-rupee.js");
const Bed = require("../../node_modules/lucide-react-native/dist/cjs/icons/bed.js");
const Receipt = require("../../node_modules/lucide-react-native/dist/cjs/icons/receipt.js");
const UserPlus = require("../../node_modules/lucide-react-native/dist/cjs/icons/user-plus.js");
const Megaphone = require("../../node_modules/lucide-react-native/dist/cjs/icons/megaphone.js");
const PlusCircle = require("../../node_modules/lucide-react-native/dist/cjs/icons/circle-plus.js");
const BarChart3 = require("../../node_modules/lucide-react-native/dist/cjs/icons/chart-column.js");
const Zap = require("../../node_modules/lucide-react-native/dist/cjs/icons/zap.js");

// Login
const Building2 = require("../../node_modules/lucide-react-native/dist/cjs/icons/building-2.js");
const Mail = require("../../node_modules/lucide-react-native/dist/cjs/icons/mail.js");
const Lock = require("../../node_modules/lucide-react-native/dist/cjs/icons/lock.js");

// Tenants
const Search = require("../../node_modules/lucide-react-native/dist/cjs/icons/search.js");
const Phone = require("../../node_modules/lucide-react-native/dist/cjs/icons/phone.js");
const MessageSquare = require("../../node_modules/lucide-react-native/dist/cjs/icons/message-square.js");

// Payments
const Clock = require("../../node_modules/lucide-react-native/dist/cjs/icons/clock.js");
const CreditCard = require("../../node_modules/lucide-react-native/dist/cjs/icons/credit-card.js");
const ChevronRight = require("../../node_modules/lucide-react-native/dist/cjs/icons/chevron-right.js");
const ChevronDown = require("../../node_modules/lucide-react-native/dist/cjs/icons/chevron-down.js");
const FileText = require("../../node_modules/lucide-react-native/dist/cjs/icons/file-text.js");
const TrendingUp = require("../../node_modules/lucide-react-native/dist/cjs/icons/trending-up.js");

// Expenses
const Droplets = require("../../node_modules/lucide-react-native/dist/cjs/icons/droplets.js");
const Wrench = require("../../node_modules/lucide-react-native/dist/cjs/icons/wrench.js");
const Globe = require("../../node_modules/lucide-react-native/dist/cjs/icons/globe.js");
const TrendingDown = require("../../node_modules/lucide-react-native/dist/cjs/icons/trending-down.js");

// Profile
const BellRing = require("../../node_modules/lucide-react-native/dist/cjs/icons/bell-ring.js");
const UserCircle2 = require("../../node_modules/lucide-react-native/dist/cjs/icons/circle-user-round.js");
const ShieldCheck = require("../../node_modules/lucide-react-native/dist/cjs/icons/shield-check.js");
const LogOut = require("../../node_modules/lucide-react-native/dist/cjs/icons/log-out.js");
const Heart = require("../../node_modules/lucide-react-native/dist/cjs/icons/heart.js");

// AI
const Sparkles = require("../../node_modules/lucide-react-native/dist/cjs/icons/sparkles.js");

// General
const X = require("../../node_modules/lucide-react-native/dist/cjs/icons/x.js");
const Check = require("../../node_modules/lucide-react-native/dist/cjs/icons/check.js");
const Calendar = require("../../node_modules/lucide-react-native/dist/cjs/icons/calendar.js");
const Plus = require("../../node_modules/lucide-react-native/dist/cjs/icons/plus.js");
const Edit2 = require("../../node_modules/lucide-react-native/dist/cjs/icons/pencil.js");
const Trash2 = require("../../node_modules/lucide-react-native/dist/cjs/icons/trash-2.js");
const ArrowLeft = require("../../node_modules/lucide-react-native/dist/cjs/icons/arrow-left.js");

export {
  Home, Users, Wallet, User, ReceiptText,
  Bell, Building, IndianRupee, Bed, Receipt, UserPlus, Megaphone, PlusCircle, BarChart3, Zap,
  Building2, Mail, Lock,
  Search, Phone, MessageSquare,
  Clock, CreditCard, ChevronRight, ChevronDown, FileText, TrendingUp,
  Droplets, Wrench, Globe, TrendingDown,
  BellRing, UserCircle2, ShieldCheck, LogOut, Heart,
  Sparkles, X, Check, Calendar, Plus, Edit2, Trash2, ArrowLeft
};
