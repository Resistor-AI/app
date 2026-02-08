import { useQuery } from '@tanstack/react-query';
import InstalledApps, { AppInfo } from '../../modules/installed-apps'; // Adjust path to your module

const CATEGORY_PRIORITY: Record<string, number> = {
  Social: 1,
  Game: 2,
  Video: 3,
  Audio: 4,
  News: 5,
  Image: 6,
  Productivity: 7,
  Maps: 8,
};

export const useInstalledApps = () => {
  return useQuery({
    queryKey: ['installedApps'],
    queryFn: async () => {
      const apps = await InstalledApps.getAppList();
      
      const grouped: Record<string, AppInfo[]> = {};
      apps.forEach((app) => {
        const category = app.category || "Other";
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(app);
      });

      // Transform to SectionList format and sort
      return Object.entries(grouped)
        .map(([title, data]) => ({ title, data }))
        .sort((a, b) => {
          const priorityA = CATEGORY_PRIORITY[a.title] || 999;
          const priorityB = CATEGORY_PRIORITY[b.title] || 999;
          
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          return a.title.localeCompare(b.title);
        });
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 mins
  });
};

export const useAppIcon = (packageName: string) => {
  return useQuery({
    queryKey: ['appIcon', packageName],
    queryFn: () => InstalledApps.getAppIcon(packageName),
    enabled: !!packageName,
    staleTime: Infinity,
  });
};
