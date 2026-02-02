package expo.modules.installedapps

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
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
import android.provider.Settings
import android.app.NotificationManager 
import java.io.ByteArrayOutputStream

class InstalledAppsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("InstalledApps")

    // --- 1. GET INSTALLED APPS ---
    Function("getAppList") {
        val context = appContext.reactContext
        if (context == null) {
            return@Function emptyList<Map<String, String>>()
        }

        val packageManager = context.packageManager
        val installedApps = packageManager.getInstalledPackages(0)
        val appsList = mutableListOf<Map<String, String>>()

        // Explicitly ignored packages (e.g., Play Store)
        val ignoredPackages = setOf(
            "com.android.vending",
            "com.android.settings",
            "com.google.android.packageinstaller"
        )

        for (packageInfo in installedApps) {
            val packageName = packageInfo.packageName

            // 1. Skip explicitly ignored packages
            if (ignoredPackages.contains(packageName)) continue

            // 2. Skip Samsung / Vendor specific system apps (Bloatware filters)
            if (packageName.startsWith("com.sec.") || 
                packageName.startsWith("com.samsung.") ||
                packageName.startsWith("com.qualcomm.") ||
                packageName.startsWith("android.auto.")) {
                continue
            }

            // FIX: Safely get applicationInfo. If it's null, skip this iteration.
            val appInfo = packageInfo.applicationInfo ?: continue

            // 3. Filter out system apps
            // If it is a system app AND NOT an updated system app, skip it.
            // (We generally want to keep updated system apps like YouTube, Chrome, etc.)
            val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
            val isUpdatedSystemApp = (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
            
            if (isSystemApp && !isUpdatedSystemApp) {
                continue
            }

            // 4. CRITICAL: Only show apps that can be launched
            if (packageManager.getLaunchIntentForPackage(packageName) == null) {
                continue
            }
            
            // 5. Extra validation: Filter out "internal" android apps that might still pass
            if (packageName.startsWith("com.android.") && !packageName.contains("chrome")) {
                 continue
            }

            val label = packageManager.getApplicationLabel(appInfo).toString()
            
            // Get category (Android O+)
            val category = getCategoryString(appInfo)

            appsList.add(mapOf(
                "label" to label,
                "packageName" to packageName,
                "category" to category
            ))
        }
        // Return the list to JavaScript
        return@Function appsList.sortedBy { it["label"]?.lowercase() }
    }

    // --- 2. Set Schedule ---
    Function("setSchedule") { startTime: Double, endTime: Double ->
        val context = appContext.reactContext
        if (context != null) {
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            prefs.edit()
                .putLong("schedule_start", startTime.toLong())
                .putLong("schedule_end", endTime.toLong())
                .apply()
        }
    }

    // --- 3. Snooze App ---
    Function("snoozeApp") { packageName: String, durationMinutes: Int ->
        val context = appContext.reactContext
        if (context != null) {
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            val unblockTime = System.currentTimeMillis() + (durationMinutes * 60 * 1000)
            prefs.edit().putLong("snooze_$packageName", unblockTime).apply()
        }
    }

    // --- 4. Set Blocked Apps ---
    Function("setBlockedApps") { apps: List<String> ->
        val context = appContext.reactContext
        if (context != null) {
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            prefs.edit().putStringSet("blocked_packages", apps.toSet()).apply()
        }
    }

    // --- 5. Clear Schedule ---
    Function("clearSchedule") {
        val context = appContext.reactContext
        if (context != null) {
            val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
            prefs.edit()
                .remove("schedule_start")
                .remove("schedule_end")
                .apply()
        }
    }

    // --- 6. Check Permissions ---
    Function("checkPermissions") {
        val context = appContext.reactContext
        
        if (context == null) {
            return@Function mapOf("accessibility" to false, "notifications" to false)
        }
        
        // A. Accessibility Check
        val enabledServices = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: ""
        
        val accessibilityEnabled = enabledServices.contains("FocusAccessibilityService")

        // B. Notification Check
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val notificationEnabled = notificationManager.areNotificationsEnabled()

        return@Function mapOf(
            "accessibility" to accessibilityEnabled,
            "notifications" to notificationEnabled
        )
    }

    // --- 7. Get Settings (Status & Schedule) ---
    Function("getSettings") {
        val context = appContext.reactContext ?: return@Function null
        val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)

        val start = prefs.getLong("schedule_start", 0)
        val end = prefs.getLong("schedule_end", 0)
        val blockedPackages = prefs.getStringSet("blocked_packages", HashSet()) ?: HashSet()
        
        // Check if we are currently in the active window
        val now = System.currentTimeMillis()
        val isActive = start > 0 && now >= start && now <= end

        return@Function mapOf(
            "scheduleStart" to start,
            "scheduleEnd" to end,
            "blockedAppsCount" to blockedPackages.size,
            "blockedApps" to blockedPackages.toList(),
            "isSessionActive" to isActive
        )
    }

    // --- 8. Get App Icon ---
    Function("getAppIcon") { packageName: String ->
        getAppIconBase64(packageName)
    }

    // --- 9. Get Blocked Apps ---
    Function("getBlockedApps") {
        val context = appContext.reactContext ?: return@Function emptyList<String>()
        val prefs = context.getSharedPreferences("ResistorPrefs", Context.MODE_PRIVATE)
        
        val blockedSet = prefs.getStringSet("blocked_packages", emptySet()) ?: emptySet()
        return@Function blockedSet.toList()
    }
  }

  // --- Helper Functions ---

  private fun getCategoryString(appInfo: ApplicationInfo): String {
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
}