const {
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");

const fs = require("fs");
const path = require("path");

const SERVICE_NAME = "ResistorAccessibilityService";

const withAccessibilityServiceManifest = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    const serviceName = `${config.android.package}.${SERVICE_NAME}`;

    // Check if service already exists
    const existingService = mainApplication.service.find(
      (s) => s.$["android:name"] === serviceName,
    );

    if (!existingService) {
      mainApplication.service.push({
        $: {
          "android:name": serviceName,
          "android:permission": "android.permission.BIND_ACCESSIBILITY_SERVICE",
          "android:exported": "false", // Important for security
          "android:label": "@string/accessibility_service_label",
          "android:description": "@string/accessibility_service_description",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name":
                    "android.accessibilityservice.AccessibilityService",
                },
              },
            ],
          },
        ],
        "meta-data": [
          {
            $: {
              "android:name": "android.accessibilityservice",
              "android:resource": "@xml/accessibility_service_config",
            },
          },
        ],
      });
    }

    return config;
  });
};

const withAccessibilityServiceStrings = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const stringsPath = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/values/strings.xml",
      );

      // Should verify directories exist, but Expo usually ensures 'values' exists.
      let stringsContent = await fs.promises.readFile(stringsPath, "utf8");

      if (!stringsContent.includes("accessibility_service_label")) {
        // Simple string injection - could be more robust with XML parser but this works for standard files
        stringsContent = stringsContent.replace(
          "</resources>",
          '    <string name="accessibility_service_label">Resistor AI Shield</string>\n    <string name="accessibility_service_description">Resistor AI uses this service to help you block distracting apps when you need to focus.</string>\n</resources>',
        );
        await fs.promises.writeFile(stringsPath, stringsContent);
      }
      return config;
    },
  ]);
};

const withAccessibilityServiceConfig = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const resDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/xml",
      );

      await fs.promises.mkdir(resDir, { recursive: true });

      const configPath = path.join(resDir, "accessibility_service_config.xml");
      const configContent = `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:customDescription="@string/accessibility_service_description"
    android:description="@string/accessibility_service_description"
    android:accessibilityEventTypes="typeWindowContentChanged|typeWindowStateChanged"
    android:accessibilityFlags="flagDefault|flagRetrieveInteractiveWindows|flagIncludeNotImportantViews"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
    android:packageNames="com.instagram.android,com.zhiliaoapp.musically,com.twitter.android,com.facebook.katana" 
/>`;
      // Note: packageNames can be dynamic or omitted to listen to all.
      // For "App Selection" we ideally want to listen to ALL so we can detect any app,
      // then filter in our logic. Omitting packageNames listens to all.
      // But for privacy/performance showing a filtered list in config is "safer" looking?
      // Actually, usually app blockers list NONE in config so they get ALL events.
      // Let's remove packageNames to allow blocking ANY app selected by user.

      const openConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_description"
    android:accessibilityEventTypes="typeWindowStateChanged"
    android:accessibilityFlags="flagDefault"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
/>`;
      // Updated config for broader compatibility and less intrusive monitoring if possible.
      // "typeWindowStateChanged" is usually enough to detect "App Opened".

      await fs.promises.writeFile(configPath, openConfigContent);
      return config;
    },
  ]);
};

// Also need to create the Java class for the service!
const withAccessibilityServiceJava = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const packagePath = config.android.package.replace(/\./g, "/");
      const javaDir = path.join(
        config.modRequest.platformProjectRoot,
        `app/src/main/java/${packagePath}`,
      );

      await fs.promises.mkdir(javaDir, { recursive: true });
      const servicePath = path.join(javaDir, `${SERVICE_NAME}.java`);

      const javaContent = `package ${config.android.package};

import android.accessibilityservice.AccessibilityService;
import android.view.accessibility.AccessibilityEvent;

public class ${SERVICE_NAME} extends AccessibilityService {
    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // App blocking logic will go here later.
        // For now, this service just needs to exist to be enabled in settings.
    }

    @Override
    public void onInterrupt() {
    }
}
`;
      await fs.promises.writeFile(servicePath, javaContent);
      return config;
    },
  ]);
};

const withAccessibilityService = (config) => {
  config = withAccessibilityServiceManifest(config);
  config = withAccessibilityServiceConfig(config);
  config = withAccessibilityServiceStrings(config);
  config = withAccessibilityServiceJava(config);
  return config;
};

module.exports = withAccessibilityService;
