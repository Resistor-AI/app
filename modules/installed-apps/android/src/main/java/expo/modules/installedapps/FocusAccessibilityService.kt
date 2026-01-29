package expo.modules.installedapps

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class FocusAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.packageName == null) return

        // Only trigger when a new window/app opens
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        // 1. Define 'openedApp' once here
        val openedApp = event.packageName.toString()

        val prefs: SharedPreferences = getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
        val currentTime = System.currentTimeMillis()

        // --- CHECK 1: SCHEDULE ---
        val startTime = prefs.getLong("schedule_start", 0)
        val endTime = prefs.getLong("schedule_end", 0)

        // If outside working hours, DO NOT BLOCK.
        // Also check if startTime is 0 (meaning no schedule set)
        if (startTime != 0L && (currentTime < startTime || currentTime > endTime)) {
            return
        }

        // --- CHECK 2: BLACKLIST ---
        // ERROR WAS HERE: "val openedApp" was duplicated. I removed it.
        val blockedPackages = prefs.getStringSet("blocked_packages", HashSet()) ?: HashSet()

        if (blockedPackages.contains(openedApp)) {
            
            // --- CHECK 3: SNOOZE (Did they pass the challenge?) ---
            val snoozeUntil = prefs.getLong("snooze_$openedApp", 0)
            
            if (currentTime < snoozeUntil) {
                // User has "earned" this time. Let them pass.
                return
            }

            // --- BLOCK ACTION ---
            Log.d("FocusService", "Blocking $openedApp (Inside Schedule & Not Snoozed)")
            
            // Launch the Shield Activity
            try {
                // Ensure this package name matches your android/app/build.gradle applicationId exactly!
                val intent = Intent(this, Class.forName("com.pragmaticaweds.resistorai.BlockActivity")) 
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NO_ANIMATION)
                intent.putExtra("blocked_package", openedApp)
                startActivity(intent)
            } catch (e: Exception) {
                Log.e("FocusService", "Failed to launch BlockActivity", e)
                // Fallback to home screen if BlockActivity fails
                performGlobalAction(GLOBAL_ACTION_HOME)
            }
        }
    }

    override fun onInterrupt() {
        // Required override
    }
}