import React, { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import Svg, { Path } from "react-native-svg";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onPress?: () => void | Promise<void>;
}

export default function GoogleLoginButton({ onSuccess, onError, onPress }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (onPress) {
      try {
        await onPress();
      } catch (e) {
        console.warn("GoogleLoginButton onPress error:", e);
      }
    }
    setLoading(true);
    try {
      // Point redirectTo parameter directly to the requested 'hostapp://google-auth' deep link
      const redirectUrl = 'hostapp://google-auth';
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (oauthError) {
        if (onError) onError(oauthError.message);
        else Alert.alert("Login Error", oauthError.message);
        setLoading(false);
        return;
      }

      if (data?.url) {
        // Open authorization sheet in browser modal and catch deep-link redirect back into the app
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          // Parse tokens returned from Supabase OAuth redirect URL
          const parsed = Linking.parse(result.url);
          let { access_token, refresh_token } = parsed.queryParams || {};
          
          if (!access_token || !refresh_token) {
            // Support hash fragment query parameter fallback
            const hashIndex = result.url.indexOf('#');
            if (hashIndex !== -1) {
              const hash = result.url.substring(hashIndex + 1);
              const params = new URLSearchParams(hash);
              access_token = params.get('access_token') || undefined;
              refresh_token = params.get('refresh_token') || undefined;
            }
          }

          if (access_token && refresh_token) {
            // Set session client-side to officially log the user in
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: access_token as string,
              refresh_token: refresh_token as string,
            });

            if (sessionError) {
              if (onError) onError(sessionError.message);
              else Alert.alert("Session Error", sessionError.message);
            } else {
              if (onSuccess) onSuccess();
            }
          } else {
            const errMessage = "Could not retrieve access tokens from redirect URL.";
            if (onError) onError(errMessage);
            else Alert.alert("Authentication Failed", errMessage);
          }
        }
      }
    } catch (err: any) {
      const errMsg = err?.message || "An unexpected error occurred during Google Sign-in";
      if (onError) onError(errMsg);
      else Alert.alert("Error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleGoogleLogin}
      disabled={loading}
      className="h-16 rounded-full flex-row items-center justify-center border border-zinc-200 bg-white active:opacity-85 shadow-sm"
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color="#18181B" />
      ) : (
        <>
          <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 12 }}>
            <Path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <Path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <Path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <Path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </Svg>
          <Text className="text-[#18181B] text-sm font-black uppercase tracking-wider">
            Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
