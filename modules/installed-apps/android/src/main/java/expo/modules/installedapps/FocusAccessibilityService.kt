package expo.modules.installedapps

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class FocusAccessibilityService : AccessibilityService() {

    companion object {
        @Volatile
        var isRunning = false
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        isRunning = true
        Log.d("FocusService", "Service connected and running")
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        Log.d("FocusService", "Service destroyed")
    }

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
            val count = prefs.getInt("distraction_count", 0)
            prefs.edit().putInt("distraction_count", count + 1).apply()
            Log.d("FocusService", "Blocking $openedApp (Session Active & Not Snoozed)")

            try {
                // Use dev scheme in debug, production scheme in release
                val isDebug = (applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
                val scheme = if (isDebug) "exp+resistor-ai" else "resistorai"
                val deepLinkUri = Uri.parse("$scheme:///block?package=$openedApp")
                val intent = Intent(Intent.ACTION_VIEW, deepLinkUri)
                intent.addFlags(
                    Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP
                )
                startActivity(intent)
            } catch (e: Exception) {
                Log.e("FocusService", "Failed to launch block screen", e)
                performGlobalAction(GLOBAL_ACTION_HOME)
            }
        }
    }

    override fun onInterrupt() {
        // Required override
    }
}