package expo.modules.installedapps

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONArray
import java.io.ByteArrayOutputStream
import android.provider.Settings
import android.text.TextUtils
import androidx.core.app.NotificationManagerCompat

class InstalledAppsModule : Module() {
    
    companion object {
        private const val PREFS_NAME = "FocusAppPrefs"
        private const val BLOCKED_APPS_KEY = "blocked_apps"
    }

    override fun definition() = ModuleDefinition {
        Name("InstalledApps")

        Function("getAppList") {
            getInstalledApps()
        }

        Function("getAppIcon") { packageName: String ->
            getAppIconBase64(packageName)
        }

        // Function to Save Blocked Apps from React Native
        Function("setBlockedApps") { apps: List<String> ->
            val context = appContext.reactContext ?: return@Function
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            
            // Save as a Set of Strings
            prefs.edit().putStringSet("blocked_packages", apps.toSet()).apply()
        }

        // 1. Set the Working Hours (e.g., 9:00 AM to 5:00 PM today)
        // Pass in Unix Timestamps (milliseconds)
        Function("setSchedule") { startTime: Double, endTime: Double ->
            val context = appContext.reactContext ?: return@Function
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            
            prefs.edit()
                .putLong("schedule_start", startTime.toLong())
                .putLong("schedule_end", endTime.toLong())
                .apply()
        }

        // 2. Snooze Logic (The Reward)
        // Called when user solves a challenge. Unblocks specific app for X minutes.
        Function("snoozeApp") { packageName: String, durationMinutes: Int ->
            val context = appContext.reactContext ?: return@Function
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            
            val unblockTime = System.currentTimeMillis() + (durationMinutes * 60 * 1000)
            prefs.edit().putLong("snooze_$packageName", unblockTime).apply()
        }

        // Function to Get Blocked Apps (to restore UI state)
        Function("getBlockedApps") {
            val context = appContext.reactContext ?: return@Function emptyList<String>()
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            
            val blockedSet = prefs.getStringSet("blocked_packages", emptySet()) ?: emptySet()
            return@Function blockedSet.toList()
        }

        Function("checkPermissions") {
            val context = appContext.reactContext ?: return@Function mapOf("accessibility" to false, "notifications" to false)
            
            // 1. Check Accessibility Permission
            var accessibilityEnabled = false
            // Construct the service ID: "com.package.name/full.class.name"
            val expectedServiceName = "${context.packageName}/${expo.modules.installedapps.FocusAccessibilityService::class.java.canonicalName}"
            
            val enabledServices = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
            
            if (!TextUtils.isEmpty(enabledServices)) {
                val colonSplitter = TextUtils.SimpleStringSplitter(':')
                colonSplitter.setString(enabledServices)
                while (colonSplitter.hasNext()) {
                    val componentName = colonSplitter.next()
                    // Check exact match or partial match to be safe
                    if (componentName.equals(expectedServiceName, ignoreCase = true) || 
                        componentName.contains("FocusAccessibilityService")) {
                        accessibilityEnabled = true
                        break
                    }
                }
            }

            // 2. Check Notification Permission
            val notificationEnabled = NotificationManagerCompat.from(context).areNotificationsEnabled()

            return@Function mapOf(
                "accessibility" to accessibilityEnabled,
                "notifications" to notificationEnabled
            )
        }
    }

    private fun getInstalledApps(): List<Map<String, String>> {
        val context = appContext.reactContext ?: return emptyList()
        val pm = context.packageManager
        val apps = mutableListOf<Map<String, String>>()

        val installedApps = pm.getInstalledApplications(PackageManager.GET_META_DATA)

        for (appInfo in installedApps) {
            // CRITICAL FILTER 1: Exclude system apps
            if ((appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0) {
                continue
            }

            // CRITICAL FILTER 2: Exclude non-launchable apps (background services, etc.)
            val launchIntent: Intent? = pm.getLaunchIntentForPackage(appInfo.packageName)
            if (launchIntent == null) {
                continue
            }

            // Get app label
            val label = pm.getApplicationLabel(appInfo).toString()

            // Get category (Android O+)
            val category = getCategoryString(appInfo)

            apps.add(mapOf(
                "label" to label,
                "packageName" to appInfo.packageName,
                "category" to category
            ))
        }

        // Sort alphabetically by label
        return apps.sortedBy { it["label"]?.lowercase() }
    }

    private fun getCategoryString(appInfo: ApplicationInfo): String {
        // Category is only available on Android O (API 26) and above
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return "Unknown"
        }

        return when (appInfo.category) {
            ApplicationInfo.CATEGORY_GAME -> "Game"
            ApplicationInfo.CATEGORY_AUDIO -> "Audio"
            ApplicationInfo.CATEGORY_VIDEO -> "Video"
            ApplicationInfo.CATEGORY_IMAGE -> "Image"
            ApplicationInfo.CATEGORY_SOCIAL -> "Social"
            ApplicationInfo.CATEGORY_NEWS -> "News"
            ApplicationInfo.CATEGORY_MAPS -> "Maps"
            ApplicationInfo.CATEGORY_PRODUCTIVITY -> "Productivity"
            else -> "Unknown"
        }
    }

    private fun getAppIconBase64(packageName: String): String? {
        val context = appContext.reactContext ?: return null
        val pm = context.packageManager

        return try {
            val drawable = pm.getApplicationIcon(packageName)
            val bitmap = drawableToBitmap(drawable)
            bitmapToBase64(bitmap)
        } catch (e: PackageManager.NameNotFoundException) {
            null
        }
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        if (drawable is BitmapDrawable) {
            if (drawable.bitmap != null) {
                return drawable.bitmap
            }
        }

        // Create bitmap with appropriate size
        val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 96
        val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 96

        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)

        return bitmap
    }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        val byteArray = outputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.NO_WRAP)
    }

    private fun saveBlockedApps(packageNames: List<String>) {
        val context = appContext.reactContext ?: return
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        
        val jsonArray = JSONArray(packageNames)
        prefs.edit()
            .putString(BLOCKED_APPS_KEY, jsonArray.toString())
            .apply()
    }

    private fun getBlockedApps(): List<String> {
        val context = appContext.reactContext ?: return emptyList()
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        
        val jsonString = prefs.getString(BLOCKED_APPS_KEY, "[]") ?: "[]"
        val jsonArray = JSONArray(jsonString)
        
        val result = mutableListOf<String>()
        for (i in 0 until jsonArray.length()) {
            result.add(jsonArray.getString(i))
        }
        return result
    }
}
