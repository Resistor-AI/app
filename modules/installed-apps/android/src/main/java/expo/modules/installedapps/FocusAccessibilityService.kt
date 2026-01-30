package expo.modules.installedapps

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_HOME

class FocusAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.packageName == null) return

        // Only trigger when a new window/app opens
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val openedApp = event.packageName.toString()
        val prefs: SharedPreferences = getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
        val currentTime = System.currentTimeMillis()

        // --- CHECK 1: SCHEDULE (THE FIX) ---
        val startTime = prefs.getLong("schedule_start", 0)
        val endTime = prefs.getLong("schedule_end", 0)

        // Condition A: If NO schedule is set (0), DO NOT BLOCK.
        if (startTime == 0L || endTime == 0L) {
            return
        }

        // Condition B: If we are outside the active window, DO NOT BLOCK.
        if (currentTime < startTime || currentTime > endTime) {
            return
        }

        // --- CHECK 2: BLACKLIST ---
        val blockedPackages = prefs.getStringSet("blocked_packages", HashSet()) ?: HashSet()

        if (blockedPackages.contains(openedApp)) {
            
            // --- CHECK 3: SNOOZE (Did they pass the challenge?) ---
            val snoozeUntil = prefs.getLong("snooze_$openedApp", 0)
            
            if (currentTime < snoozeUntil) {
                // User has "earned" this time. Let them pass.
                return
            }

            // --- BLOCK ACTION ---
            Log.d("FocusService", "Blocking $openedApp (Session Active & Not Snoozed)")
            
            try {
                // IMPORTANT: Ensure this matches your package name in android/app/build.gradle
                // It is likely 'com.pragmaticaweds.resistorai' based on your previous errors
                val intent = Intent(this, Class.forName("com.pragmaticaweds.resistorai.BlockActivity")) 
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NO_ANIMATION)
                intent.putExtra("blocked_package", openedApp)
                startActivity(intent)
            } catch (e: Exception) {
                Log.e("FocusService", "Failed to launch BlockActivity", e)
                performGlobalAction(GLOBAL_ACTION_HOME)
            }
        }
    }

    override fun onInterrupt() {
        // Required override
    }
}