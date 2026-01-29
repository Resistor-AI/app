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

class InstalledAppsModule : Module() {
    
    companion object {
        private const val PREFS_NAME = "FocusAppPrefs"
        private const val BLOCKED_APPS_KEY = "blocked_apps"
    }

    override fun definition() = ModuleDefinition {
        Name("InstalledApps")

        // Get list of installed user apps with metadata
        AsyncFunction("getAppList") {
            getInstalledApps()
        }

        // Get Base64 encoded icon for a specific package
        AsyncFunction("getAppIcon") { packageName: String ->
            getAppIconBase64(packageName)
        }

        // Set the list of blocked app package names
        Function("setBlockedApps") { packageNames: List<String> ->
            saveBlockedApps(packageNames)
        }

        // Get the list of currently blocked apps
        Function("getBlockedApps") {
            getBlockedApps()
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
