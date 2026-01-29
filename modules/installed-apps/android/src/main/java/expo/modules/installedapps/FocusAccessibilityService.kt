package expo.modules.installedapps

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.view.accessibility.AccessibilityEvent
import org.json.JSONArray

class FocusAccessibilityService : AccessibilityService() {

    companion object {
        private const val PREFS_NAME = "FocusAppPrefs"
        private const val BLOCKED_APPS_KEY = "blocked_apps"
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        // Only process window state changed events (app opened/switched)
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return
        }

        val packageName = event.packageName?.toString() ?: return

        // Ignore system UI and launcher packages
        if (isSystemPackage(packageName)) {
            return
        }

        // Check if the opened app is in the blocked list
        if (isAppBlocked(packageName)) {
            // Send user back to home screen
            performGlobalAction(GLOBAL_ACTION_HOME)
        }
    }

    private fun isSystemPackage(packageName: String): Boolean {
        return packageName.startsWith("com.android.") ||
               packageName.startsWith("com.google.android.") ||
               packageName == "com.sec.android.app.launcher" ||
               packageName == "com.miui.home" ||
               packageName == "com.huawei.android.launcher" ||
               packageName == "android" ||
               packageName.contains("launcher") ||
               packageName.contains("systemui")
    }

    private fun isAppBlocked(packageName: String): Boolean {
        val prefs = applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val jsonString = prefs.getString(BLOCKED_APPS_KEY, "[]") ?: "[]"
        
        return try {
            val jsonArray = JSONArray(jsonString)
            for (i in 0 until jsonArray.length()) {
                if (jsonArray.getString(i) == packageName) {
                    return true
                }
            }
            false
        } catch (e: Exception) {
            false
        }
    }

    override fun onInterrupt() {
        // Required override - called when the system wants to interrupt accessibility feedback
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        // Service is connected and ready
    }
}
