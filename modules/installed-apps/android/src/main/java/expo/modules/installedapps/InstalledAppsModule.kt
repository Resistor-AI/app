package expo.modules.installedapps

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream

class InstalledAppsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("InstalledApps")

    AsyncFunction("getApps") {
      getApps()
    }
  }

  private fun getApps(): List<Map<String, Any?>> {
    val context = appContext.reactContext ?: return emptyList()
    val packageManager = context.packageManager
    
    // Get ALL apps
    val installedPackages = packageManager.getInstalledPackages(0)

    return installedPackages.mapNotNull { packageInfo ->
      val appInfo = packageInfo.applicationInfo
      
      // Filter out system apps
      // Apps that are updated system apps (FLAG_UPDATED_SYSTEM_APP) are usually okay to show?
      // Actually, user wants to exempt system apps. 
      // Strictly system apps: (flags & ApplicationInfo.FLAG_SYSTEM) != 0
      // We also verify if it has a launch intent to ensure it's a "visible" app.
      
      val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0
      val isUpdatedSystemApp = (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0
      
      // We generally skip system apps unless they were updated (user installed update).
      // But user said "exempt system app".
      if (isSystemApp && !isUpdatedSystemApp) {
         return@mapNotNull null
      }
      
      // Also check if it has a launcher intent (is it an app user can open?)
      val launchIntent = packageManager.getLaunchIntentForPackage(packageInfo.packageName)
      if (launchIntent == null) {
          return@mapNotNull null
      }

      val label = appInfo.loadLabel(packageManager).toString()
      val packageName = packageInfo.packageName
      val icon = getAppIconBase64(packageManager, appInfo)

      mapOf(
        "label" to label,
        "packageName" to packageName,
        "icon" to icon
      )
    }.sortedBy { (it["label"] as String).lowercase() }
  }

  private fun getAppIconBase64(pm: PackageManager, appInfo: ApplicationInfo): String? {
    return try {
      val drawable = appInfo.loadIcon(pm)
      val bitmap = drawableToBitmap(drawable)
      val outputStream = ByteArrayOutputStream()
      // Resize to reduce size? 100x100 is enough for list
      val scaledBitmap = Bitmap.createScaledBitmap(bitmap, 100, 100, true)
      scaledBitmap.compress(Bitmap.CompressFormat.PNG, 70, outputStream)
      Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
    } catch (e: Exception) {
      null
    }
  }

  private fun drawableToBitmap(drawable: Drawable): Bitmap {
    if (drawable is BitmapDrawable) {
      if (drawable.bitmap != null) {
        return drawable.bitmap
      }
    }
    val bitmap = if (drawable.intrinsicWidth <= 0 || drawable.intrinsicHeight <= 0) {
      Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)
    } else {
      Bitmap.createBitmap(drawable.intrinsicWidth, drawable.intrinsicHeight, Bitmap.Config.ARGB_8888)
    }
    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, canvas.width, canvas.height)
    drawable.draw(canvas)
    return bitmap
  }
}
