const CategoryEnumProjectsMap = {
  "Mobile Application": "Mobile Application",
  Website: "Website",
  Stores: "Stores",
  Marketing: "Marketing",
  "Brand Identity": "Brand Identity",
};

const CategoryEnumBlogsMap = {
  "Digital Marketing Services": "Digital Marketing Services",
  "Web & App Development": "Web & App Development",
  Other: "Other",
};
const CategoryEnumServicesMap = {
  "Mobile Application": "Mobile Application",
  Website: "Website",
  "Graphic Design": "Graphic Design",
  "Online Store": "Online Store",
  "Corporate System": "Corporate System",
  "Motion Graphic": "Motion Graphic",
  "Web Hosting": "Web Hosting",
  "AI Services": "AI Services",
  SEO: "SEO",
  "Social Marketing": "Social Marketing",
};

export const CategoryEnum = {
  Projects: CategoryEnumProjectsMap,
  Blogs: CategoryEnumBlogsMap,
  Services: CategoryEnumServicesMap,
};

export const statusOptions = [
  { label: "Planning", value: "planning" },
  { label: "In Progress", value: "in-progress" },
  { label: "Review", value: "review" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on-hold" },
];

export const platformOptions = [
  { label: "Web", value: "web" },
  { label: "iOS", value: "ios" },
  { label: "Android", value: "android" },
  { label: "Desktop", value: "desktop" },
  { label: "Cross-platform", value: "cross-platform" },
];

export const screenTypeOptions = [
  { label: "Mobile", value: "mobile" },
  { label: "Tablet", value: "tablet" },
  { label: "Desktop", value: "desktop" },
  { label: "Large Screen", value: "large-screen" },
];

export const regionOptions = [
  { label: "North America", value: "north-america" },
  { label: "Europe", value: "europe" },
  { label: "Asia Pacific", value: "asia-pacific" },
  { label: "Latin America", value: "latin-america" },
  { label: "Middle East & Africa", value: "mea" },
  { label: "Global", value: "global" },
];

export const languages = [
  { label: "English", value: "en" },
  { label: "Arabic", value: "ar" },
  { label: "French", value: "fr" },
  { label: "Spanish", value: "es" },
]
